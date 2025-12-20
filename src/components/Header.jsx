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
    <header className="text-center py-3 px-4">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white drop-shadow-lg">
            ChatBot Valcapelli
          </h1>
          <div className="flex items-center gap-1.5 justify-center">
            {colorDots.map((dot, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full color-dot ${dot.color}`}
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
