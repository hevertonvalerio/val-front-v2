import { Sparkles } from 'lucide-react'

function Header() {
  const colorDots = [
    { color: 'bg-white', delay: '0s' },
    { color: 'bg-yellow-400', delay: '0.2s' },
    { color: 'bg-emerald-500', delay: '0.4s' },
    { color: 'bg-blue-500', delay: '0.6s' },
    { color: 'bg-pink-500', delay: '0.8s' },
    { color: 'bg-white', delay: '1s' },
  ]

  return (
    <header className="text-center py-2 md:py-3 px-3 md:px-4">
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-base md:text-xl font-bold text-white drop-shadow-lg">
            ChatBot Valcapelli
          </h1>
          <div className="flex items-center gap-1 md:gap-1.5 justify-center">
            {colorDots.map((dot, index) => (
              <div
                key={index}
                className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full color-dot ${dot.color}`}
                style={{ animationDelay: dot.delay }}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
