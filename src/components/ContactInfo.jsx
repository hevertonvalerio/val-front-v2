import { Globe, Phone, Instagram, MapPin } from 'lucide-react'

function ContactInfo() {
  const contacts = [
    {
      icon: Globe,
      label: 'Website',
      value: 'www.valcapelli.com',
      href: 'https://www.valcapelli.com/',
    },
    {
      icon: Phone,
      label: 'WhatsApp',
      value: '(11) 99471-3490',
      href: 'https://wa.me/5511994713490',
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: '(11) 5072-6448',
      href: 'tel:+551150726448',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@valcapellimetafisico',
      href: 'https://www.instagram.com/valcapellimetafisico/?hl=pt-br',
    },
    {
      icon: MapPin,
      label: 'Endereço',
      value: 'Rua Luís Góis 734, São Paulo, SP 04043-050',
      href: 'https://maps.google.com/?q=Rua+Luís+Góis+734,+São+Paulo,+Brazil+04043-050',
    },
  ]

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5">
      <h3 className="font-bold text-gray-800 mb-4 text-center">📞 Contato</h3>
      
      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <contact.icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{contact.label}</p>
              <p className="text-sm text-gray-700 font-medium truncate">{contact.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default ContactInfo
