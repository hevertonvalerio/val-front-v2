import { useState, useRef, useEffect } from 'react'
import { Send, Palette, Heart } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import indexedDBService from '../services/indexedDBService'
import langsmithApi from '../services/langsmithApi'

function ChatContainer({ activeTheme, setActiveTheme, currentSession, onSessionUpdate }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const chatAreaRef = useRef(null)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const SESSION_EXPIRY_DAYS = 7


  const themeColors = {
    cromoterapia: {
      header: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400',
      userMsg: 'bg-gradient-to-r from-purple-600 to-pink-500',
      welcome: 'bg-gradient-to-br from-purple-100 to-pink-100',
      welcomeTitle: 'text-purple-600',
      icon: 'text-purple-600',
    },
    metafisica: {
      header: 'bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500',
      userMsg: 'bg-gradient-to-r from-teal-500 to-blue-500',
      welcome: 'bg-gradient-to-br from-teal-100 to-blue-100',
      welcomeTitle: 'text-teal-600',
      icon: 'text-teal-600',
    }
  }

  const colors = themeColors[activeTheme]

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (currentSession) {
      loadSessionMessages()
      if (currentSession.threadId) {
        langsmithApi.setThreadId(currentSession.threadId)
      } else {
        langsmithApi.clearThread()
      }
    }
  }, [currentSession?.id])

  useEffect(() => {
    clearExpiredSessions()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        const windowHeight = window.innerHeight
        const diff = windowHeight - viewportHeight
        setKeyboardHeight(diff > 50 ? diff : 0)
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      window.visualViewport.addEventListener('scroll', handleResize)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
        window.visualViewport.removeEventListener('scroll', handleResize)
      }
    }
  }, [])

  const clearExpiredSessions = async () => {
    try {
      const deletedCount = await indexedDBService.clearExpiredSessions(SESSION_EXPIRY_DAYS)
      if (deletedCount > 0) {
        console.log(`${deletedCount} sessões expiradas foram removidas`)
      }
    } catch (error) {
      console.error('Erro ao limpar sessões expiradas:', error)
    }
  }

  const loadSessionMessages = async () => {
    if (!currentSession) return
    
    try {
      const session = await indexedDBService.getSession(currentSession.id)
      if (session && session.messages) {
        setMessages(session.messages)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      setMessages([])
    }
  }

  const generateSessionTitle = (text) => {
    const maxLength = 40
    const cleanText = text.trim()
    
    if (cleanText.length <= maxLength) {
      return cleanText
    }
    
    return cleanText.substring(0, maxLength) + '...'
  }

  const saveSessionMessages = async (updatedMessages) => {
    if (!currentSession) return

    try {
      const session = {
        ...currentSession,
        messages: updatedMessages,
        messageCount: updatedMessages.length,
        updatedAt: Date.now()
      }
      await indexedDBService.saveSession(session)
      if (onSessionUpdate) {
        onSessionUpdate(session)
      }
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error)
    }
  }

  const sendMessage = async () => {
    const text = inputValue.trim()
    if (!text) return

    let session = currentSession

    if (!session) {
      session = {
        id: crypto.randomUUID(),
        title: generateSessionTitle(text),
        messages: [],
        messageCount: 0,
        threadId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    }

    const newUserMessage = { text, isUser: true, timestamp: Date.now() }
    const updatedMessages = [...messages, newUserMessage]
    setMessages(updatedMessages)
    setInputValue('')
    setIsTyping(true)
    
    session.messages = updatedMessages
    session.messageCount = updatedMessages.length
    session.updatedAt = Date.now()

    if (session.isTemporary) {
      session.title = generateSessionTitle(text)
      delete session.isTemporary
    }

    try {
      if (!session.threadId) {
        const thread = await langsmithApi.createThread()
        session.threadId = thread.thread_id
        
        await indexedDBService.saveSession(session)
        if (onSessionUpdate) {
          onSessionUpdate(session)
        }
      } else {
        await indexedDBService.saveSession(session)
        if (onSessionUpdate) {
          onSessionUpdate(session)
        }
      }

      const stream = await langsmithApi.sendMessage(text)
      let botResponse = ''
      let messageIndex = null

      for await (const chunk of langsmithApi.streamResponse(stream)) {
        const eventType = chunk._eventType

        if (eventType === 'token' && chunk.token) {
          botResponse += chunk.token

          setMessages(prev => {
            const newMessages = [...prev]
            if (messageIndex === null) {
              newMessages.push({ text: botResponse, isUser: false, timestamp: Date.now() })
              messageIndex = newMessages.length - 1
            } else {
              newMessages[messageIndex] = { ...newMessages[messageIndex], text: botResponse }
            }
            return newMessages
          })
        } else if (eventType === 'values' && chunk.messages) {
          const lastAi = [...chunk.messages].reverse().find(m => m.type === 'ai' || m.role === 'assistant')
          if (lastAi?.content) {
            botResponse = lastAi.content
            setMessages(prev => {
              const newMessages = [...prev]
              if (messageIndex === null) {
                newMessages.push({ text: botResponse, isUser: false, timestamp: Date.now() })
                messageIndex = newMessages.length - 1
              } else {
                newMessages[messageIndex] = { ...newMessages[messageIndex], text: botResponse }
              }
              return newMessages
            })
          }
        }
      }

      if (!botResponse) {
        botResponse = 'Desculpe, não consegui processar sua mensagem.'
      }
      
      const botMessage = { text: botResponse, isUser: false, timestamp: Date.now() }
      const finalMessages = [...updatedMessages, botMessage]
      setMessages(finalMessages)
      await saveSessionMessages(finalMessages)
    } catch (error) {
      console.error('Erro:', error)
      const errorMessage = { text: 'Ops! Ocorreu um erro. Tente novamente.', isUser: false, timestamp: Date.now() }
      const errorMessages = [...updatedMessages, errorMessage]
      setMessages(errorMessages)
      await saveSessionMessages(errorMessages)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const welcomeMessage = activeTheme === 'cromoterapia' 
    ? 'Olá! Sou seu assistente de Cromoterapia. Posso ajudar você a entender como as cores influenciam sua saúde e bem-estar.'
    : 'Olá! Sou seu assistente de Metafísica da Saúde. Posso ajudar você a compreender as causas emocionais por trás dos sintomas físicos.'

  const chatTitle = activeTheme === 'cromoterapia' 
    ? 'Chatbot Cromoterapia' 
    : 'Chatbot Metafísica da Saúde'

  return (
    <div 
      ref={containerRef}
      className="bg-white h-full flex flex-col"
      style={{ 
        paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined,
        overflow: 'hidden'
      }}
    >
      {/* Header do Chat */}
      <div className={`${colors.header} text-white pl-16 pr-3 py-3 sm:px-4 sm:py-3 flex items-center justify-between lg:pl-4`}>
        <div className="flex items-center gap-3 sm:gap-3">
          <div className="w-10 h-10 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0 p-1">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-6 sm:h-6 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-sm">Valcapelli</h3>
          </div>
        </div>
        
        {/* Seletor de Temas - apenas desktop */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => setActiveTheme('cromoterapia')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeTheme === 'cromoterapia'
                ? 'bg-white text-purple-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Cromoterapia</span>
          </button>
          
          <button
            onClick={() => setActiveTheme('metafisica')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeTheme === 'metafisica'
                ? 'bg-white text-teal-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Metafísica</span>
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div ref={chatAreaRef} className="flex-1 min-h-0 overflow-y-auto p-1.5 sm:p-5 flex flex-col gap-1.5 sm:gap-4 overscroll-contain">
        {/* Mensagens */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] sm:max-w-[85%] px-3 py-1.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.isUser
                ? `${colors.userMsg} text-white self-end rounded-br-sm`
                : 'bg-gray-100 text-gray-700 self-start rounded-bl-sm'
            }`}
          >
            {msg.isUser ? (
              msg.text
            ) : (
              <div className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="pl-1">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    h1: ({children}) => <h1 className="text-lg font-bold mb-2 mt-3">{children}</h1>,
                    h2: ({children}) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>,
                    h4: ({children}) => <h4 className="text-sm font-semibold mb-2 mt-3 text-gray-800">{children}</h4>,
                    code: ({inline, children}) => inline 
                      ? <code className="bg-purple-100 text-purple-700 px-1 rounded text-xs">{children}</code>
                      : <code className="block bg-gray-800 text-gray-100 p-3 rounded-lg my-2 text-xs overflow-x-auto">{children}</code>,
                    pre: ({children}) => <pre className="my-2">{children}</pre>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-purple-400 pl-3 italic my-2">{children}</blockquote>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {/* Indicador de Digitação */}
        {isTyping && (
          <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 self-start flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
          </div>
        )}
      </div>

      {/* Área de Input */}
      <div className="border-t border-gray-200 p-2 sm:p-4 flex gap-2 sm:gap-3 bg-white flex-shrink-0 pb-safe">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            setTimeout(() => {
              if (chatAreaRef.current) {
                chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
              }
            }, 300)
          }}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          className={`${colors.header} text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  )
}

export default ChatContainer
