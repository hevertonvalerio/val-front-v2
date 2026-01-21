import { useState, useEffect } from 'react'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import ChatSessionManager from './components/ChatSessionManager'
import UserPanel from './components/UserPanel'
import Footer from './components/Footer'
import ColorPicker from './components/ColorPicker'
import indexedDBService from './services/indexedDBService'

function App() {
  const [activeTheme, setActiveTheme] = useState('cromoterapia')
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' })
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
      
      if (sortedSessions.length > 0) {
        setCurrentSession(sortedSessions[0])
      } else {
        createNewSession()
      }
    } catch (error) {
      console.error('Erro ao inicializar sessões:', error)
      createNewSession()
    }
  }

  const createNewSession = async () => {
    const newSession = {
      id: crypto.randomUUID(),
      title: `Conversa ${sessions.length + 1}`,
      messages: [],
      messageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    try {
      await indexedDBService.saveSession(newSession)
      setSessions(prev => [newSession, ...prev])
      setCurrentSession(newSession)
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error)
    }
  }

  const selectSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
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
      const updated = prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      return updated.sort((a, b) => b.updatedAt - a.updatedAt)
    })
    setCurrentSession(updatedSession)
  }

  return (
    <div 
      className={`h-screen flex flex-col font-poppins overflow-hidden ${!bgColor ? 'animated-gradient' : ''}`}
      style={backgroundStyle}
    >
      <Header />
      
      <main className="flex-1 flex items-stretch justify-center px-2 sm:px-4 py-2 gap-3 min-h-0">
        {/* Painel lateral à esquerda */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">
            {/* Conversas */}
            <ChatSessionManager
              sessions={sessions}
              activeSessionId={currentSession?.id}
              onSelectSession={selectSession}
              onNewSession={createNewSession}
              onDeleteSession={deleteSession}
              onRenameSession={renameSession}
              themeColors={themeColors[activeTheme]}
            />
            
            {/* Dados do Usuário e Links */}
            <div className="border-t border-gray-200">
              <UserPanel userInfo={userInfo} setUserInfo={setUserInfo} />
            </div>
          </div>
        </div>
        
        {/* Chat centralizado como destaque principal */}
        <div className="flex-1 max-w-5xl h-full">
          <ChatContainer 
            activeTheme={activeTheme} 
            setActiveTheme={setActiveTheme}
            userInfo={userInfo}
            currentSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
          />
        </div>
      </main>

      <Footer />
      
      {/* Seletor de cor de fundo */}
      <ColorPicker bgColor={bgColor} setBgColor={setBgColor} />
    </div>
  )
}

export default App
