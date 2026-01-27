import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import ChatSessionManager from './components/ChatSessionManager'
import SidebarLinks from './components/SidebarLinks'
import MobileMenu from './components/MobileMenu'
import ColorPicker from './components/ColorPicker'
import indexedDBService from './services/indexedDBService'

function ChatPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTheme, setActiveTheme] = useState('cromoterapia')
  const [bgColor, setBgColor] = useState(null)
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)

  const backgroundStyle = bgColor 
    ? { background: bgColor }
    : {}

  const themeColors = {
    cromoterapia: {
      header: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400',
    },
    metafisica: {
      header: 'bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500',
    }
  }

  useEffect(() => {
    initializeSessions()
  }, [])

  const initializeSessions = async () => {
    try {
      const allSessions = await indexedDBService.getAllSessions()
      const sortedSessions = allSessions.sort((a, b) => b.updatedAt - a.updatedAt)
      setSessions(sortedSessions)
      
      if (sessionId) {
        const existingSession = sortedSessions.find(s => s.id === sessionId)
        if (existingSession) {
          setCurrentSession(existingSession)
        } else {
          const tempSession = createTempSession()
          setSessions([tempSession, ...sortedSessions])
          setCurrentSession(tempSession)
          navigate(`/chat/${tempSession.id}`, { replace: true })
        }
      } else {
        const tempSession = createTempSession()
        setSessions([tempSession, ...sortedSessions])
        setCurrentSession(tempSession)
        navigate(`/chat/${tempSession.id}`, { replace: true })
      }
    } catch (error) {
      console.error('Erro ao inicializar sessões:', error)
      const tempSession = createTempSession()
      setSessions([tempSession])
      setCurrentSession(tempSession)
      navigate(`/chat/${tempSession.id}`, { replace: true })
    }
  }

  const createTempSession = () => {
    return {
      id: crypto.randomUUID(),
      title: 'Nova conversa',
      messages: [],
      messageCount: 0,
      threadId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isTemporary: true
    }
  }

  const createNewSession = async () => {
    const newSession = createTempSession()
    setSessions(prev => [newSession, ...prev.filter(s => !s.isTemporary)])
    setCurrentSession(newSession)
    navigate(`/chat/${newSession.id}`)
  }

  const selectSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
      navigate(`/chat/${sessionId}`)
    }
  }

  const deleteSession = async (sessionId) => {
    try {
      await indexedDBService.deleteSession(sessionId)
      const updatedSessions = sessions.filter(s => s.id !== sessionId)
      setSessions(updatedSessions)
      
      if (currentSession?.id === sessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSession(updatedSessions[0])
        } else {
          createNewSession()
        }
      }
    } catch (error) {
      console.error('Erro ao deletar sessão:', error)
    }
  }

  const renameSession = async (sessionId, newTitle) => {
    try {
      const session = sessions.find(s => s.id === sessionId)
      if (session) {
        const updatedSession = { ...session, title: newTitle, updatedAt: Date.now() }
        await indexedDBService.saveSession(updatedSession)
        setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s))
        if (currentSession?.id === sessionId) {
          setCurrentSession(updatedSession)
        }
      }
    } catch (error) {
      console.error('Erro ao renomear sessão:', error)
    }
  }

  const handleSessionUpdate = (updatedSession) => {
    setSessions(prev => {
      const exists = prev.some(s => s.id === updatedSession.id)
      const updated = exists 
        ? prev.map(s => s.id === updatedSession.id ? updatedSession : s)
        : [updatedSession, ...prev]
      return updated.sort((a, b) => b.updatedAt - a.updatedAt)
    })
    setCurrentSession(updatedSession)
  }

  return (
    <div 
      className={`h-dvh flex flex-col font-poppins overflow-hidden bg-white sm:bg-gray-50 ${!bgColor && 'sm:animated-gradient'}`}
      style={backgroundStyle}
    >
      {/* Menu Mobile */}
      <MobileMenu
        sessions={sessions}
        activeSessionId={currentSession?.id}
        onSelectSession={selectSession}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        themeColors={themeColors[activeTheme]}
      />

      {/* Header simplificado - apenas desktop */}
      <div className="hidden sm:block">
        <Header />
      </div>
      
      {/* Main Content - Container Integrado */}
      <main className="flex-1 sm:p-4 min-h-0 max-w-7xl w-full mx-auto">
        <div className="bg-white sm:rounded-2xl sm:shadow-lg h-full flex overflow-hidden">
          {/* Sidebar Desktop */}
          <aside className="w-80 hidden lg:flex flex-col border-r border-gray-200">
            <ChatSessionManager
              sessions={sessions}
              activeSessionId={currentSession?.id}
              onSelectSession={selectSession}
              onNewSession={createNewSession}
              onDeleteSession={deleteSession}
              onRenameSession={renameSession}
              themeColors={themeColors[activeTheme]}
            />
            <SidebarLinks />
          </aside>
          
          {/* Chat Area */}
          <div className="flex-1 min-w-0">
            <ChatContainer 
              activeTheme={activeTheme} 
              setActiveTheme={setActiveTheme}
              currentSession={currentSession}
              onSessionUpdate={handleSessionUpdate}
            />
          </div>
        </div>
      </main>

      {/* Seletor de cor de fundo - apenas desktop */}
      <ColorPicker bgColor={bgColor} setBgColor={setBgColor} />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/chat/:sessionId" element={<ChatPage />} />
    </Routes>
  )
}

export default App
