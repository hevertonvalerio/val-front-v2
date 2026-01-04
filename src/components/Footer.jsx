import { Globe, Phone, Instagram, MapPin, MessageCircle } from 'lucide-react'

function Footer() {
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
    <footer className="py-2 md:py-3 px-3 md:px-4">
      <div className="flex flex-col items-center gap-1.5 md:gap-2">
        {/* Ícones de contato */}
        <div className="flex items-center gap-2 md:gap-4">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              title={contact.label}
              className="w-7 h-7 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all duration-200"
            >
              <contact.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </a>
          ))}
        </div>
        
        {/* Copyright discreto */}
        <p className="text-white/50 text-xs">
          © {new Date().getFullYear()} Valcapelli • Viva numa boa!
        </p>
      </div>
    </footer>
  )
}

export default Footer
