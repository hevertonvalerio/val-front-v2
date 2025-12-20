import { useState, useRef, useEffect } from 'react'
import { Send, Palette, Heart } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ChatContainer({ activeTheme, setActiveTheme, userInfo }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatAreaRef = useRef(null)

  const API_KEY = import.meta.env.VITE_API_KEY || ''
  const FLOW_ID = import.meta.env.VITE_FLOW_ID || '61a17804-9284-446d-8e60-3801aef9bb60'
  const HOST_URL = import.meta.env.VITE_HOST_URL || 'https://langflow.inovai.app'

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

  const sendMessage = async () => {
    const text = inputValue.trim()
    if (!text) return

    const newUserMessage = { text, isUser: true }
    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await fetch(`${HOST_URL}/api/v1/run/${FLOW_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          input_value: text,
          output_type: 'chat',
          input_type: 'chat'
        })
      })

      const data = await response.json()
      let botResponse = 'Desculpe, não consegui processar sua mensagem.'

      if (data.outputs?.[0]?.outputs?.[0]) {
        const output = data.outputs[0].outputs[0]
        if (output.results?.message?.text) {
          botResponse = output.results.message.text
        } else if (output.messages?.[0]?.message) {
          botResponse = output.messages[0].message
        } else if (output.artifacts?.message) {
          botResponse = output.artifacts.message
        }
      }

      setMessages(prev => [...prev, { text: botResponse, isUser: false }])
    } catch (error) {
      console.error('Erro:', error)
      setMessages(prev => [...prev, { text: 'Ops! Ocorreu um erro. Tente novamente.', isUser: false }])
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
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Header do Chat */}
      <div className={`${colors.header} text-white px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0 p-1">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Chatbot Valcapelli</h3>
            <p className="text-xs text-white/80">Viva numa boa!</p>
          </div>
        </div>
        
        {/* Seletor de Temas */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTheme('cromoterapia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeTheme === 'cromoterapia'
                ? 'bg-white text-purple-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cromoterapia</span>
          </button>
          
          <button
            onClick={() => setActiveTheme('metafisica')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeTheme === 'metafisica'
                ? 'bg-white text-teal-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Metafísica</span>
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* Mensagem de Boas-vindas */}
        <div className={`${colors.welcome} rounded-2xl p-5 text-center`}>
          <h3 className={`${colors.welcomeTitle} font-semibold text-lg mb-2`}>
            Bem-vindo(a)! 👋
          </h3>
          <p className="text-gray-600 text-sm">{welcomeMessage}</p>
          {userInfo.name && (
            <p className="mt-2 text-xs text-gray-500">
              Olá, <span className="font-semibold text-purple-600">{userInfo.name}</span>! Como posso ajudar?
            </p>
          )}
        </div>

        {/* Mensagens */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
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
      <div className="border-t border-gray-200 p-4 flex gap-3 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full text-sm outline-none focus:border-purple-500 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          className={`${colors.header} text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default ChatContainer
