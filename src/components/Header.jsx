function Header() {
  return (
    <header className="py-4 px-4">
      <div className="flex items-center justify-center">
        {/* Logo e Título - Centralizado e clicável */}
        <a 
          href="https://www.valcapelli.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
            <img 
              src="/logo.png" 
              alt="Valcapelli" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-lg font-semibold text-white drop-shadow-md">
            Professor Valcapelli
          </h1>
        </a>
      </div>
    </header>
  )
}

export default Header
