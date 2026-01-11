import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, MessageCircle, Menu, X } from 'lucide-react'
import ChatSessionManager from './ChatSessionManager'
import UserPanel from './UserPanel'

const DB_NAME = 'valcapelli_chat_db'
const DB_VERSION = 1
const STORE_NAME = 'sessions'
// Tempo de expiração em milissegundos (7 dias)
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

const createNewSession = () => ({
  id: generateSessionId(),
  title: 'Nova conversa',
  messages: [],
  createdAt: Date.now()
})

const isSessionExpired = (session) => {
  if (!session.createdAt) return true
  const sessionAge = Date.now() - session.createdAt
  return sessionAge > EXPIRY_TIME
}

// Abre conexão com IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        objectStore.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

// Carrega todas as sessões do IndexedDB
const loadSessions = async () => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const sessions = request.result || []
        // Filtra sessões expiradas (criadas há mais de 7 dias)
        const validSessions = sessions.filter(session => !isSessionExpired(session))
        
        // Remove sessões expiradas do banco
        if (validSessions.length < sessions.length) {
          const expiredSessions = sessions.filter(session => isSessionExpired(session))
          expiredSessions.forEach(session => {
            deleteSession(session.id).catch(console.error)
          })
        }
        
        // Se todas as sessões expiraram, cria uma nova
        if (validSessions.length === 0) {
          const newSession = createNewSession()
          saveSessions([newSession]).catch(console.error)
          resolve([newSession])
        } else {
          resolve(validSessions)
        }
      }

      request.onerror = () => {
        console.error('Erro ao carregar sessões:', request.error)
        resolve([createNewSession()])
      }
    })
  } catch (e) {
    console.error('Erro ao abrir banco de dados:', e)
    return [createNewSession()]
  }
}

// Salva sessões no IndexedDB
const saveSessions = async (sessions) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // Limpa todas as sessões existentes
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })

    // Adiciona as novas sessões
    const promises = sessions.map(session => {
      return new Promise((resolve, reject) => {
        const request = store.add(session)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    })

    await Promise.all(promises)
  } catch (e) {
    console.error('Erro ao salvar sessões:', e)
  }
}

// Deleta uma sessão específica
const deleteSession = async (sessionId) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.delete(sessionId)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.error('Erro ao deletar sessão:', e)
  }
}

function ChatContainer({ activeTheme, userInfo, setUserInfo }) {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chatAreaRef = useRef(null)

  // Carrega sessões do IndexedDB ao montar o componente
  useEffect(() => {
    const initializeSessions = async () => {
      setIsLoading(true)
      try {
        const loadedSessions = await loadSessions()
        setSessions(loadedSessions)
        if (loadedSessions.length > 0 && !activeSessionId) {
          setActiveSessionId(loadedSessions[0].id)
        }
      } catch (error) {
        console.error('Erro ao inicializar sessões:', error)
        const newSession = createNewSession()
        setSessions([newSession])
        setActiveSessionId(newSession.id)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSessions()
  }, [])

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0]
  const messages = activeSession?.messages || []

  const API_KEY = window.__APP_CONFIG__?.API_KEY || ''
  const FLOW_ID = window.__APP_CONFIG__?.FLOW_ID || '61a17804-9284-446d-8e60-3801aef9bb60'
  const HOST_URL = window.__APP_CONFIG__?.HOST_URL || 'https://langflow.inovai.app'

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

  // Salva sessões no IndexedDB quando mudam
  useEffect(() => {
    if (!isLoading && sessions.length > 0) {
      saveSessions(sessions).catch(console.error)
    }
  }, [sessions, isLoading])

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Atualiza mensagens da sessão ativa
  const updateSessionMessages = useCallback((newMessages) => {
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { ...s, messages: newMessages }
        : s
    ))
  }, [activeSessionId])

  // Gera título automático baseado na primeira mensagem
  const generateTitle = useCallback((text) => {
    const maxLength = 30
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }, [])

  // Handlers do gerenciador de sessões
  const handleNewSession = useCallback(() => {
    const newSession = createNewSession()
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
  }, [])

  const handleSelectSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId)
  }, [])

  const handleDeleteSession = useCallback((sessionId) => {
    // Deleta do IndexedDB
    deleteSession(sessionId).catch(console.error)
    
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId)
      if (filtered.length === 0) {
        const newSession = createNewSession()
        setActiveSessionId(newSession.id)
        return [newSession]
      }
      if (sessionId === activeSessionId) {
        setActiveSessionId(filtered[0].id)
      }
      return filtered
    })
  }, [activeSessionId])

  const handleRenameSession = useCallback((sessionId, newTitle) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title: newTitle } : s
    ))
  }, [])

  const sendMessage = async () => {
    const text = inputValue.trim()
    if (!text) return

    const newUserMessage = { text, isUser: true }
    const updatedMessages = [...messages, newUserMessage]
    updateSessionMessages(updatedMessages)
    
    // Atualiza título se for a primeira mensagem
    if (messages.length === 0) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, title: generateTitle(text) } : s
      ))
    }
    
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
          input_type: 'chat',
          session_id: activeSessionId
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

      updateSessionMessages([...updatedMessages, { text: botResponse, isUser: false }])
    } catch (error) {
      console.error('Erro:', error)
      updateSessionMessages([...updatedMessages, { text: 'Ops! Ocorreu um erro. Tente novamente.', isUser: false }])
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

  // Prepara dados das sessões para o gerenciador
  const sessionsForManager = sessions.map(s => ({
    id: s.id,
    title: s.title,
    messageCount: s.messages.length
  }))

  // Mostra loading enquanto inicializa
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden flex flex-col h-full max-h-full min-h-0 items-center justify-center">
        <div className="text-gray-400 text-sm">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden flex flex-col h-full max-h-full min-h-0">
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Overlay para mobile quando sidebar está aberta */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Gerenciador de Sessões e UserPanel */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-50
          w-full md:w-64 flex-shrink-0 border-r border-gray-200 flex flex-col
          bg-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Header da Sidebar no Mobile */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <h3 className="font-semibold text-gray-700 text-sm">Menu</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Gerenciador de Sessões */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatSessionManager
              sessions={sessionsForManager}
              activeSessionId={activeSessionId}
              onSelectSession={(id) => {
                handleSelectSession(id)
                setSidebarOpen(false)
              }}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              onRenameSession={handleRenameSession}
              themeColors={colors}
            />
          </div>
          
          {/* Divisória */}
          <div className="border-t border-gray-200"></div>
          
          {/* UserPanel */}
          <div className="flex-shrink-0 p-3 md:p-4">
            <UserPanel userInfo={userInfo} setUserInfo={setUserInfo} />
          </div>
        </div>

        {/* Chat Principal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header do Chat */}
          <div className={`${colors.header} text-white px-3 md:px-5 py-3 md:py-4 flex items-center gap-2 md:gap-3 flex-shrink-0`}>
            {/* Botão Menu Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className={`w-4 h-4 md:w-5 md:h-5 ${colors.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{activeSession?.title || 'Nova conversa'}</p>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-3 md:p-5 flex flex-col gap-3 md:gap-4 min-h-0">
            {/* Mensagem de Boas-vindas */}
            <div className={`${colors.welcome} rounded-xl md:rounded-2xl p-4 md:p-5 text-center`}>
              <h3 className={`${colors.welcomeTitle} font-semibold text-base md:text-lg mb-2`}>
                Bem-vindo(a)! 👋
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">{welcomeMessage}</p>
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
                className={`max-w-[85%] md:max-w-[80%] px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.isUser
                    ? `${colors.userMsg} text-white self-end rounded-br-sm`
                    : 'bg-gray-100 text-gray-700 self-start rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}

          {/* Indicador de Digitação */}
          {isTyping && (
            <div className="bg-gray-100 rounded-xl md:rounded-2xl rounded-bl-sm px-3 md:px-4 py-2 md:py-3 self-start flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
            </div>
          )}
          </div>

          {/* Área de Input */}
          <div className="border-t border-gray-200 p-2 md:p-4 flex gap-2 md:gap-3 bg-white flex-shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 md:px-5 py-2 md:py-3 border-2 border-gray-200 rounded-full text-xs md:text-sm outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`${colors.header} text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0`}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
