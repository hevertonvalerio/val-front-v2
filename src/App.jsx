import { useState } from 'react'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import UserPanel from './components/UserPanel'
import Footer from './components/Footer'
import ColorPicker from './components/ColorPicker'

function App() {
  const [activeTheme, setActiveTheme] = useState('cromoterapia')
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' })
  const [bgColor, setBgColor] = useState(null) // null = gradiente animado

  const backgroundStyle = bgColor 
    ? { background: bgColor }
    : {}

  return (
    <div 
      className={`h-screen flex flex-col font-poppins overflow-hidden ${!bgColor ? 'animated-gradient' : ''}`}
      style={backgroundStyle}
    >
      <Header activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      
      <main className="flex-1 flex items-stretch justify-center px- sm:px-4 py-2 gap-2 min-h-0 ml 0">
        {/* Painel do usuário à esquerda */}
        <div className="w-56 flex-shrink-0 hidden xl:block">
          <UserPanel userInfo={userInfo} setUserInfo={setUserInfo} />
        </div>
        
        {/* Chat centralizado como destaque principal - ocupa máximo espaço */}
        <div className="flex-1 max-w-7xl h-full">
          <ChatContainer 
            activeTheme={activeTheme} 
            userInfo={userInfo}
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
