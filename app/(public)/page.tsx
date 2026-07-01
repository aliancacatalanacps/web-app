import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import NoticiaCard from '@/components/public/NoticiaCard'
import MembreCard from '@/components/public/MembreCard'
import { Noticia, Membre } from '@/lib/types'

// Icones SVG per evitar problemes d'importació amb versions de lucide-react
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" width="28" height="28">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

// Dades de demostració en cas que la base de dades no estigui configurada o no tingui dades
const fallbackNoticies: Noticia[] = [
  {
    id: 'f1',
    tipus: 'noticia',
    titol: "Aliança Catalana presenta un pla integral per reformar el passeig marítim de Platja d'Aro",
    slug: 'pla-integral-passeig-maritim',
    cos: "El nostre equip proposa una renovació sostenible que prioritzi els vianants i recolzi el comerç local.",
    data_publicacio: new Date().toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    link_extern: null,
    publicat: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'f2',
    tipus: 'premsa',
    titol: "Entrevista a la cap de llista a Ràdio Platja d'Aro: 'Volem governar per als veïns'",
    slug: 'entrevista-radio-platjadaro',
    cos: "La portaveu d'Aliança Catalana Platja d'Aro explica les prioritats per al pròxim plenari municipal.",
    data_publicacio: new Date(Date.now() - 86400000).toISOString(),
    imatge_portada: null,
    link_extern: 'https://www.radioplatjadaro.cat',
    publicat: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'f3',
    tipus: 'galeria',
    titol: "Èxit de convocatòria a la parada informativa de Platja d'Aro",
    slug: 'exit-convocatoria-parada-informativa',
    cos: "Agraïm a tots els veïns i simpatitzants que es van apropar per conversar sobre els nostres projectes.",
    data_publicacio: new Date(Date.now() - 172800000).toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    link_extern: null,
    publicat: true,
    created_at: new Date().toISOString()
  }
]

const fallbackMembres: Membre[] = [
  {
    id: 'm1',
    nom: "Sílvia Rovira i Vila",
    carrec: "Portaveu i Cap de llista",
    bio: "Llicenciada en Dret. Defensora ferma de la identitat nacional i de la seguretat a Castell-Platja d'Aro i S'Agaró.",
    foto: null,
    ordre: 1,
    actiu: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm2',
    nom: "Joan Mas i Sabater",
    carrec: "Coordinador Local",
    bio: "Empresari del sector de la restauració. Dedicat a promoure el teixit productiu de Platja d'Aro.",
    foto: null,
    ordre: 2,
    actiu: true,
    created_at: new Date().toISOString()
  }
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="36" height="36">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.43-.47-.62-.73v7.02c0 3.74-3.13 6.87-6.88 6.87-3.86 0-7.05-3.23-6.85-7.15.17-3.36 2.97-6.07 6.34-6.02.13 0 .26.01.39.02v4.03c-2.2-.18-4.07 1.62-4.1 3.82-.03 2.19 1.75 4.02 3.94 4.02 2.2 0 3.98-1.78 3.98-3.98v-11.6c-.02-1.39-.01-2.78-.02-4.17z"/>
    </svg>
  )
}

export default async function HomePage() {
  let noticies: Noticia[] = []
  let membres: Membre[] = []

  try {
    const supabase = await createClient()
    
    // Obtenir notícies
    const { data: dbNoticies } = await supabase
      .from('noticies')
      .select('*')
      .eq('publicat', true)
      .order('data_publicacio', { ascending: false })
      .limit(3)

    if (dbNoticies && dbNoticies.length > 0) {
      noticies = dbNoticies
    } else {
      noticies = fallbackNoticies
    }

    // Obtenir membres
    const { data: dbMembres } = await supabase
      .from('membres')
      .select('*')
      .eq('actiu', true)
      .order('ordre', { ascending: true })

    if (dbMembres && dbMembres.length > 0) {
      membres = dbMembres
    } else {
      membres = fallbackMembres
    }
  } catch (error) {
    console.error('Error carregant dades de Supabase, usant fallbacks', error)
    noticies = fallbackNoticies
    membres = fallbackMembres
  }

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-100 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-6">
              Agrupació Municipal · Platja d'Aro
            </span>
            <h1 className="font-sans font-black text-4xl sm:text-6xl text-neutral-900 tracking-tight leading-none mb-6 newsroom-title">
              Salvem <span className="text-primary">Platja d'Aro</span>.<br />
              Salvem Catalunya.
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 font-normal leading-relaxed mb-10 max-w-2xl">
              Som l'agrupació local que vetlla per la identitat catalana, el benestar, la seguretat ciutadana i el teixit productiu de Castell-Platja d'Aro i S'Agaró. Amb valentia i arrels.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/noticies"
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3.5 text-sm font-bold text-white shadow hover:bg-primary-dark hover:-translate-y-0.5"
              >
                Llegir notícies
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contacte"
                className="inline-flex items-center gap-2 rounded border border-neutral-200 px-6 py-3.5 text-sm font-bold text-neutral-700 bg-white hover:bg-neutral-50 hover:-translate-y-0.5"
              >
                Parla amb nosaltres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ULTIMES NOTICIES */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Comunicació</span>
              <h2 className="font-sans font-black text-3xl text-neutral-900 tracking-tight mt-1">Últimes notícies</h2>
            </div>
            <Link
              href="/noticies"
              className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-4 sm:mt-0"
            >
              Veure totes les notícies
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {noticies.map((noticia) => (
              <div key={noticia.id}>
                <NoticiaCard noticia={noticia} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUI SOM */}
      <section className="py-20 bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">El Nostre Equip</span>
              <h2 className="font-sans font-black text-3xl text-neutral-900 tracking-tight mt-1">Qui som</h2>
            </div>
            <Link
              href="/qui-som"
              className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-4 sm:mt-0"
            >
              Conèixer l'equip sencer
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {membres.slice(0, 3).map((membre) => (
              <div key={membre.id}>
                <MembreCard membre={membre} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REDES SOCIALES SECTION */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Xarxes Socials</span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight mt-2 mb-4">
            Segueix-nos a la xarxa
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-10 text-sm">
            Estigues connectat minut a minut per saber què proposem i què passa als plens de Platja d'Aro.
          </p>
          
          <div className="flex justify-center gap-8 sm:gap-12 flex-wrap">
            <a
              href="https://instagram.com/aliancacatalanaplatjadaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 hover:text-primary transition-colors text-white group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-primary transition-colors">
                <InstagramIcon />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Instagram</span>
            </a>
            <a
              href="https://tiktok.com/@aliancacatalanaplatjadaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 hover:text-primary transition-colors text-white group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-primary transition-colors">
                <TikTokIcon />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">TikTok</span>
            </a>
            <a
              href="https://x.com/acplatjadaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 hover:text-primary transition-colors text-white group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-primary transition-colors">
                <TwitterIcon />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Twitter / X</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
