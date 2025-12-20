import { Palette, Heart } from 'lucide-react'

function ThemeSelector({ activeTheme, setActiveTheme }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      <button
        onClick={() => setActiveTheme('cromoterapia')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
          activeTheme === 'cromoterapia'
            ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white scale-105'
            : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
        }`}
      >
        <Palette className="w-4 h-4" />
        <span>Cromoterapia</span>
      </button>
      
      <button
        onClick={() => setActiveTheme('metafisica')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
          activeTheme === 'metafisica'
            ? 'bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 text-white scale-105'
            : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
        }`}
      >
        <Heart className="w-4 h-4" />
        <span>Metafísica da Saúde</span>
      </button>
    </div>
  )
}

export default ThemeSelector
