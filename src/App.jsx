import { useState } from 'react'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import Footer from './components/Footer'

function App() {
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' })

  return (
    <div className="h-screen flex flex-col font-poppins overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-2 py-2 md:px-3 md:py-3 gap-2 md:gap-3 min-h-0 overflow-hidden">
        <div className="w-full max-w-6xl h-full flex flex-col min-h-0">
          <ChatContainer activeTheme="cromoterapia" userInfo={userInfo} setUserInfo={setUserInfo} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
