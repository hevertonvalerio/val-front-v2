function Header() {
  return (
    <header className="py-4 pl-16 pr-4 lg:px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-start">
        <a 
          href="https://www.valcapelli.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
            <img 
              src="/logo.png" 
              alt="Valcapelli" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
          </div>
          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-white drop-shadow-md">
            Valcapelli - Metafísica da Saúde e Cromoterapia
          </h1>
        </a>
      </div>
    </header>
  )
}

export default Header
