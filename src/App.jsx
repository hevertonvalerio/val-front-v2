import { useState } from 'react'
import Header from './components/Header'
import ThemeSelector from './components/ThemeSelector'
import ChatContainer from './components/ChatContainer'
import UserPanel from './components/UserPanel'
import Footer from './components/Footer'

function App() {
  const [activeTheme, setActiveTheme] = useState('cromoterapia')
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' })

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-3 py-3 gap-3">
        <ThemeSelector activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
        
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-3 flex-1 min-h-0">
          {/* Painel do usuário à esquerda */}
          <div className="lg:w-72 flex-shrink-0">
            <UserPanel userInfo={userInfo} setUserInfo={setUserInfo} />
          </div>
          
          {/* Chat como destaque principal */}
          <div className="flex-1 min-h-[500px] lg:min-h-0">
            <ChatContainer 
              activeTheme={activeTheme} 
              userInfo={userInfo}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
