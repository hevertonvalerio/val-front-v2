import { useState } from 'react'
import { User, Phone, Mail, Check, ExternalLink, BookOpen, Palette, Heart, ShoppingBag, Video, Calendar, ChevronDown, ChevronUp } from 'lucide-react'

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
  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className="p-4">
      {/* Links de Acesso - Sempre visível */}
      <div className="mb-4">
        <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2 px-3">
          <ExternalLink className="w-4 h-4 text-purple-600" />
          Acesse
        </h4>
        <div className="space-y-1 px-3">
          {links.map((link, index) => {
            const IconComponent = link.icon
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors group"
              >
                <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                <span>{link.name}</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Botão Seus Dados - Abaixo da seção Acesse */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-gray-800 text-sm">Seus Dados</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          )}
        </button>

        {/* Conteúdo colapsável */}
        {isExpanded && (
          <div className="mt-3 px-3 space-y-3 animate-fadeIn">
            <div className="space-y-2">
              {/* Nome */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors bg-white"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors bg-white"
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
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors bg-white"
                />
              </div>

              {/* Botão Salvar */}
              <button
                onClick={handleSave}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-3"
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
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPanel
