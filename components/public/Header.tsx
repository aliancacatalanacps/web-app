'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

// Icones SVG per evitar problemes d'importació amb versions de lucide-react
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" width="18" height="18">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
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
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.43-.47-.62-.73v7.02c0 3.74-3.13 6.87-6.88 6.87-3.86 0-7.05-3.23-6.85-7.15.17-3.36 2.97-6.07 6.34-6.02.13 0 .26.01.39.02v4.03c-2.2-.18-4.07 1.62-4.1 3.82-.03 2.19 1.75 4.02 3.94 4.02 2.2 0 3.98-1.78 3.98-3.98v-11.6c-.02-1.39-.01-2.78-.02-4.17z"/>
    </svg>
  )
}

const navLinks = [
  { href: '/', label: 'Inici' },
  { href: '/qui-som', label: 'Qui som' },
  { href: '/noticies', label: 'Notícies' },
  { href: '/contacte', label: 'Contacte' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-white font-extrabold text-sm tracking-tight border border-primary-dark shadow-sm">
                AC
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-sm tracking-tight text-neutral-900 leading-none">Aliança Catalana</span>
                <span className="font-sans text-[10px] font-semibold text-primary tracking-widest uppercase mt-0.5 leading-none">Platja d'Aro</span>
              </div>
            </Link>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Icones de Redes i Botó Menú Mòbil */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-neutral-500">
              <a
                href="https://instagram.com/aliancacatalanaplatjadaro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://tiktok.com/@aliancacatalanaplatjadaro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://x.com/acplatjadaro"
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
              className="md:hidden p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100"
              aria-label={mobileMenuOpen ? 'Tancar menú' : 'Obrir menú'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mòbil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          
          <div className="flex items-center gap-4 px-3 py-2 pt-4 border-t border-neutral-100 text-neutral-500">
            <a
              href="https://instagram.com/aliancacatalanaplatjadaro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://tiktok.com/@aliancacatalanaplatjadaro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/acplatjadaro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              <TwitterIcon />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
