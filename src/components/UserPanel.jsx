import { useState } from 'react'
import { User, Phone, Mail, Check, ExternalLink, BookOpen, Palette, Heart, ShoppingBag, Video, Calendar } from 'lucide-react'

function UserPanel({ userInfo, setUserInfo }) {
  const links = [
    { name: 'Site Oficial', url: 'https://www.valcapelli.com/', icon: ExternalLink },
    { name: 'Cromoterapia', url: 'https://www.valcapelli.com/cromoterapia-o-segredo-das-cores', icon: Palette },
    { name: 'Metafísica da Saúde', url: 'https://www.valcapelli.com/metafisica-da-saude', icon: Heart },
    { name: 'Livros', url: 'https://www.valcapelli.com/livros', icon: BookOpen },
    { name: 'Loja', url: 'https://www.valcapelli.com/loja', icon: ShoppingBag },
    { name: 'Vídeos', url: 'https://www.valcapelli.com/videos', icon: Video },
    { name: 'Agenda', url: 'https://www.valcapelli.com/agenda', icon: Calendar },
  ]
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
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 h-full overflow-y-auto">
      <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
        <User className="w-4 h-4 text-purple-600" />
        Seus Dados (opcional)
      </h3>
      
      <p className="text-gray-500 text-xs mb-4">
        Registre para uma experiência personalizada
      </p>

      <div className="space-y-3">
        {/* Nome */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="Seu nome"
            className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Telefone */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="Seu telefone"
            className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Seu e-mail"
            className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Salvo!
            </>
          ) : (
            'Salvar dados'
          )}
        </button>
      </div>

      {/* Links de Acesso */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 text-xs mb-3 flex items-center gap-2">
          <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
          Acesse:
        </h4>
        <div className="space-y-2">
          {links.map((link, index) => {
            const IconComponent = link.icon
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                <IconComponent className="w-3.5 h-3.5" />
                {link.name}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserPanel
