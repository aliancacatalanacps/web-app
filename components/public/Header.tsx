'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

// Icones SVG per evitar problemes d'importació amb versions de lucide-react
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.43-.47-.62-.73v7.02c0 3.74-3.13 6.87-6.88 6.87-3.86 0-7.05-3.23-6.85-7.15.17-3.36 2.97-6.07 6.34-6.02.13 0 .26.01.39.02v4.03c-2.2-.18-4.07 1.62-4.1 3.82-.03 2.19 1.75 4.02 3.94 4.02 2.2 0 3.98-1.78 3.98-3.98v-11.6c-.02-1.39-.01-2.78-.02-4.17z"/>
    </svg>
  )
}

export default function Header({ config = {} }: { config?: Record<string, string> }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const instagramUrl = config.xarxes_instagram || 'https://instagram.com/acplatjadaro'
  const tiktokUrl = config.xarxes_tiktok || 'https://tiktok.com/@acplatjadaro'
  const twitterUrl = config.xarxes_twitter || 'https://x.com/acplatjadaro'

  // Auxiliar per marcar actius els elements del menú que tenen subrutes
  const isTabActive = (paths: string[]) => {
    return paths.some(path => pathname === path || (path !== '/' && pathname.startsWith(path)))
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo i Marca Municipal */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Aliança Catalana"
                className="h-14 w-auto object-contain"
              />
              <div className="flex flex-col ml-3 border-l border-neutral-200 pl-3">
                <span className="font-sans font-bold text-[12px] tracking-tight text-neutral-900 leading-snug">Castell d'Aro</span>
                <span className="font-sans text-[9px] font-bold text-primary tracking-wider uppercase leading-none">Platja d'Aro i s'Agaró</span>
              </div>
            </Link>
          </div>

          {/* Menú Desktop (Minimalista i Agrupat amb dropdowns) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-neutral-600'
              }`}
            >
              Inici
            </Link>

            <Link
              href="/noticies"
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                pathname.startsWith('/noticies') ? 'text-primary border-b-2 border-primary pb-1' : 'text-neutral-600'
              }`}
            >
              Notícies
            </Link>

            <Link
              href="/qui-som"
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                pathname === '/qui-som' ? 'text-primary border-b-2 border-primary pb-1' : 'text-neutral-600'
              }`}
            >
              Qui som
            </Link>

            {/* Dropdown 1: Participació */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-primary py-2 outline-none cursor-pointer ${
                  isTabActive(['/preguntes', '/comerc', '/contacte']) ? 'text-primary font-black' : 'text-neutral-600'
                }`}
              >
                <span>Participació</span>
                <ChevronDown size={11} className="transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 z-50 hidden group-hover:block w-48 bg-white border border-neutral-200 rounded shadow-md mt-0.5 py-1 text-left">
                <Link
                  href="/preguntes"
                  className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                >
                  Pregunta al regidor
                </Link>
                <Link
                  href="/comerc"
                  className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                >
                  Comerç local
                </Link>
                <Link
                  href="/contacte"
                  className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                >
                  Bústia de contacte
                </Link>
              </div>
            </div>

            {/* Dropdown 2: Transparència */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-primary py-2 outline-none cursor-pointer ${
                  isTabActive(['/transparencia', '/dades', '/compromisos']) ? 'text-primary font-black' : 'text-neutral-600'
                }`}
              >
                <span>Transparència</span>
                <ChevronDown size={11} className="transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 z-50 hidden group-hover:block w-52 bg-white border border-neutral-200 rounded shadow-md mt-0.5 py-1 text-left">
                <Link
                  href="/transparencia"
                  className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                >
                  Assignació municipal
                </Link>
                <Link
                  href="/dades"
                  className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                >
                  Dades
                </Link>
                <Link
                  href="/compromisos"
                  className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                >
                  Compromisos
                </Link>
              </div>
            </div>
          </nav>

          {/* Icones de Redes i Botó Menú Mòbil */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-neutral-500">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
            </div>

            {/* Hamburguesa mòbil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100"
              aria-label={mobileMenuOpen ? 'Tancar menú' : 'Obrir menú'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mòbil (Ben ordenat per categories) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 bg-white px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Seccions Principals */}
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider ${
                pathname === '/' ? 'bg-primary/10 text-primary' : 'text-neutral-700'
              }`}
            >
              Inici
            </Link>
            <Link
              href="/noticies"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider ${
                pathname.startsWith('/noticies') ? 'bg-primary/10 text-primary' : 'text-neutral-700'
              }`}
            >
              Notícies
            </Link>
            <Link
              href="/qui-som"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider ${
                pathname === '/qui-som' ? 'bg-primary/10 text-primary' : 'text-neutral-700'
              }`}
            >
              Qui som
            </Link>
          </div>

          {/* Categoria Participació */}
          <div className="space-y-1 pt-2 border-t border-neutral-100">
            <span className="block px-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Participació</span>
            <Link
              href="/preguntes"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider text-xs pl-6 ${
                pathname === '/preguntes' ? 'text-primary' : 'text-neutral-600'
              }`}
            >
              • Pregunta al regidor
            </Link>
            <Link
              href="/comerc"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider text-xs pl-6 ${
                pathname === '/comerc' ? 'text-primary' : 'text-neutral-600'
              }`}
            >
              • Comerç local
            </Link>
            <Link
              href="/contacte"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider text-xs pl-6 ${
                pathname === '/contacte' ? 'text-primary' : 'text-neutral-600'
              }`}
            >
              • Bústia de contacte
            </Link>
          </div>

          {/* Categoria Transparència */}
          <div className="space-y-1 pt-2 border-t border-neutral-100">
            <span className="block px-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Transparència</span>
            <Link
              href="/transparencia"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider text-xs pl-6 ${
                pathname === '/transparencia' ? 'text-primary' : 'text-neutral-600'
              }`}
            >
              • Assignació municipal
            </Link>
            <Link
              href="/dades"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider text-xs pl-6 ${
                pathname === '/dades' ? 'text-primary' : 'text-neutral-600'
              }`}
            >
              • Dades
            </Link>
            <Link
              href="/compromisos"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded font-bold uppercase tracking-wider text-xs pl-6 ${
                pathname === '/compromisos' ? 'text-primary' : 'text-neutral-600'
              }`}
            >
              • Compromisos
            </Link>
          </div>

          {/* Xarxes del Mòbil */}
          <div className="flex items-center gap-4 px-3 py-2 pt-4 border-t border-neutral-100 text-neutral-500">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <InstagramIcon />
            </a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <TwitterIcon />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
