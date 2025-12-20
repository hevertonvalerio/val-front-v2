import { useState } from 'react'
import { Palette, X, Pipette } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

function ColorPicker({ bgColor, setBgColor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSpectrum, setShowSpectrum] = useState(false)
  const [customColor, setCustomColor] = useState('#8B5CF6')

  const colors = [
    { name: 'Gradiente', value: null, gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Laranja', value: '#F97316' },
    { name: 'Amarelo', value: '#FBBF24' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Índigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Vermelho', value: '#EF4444' },
  ]

  const handleCustomColorApply = () => {
    setBgColor(customColor)
    setShowSpectrum(false)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Botão para abrir/fechar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setShowSpectrum(false)
        }}
        className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Escolher cor de fundo"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Palette className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {/* Painel de cores */}
      {isOpen && !showSpectrum && (
        <div className="absolute bottom-14 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 w-52 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-xs text-gray-500 mb-3 font-medium">Cor de fundo</p>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  setBgColor(color.value)
                  setIsOpen(false)
                }}
                title={color.name}
                className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                  bgColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ 
                  background: color.gradient || color.value,
                  backgroundSize: color.gradient ? '200% 200%' : undefined
                }}
              />
            ))}
            {/* Botão para abrir seletor de espectro */}
            <button
              onClick={() => setShowSpectrum(true)}
              title="Escolher cor personalizada"
              className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500"
            >
              <Pipette className="w-3.5 h-3.5 text-white drop-shadow" />
            </button>
          </div>
        </div>
      )}

      {/* Seletor de espectro cromático */}
      {isOpen && showSpectrum && (
        <div className="absolute bottom-14 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">Escolha sua cor</p>
            <button 
              onClick={() => setShowSpectrum(false)}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              Voltar
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <HexColorPicker color={customColor} onChange={setCustomColor} />
            
            <div className="flex items-center gap-3 mt-4 w-full">
              <div 
                className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-inner"
                style={{ backgroundColor: customColor }}
              />
              <span className="text-sm font-mono text-gray-600">{customColor}</span>
            </div>
            
            <button
              onClick={handleCustomColorApply}
              className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Aplicar cor
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
