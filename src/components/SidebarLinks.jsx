import { useState } from 'react'
import { Globe, Phone, Instagram, MapPin, MessageCircle, Plus, Minus } from 'lucide-react'

function SidebarLinks() {
  const [isExpanded, setIsExpanded] = useState(false)
  const contacts = [
    {
      icon: Globe,
      href: 'https://www.valcapelli.com/',
      label: 'Website',
    },
    {
      icon: MessageCircle,
      href: 'https://wa.me/5511994713490',
      label: 'WhatsApp',
    },
    {
      icon: Phone,
      href: 'tel:+551150726448',
      label: 'Telefone',
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/valcapellimetafisico/',
      label: 'Instagram',
    },
    {
      icon: MapPin,
      href: 'https://maps.google.com/?q=Rua+Luís+Góis+734,+São+Paulo,+Brazil+04043-050',
      label: 'Localização',
    },
  ]

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
      >
        <h3 className="font-bold text-gray-800 text-sm">Contato</h3>
        {isExpanded ? (
          <Minus className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
        ) : (
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 animate-fadeIn">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors group"
            >
              <contact.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
              <span>{contact.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarLinks
