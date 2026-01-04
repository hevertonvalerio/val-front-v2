import { useState } from 'react'
import { User, Phone, Mail, Check } from 'lucide-react'

function UserPanel({ userInfo, setUserInfo }) {
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <h3 className="font-semibold text-gray-700 text-xs mb-2 flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-purple-600" />
        Seus Dados (opcional)
      </h3>
      
      <p className="text-gray-500 text-xs mb-3">
        Registre para uma experiência personalizada
      </p>

      <div className="space-y-2">
        {/* Nome */}
        <div className="relative">
          <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="Seu nome"
            className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Telefone */}
        <div className="relative">
          <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="Seu telefone"
            className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Seu e-mail"
            className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSave}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Salvo!
            </>
          ) : (
            'Salvar dados'
          )}
        </button>
      </div>
    </div>
  )
}

export default UserPanel
