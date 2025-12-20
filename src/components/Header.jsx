import { Palette, Heart } from 'lucide-react'

function Header({ activeTheme, setActiveTheme }) {
  return (
    <header className="py-4 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
            <img 
              src="/logo.png" 
              alt="Valcapelli" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-lg font-semibold text-white drop-shadow-md">
            Professor Valcapelli
          </h1>
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
    </header>
  )
}

export default Header
