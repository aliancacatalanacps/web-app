import Link from 'next/link'
import ButlletiForm from './ButlletiForm'

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
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.43-.47-.62-.73v7.02c0 3.74-3.13 6.87-6.88 6.87-3.86 0-7.05-3.23-6.85-7.15.17-3.36 2.97-6.07 6.34-6.02.13 0 .26.01.39.02v4.03c-2.2-.18-4.07 1.62-4.1 3.82-.03 2.19 1.75 4.02 3.94 4.02 2.2 0 3.98-1.78 3.98-3.98v-11.6c-.02-1.39-.01-2.78-.02-4.17z"/>
    </svg>
  )
}

export default function Footer({ config = {} }: { config?: Record<string, string> }) {
  const email = config.contacte_email || 'platjadaro@aliancacatalana.cat'
  const telefon = config.contacte_telefon
  const instagramUrl = config.xarxes_instagram || 'https://instagram.com/acplatjadaro'
  const tiktokUrl = config.xarxes_tiktok || 'https://tiktok.com/@acplatjadaro'
  const twitterUrl = config.xarxes_twitter || 'https://x.com/acplatjadaro'

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12 text-neutral-600">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo i Descripció */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Aliança Catalana"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col ml-2 border-l border-neutral-200 pl-2">
                <span className="font-sans font-bold text-[10px] tracking-tight text-neutral-900 leading-none">Castell d'Aro</span>
                <span className="font-sans text-[7px] font-bold text-primary tracking-widest uppercase mt-0.5 leading-none">Platja d'Aro i s'Agaró</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 max-w-xs">
              Secció municipal d'Aliança Catalana a Castell d'Aro, Platja d'Aro i s'Agaró. Defensa de la identitat, arrels catalanes, seguretat i prosperitat.
            </p>
          </div>

          {/* Enllaços ràpids */}
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 uppercase tracking-wider mb-4">Navegació</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Inici</Link>
              </li>
              <li>
                <Link href="/qui-som" className="hover:text-primary transition-colors">Qui som</Link>
              </li>
              <li>
                <Link href="/noticies" className="hover:text-primary transition-colors">Notícies</Link>
              </li>
              <li>
                <Link href="/contacte" className="hover:text-primary transition-colors">Contacte</Link>
              </li>
            </ul>
          </div>

          {/* Contacte i Socials */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-semibold text-sm text-neutral-900 uppercase tracking-wider">Contacta'ns</h4>
            <div className="space-y-1.5 text-sm text-neutral-500">
              <p>
                Correu: <a href={`mailto:${email}`} className="hover:text-primary font-mono text-xs">{email}</a>
              </p>
              {telefon && (
                <p>
                  Telèfon: <span className="font-semibold text-neutral-700">{telefon}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-neutral-500 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Formulari Butlletí */}
          <div>
            <ButlletiForm />
          </div>
        </div>

        {/* Separador i Drets/Legals */}
        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} Aliança Catalana Platja d'Aro. Tots els drets reservats.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Avís legal</a>
            <a href="#" className="hover:text-primary transition-colors">Privacitat</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
