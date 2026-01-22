import { useState } from 'react'
import { Menu, X, Plus, MessageSquare, Trash2, Globe, Phone, Instagram, MapPin, MessageCircle } from 'lucide-react'

function MobileMenu({ sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession, themeColors }) {
  const [isOpen, setIsOpen] = useState(false)

  const contacts = [
    { icon: Globe, href: 'https://www.valcapelli.com/', label: 'Website' },
    { icon: MessageCircle, href: 'https://wa.me/5511994713490', label: 'WhatsApp' },
    { icon: Phone, href: 'tel:+551150726448', label: 'Telefone' },
    { icon: Instagram, href: 'https://www.instagram.com/valcapellimetafisico/', label: 'Instagram' },
    { icon: MapPin, href: 'https://maps.google.com/?q=Rua+Luís+Góis+734,+São+Paulo,+Brazil+04043-050', label: 'Localização' },
  ]

  return (
    <>
      {/* Botão Menu Mobile - integrado ao header */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-white transition-all border border-gray-100"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header do Menu */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Conversas */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-sm">Conversas</h3>
                <button
                  onClick={() => {
                    onNewSession()
                    setIsOpen(false)
                  }}
                  className={`${themeColors.header} text-white p-2 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">Nenhuma conversa ainda</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                        activeSessionId === session.id
                          ? 'bg-purple-50 border-2 border-purple-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                      onClick={() => {
                        onSelectSession(session.id)
                        setIsOpen(false)
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          activeSessionId === session.id ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            activeSessionId === session.id ? 'text-purple-700' : 'text-gray-700'
                          }`}>
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {session.messageCount} mensagens
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteSession(session.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Links de Contato */}
            <div className="p-4 border-t">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Contato</h3>
              <div className="space-y-2">
                {contacts.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <contact.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                    <span>{contact.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
