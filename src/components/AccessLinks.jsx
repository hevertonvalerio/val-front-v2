import { ExternalLink, Palette, Heart, BookOpen, Store, Video, Calendar } from 'lucide-react'

function AccessLinks() {
  const links = [
    { name: 'Site Oficial', icon: ExternalLink, url: 'https://valcapelli.com.br' },
    { name: 'Cromoterapia', icon: Palette, url: '#' },
    { name: 'Metafísica da Saúde', icon: Heart, url: '#' },
    { name: 'Livros', icon: BookOpen, url: '#' },
    { name: 'Loja', icon: Store, url: '#' },
    { name: 'Vídeos', icon: Video, url: '#' },
    { name: 'Agenda', icon: Calendar, url: '#' }
  ]

  return (
    <div className="p-5 border-t border-gray-200">
      <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
        <ExternalLink className="w-5 h-5 text-purple-600" />
        Acesse
      </h3>
      
      <div className="space-y-1.5">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors group"
          >
            <link.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default AccessLinks
