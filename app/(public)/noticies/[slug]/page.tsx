import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, ExternalLink, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import GaleriaGrid from '@/components/public/GaleriaGrid'
import { Noticia, NoticiaFoto } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

const fallbackNoticies: Noticia[] = [
  {
    id: 'f1',
    tipus: 'noticia',
    titol: "Aliança Catalana presenta un pla integral per reformar el passeig marítim de Platja d'Aro",
    slug: 'pla-integral-passeig-maritim',
    cos: "El nostre equip proposa una renovació sostenible que prioritzi els vianants i recolzi el comerç local.\n\nVolem crear espais amplis per a passejar, millorar l'enllumenat públic utilitzant tecnologia LED de baix consum, i augmentar les zones verdes amb plantes autòctones de la Costa Brava.\n\nAquesta mesura no només farà el passeig més atractiu per als veïns, sinó que reactivarà l'activitat econòmica de les terrasses i botigues locals durant la temporada baixa. Seguirem defensant aquest i altres projectes al proper plenari municipal.",
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
    cos: "Agraïm a tots els veïns i simpatitzants que es van apropar per conversar sobre els nostres projectes.\n\nHem recollit propostes molt interessants sobre seguretat, neteja i suport al petit comerç de Castell i Platja d'Aro. Treballem per vosaltres!",
    data_publicacio: new Date(Date.now() - 172800000).toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    link_extern: null,
    publicat: true,
    created_at: new Date().toISOString()
  }
]

const fallbackFotos: Record<string, NoticiaFoto[]> = {
  'exit-convocatoria-parada-informativa': [
    { id: 'pho1', noticia_id: 'f3', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', ordre: 1 },
    { id: 'pho2', noticia_id: 'f3', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', ordre: 2 },
    { id: 'pho3', noticia_id: 'f3', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80', ordre: 3 },
  ]
}

// 1. Generació de Metadades dinàmiques per a SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let noticia: Noticia | undefined

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('noticies')
      .select('*')
      .eq('slug', slug)
      .eq('publicat', true)
      .single()

    if (data) noticia = data
  } catch (e) {
    // ignorat, farem servir el fallback per a les metadades
  }

  if (!noticia) {
    noticia = fallbackNoticies.find(n => n.slug === slug)
  }

  if (!noticia) {
    return {
      title: "Notícia no trobada"
    }
  }

  return {
    title: noticia.titol,
    description: noticia.cos ? noticia.cos.substring(0, 160) : "Notícia d'Aliança Catalana Platja d'Aro",
    openGraph: {
      title: noticia.titol,
      description: noticia.cos ? noticia.cos.substring(0, 160) : "Notícia d'Aliança Catalana Platja d'Aro",
      type: "article",
      publishedTime: noticia.data_publicacio,
      images: noticia.imatge_portada ? [{ url: noticia.imatge_portada }] : undefined
    }
  }
}

// 2. Renderitzat de la pàgina
export default async function NoticiaDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let noticia: Noticia | null = null
  let fotos: NoticiaFoto[] = []

  try {
    const supabase = await createClient()
    
    // Obtenir la notícia
    const { data: dbNoticia } = await supabase
      .from('noticies')
      .select('*')
      .eq('slug', slug)
      .eq('publicat', true)
      .single()

    if (dbNoticia) {
      noticia = dbNoticia

      // Obtenir les fotos associades
      const { data: dbFotos } = await supabase
        .from('noticies_fotos')
        .select('*')
        .eq('noticia_id', dbNoticia.id)
        .order('ordre', { ascending: true })

      if (dbFotos) fotos = dbFotos
    }
  } catch (error) {
    console.error('Error carregant detall de notícia, intentant fallback', error)
  }

  // Fallbacks si no tenim dades a la base de dades
  if (!noticia) {
    const found = fallbackNoticies.find(n => n.slug === slug)
    if (!found) {
      notFound()
    }
    noticia = found
    fotos = fallbackFotos[slug] || []
  }

  const formattedDate = new Date(noticia.data_publicacio).toLocaleDateString('ca', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <article className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Retornar */}
        <div className="mb-8">
          <Link
            href="/noticies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Tornar a les notícies
          </Link>
        </div>

        {/* Data i Tipus */}
        <div className="flex items-center gap-3 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
          <span className="bg-primary/10 px-2.5 py-1 rounded">
            {noticia.tipus === 'noticia' ? 'Notícia' : noticia.tipus === 'premsa' ? 'Premsa' : 'Galeria'}
          </span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Calendar size={13} />
            {formattedDate}
          </span>
        </div>

        {/* Títol prominent */}
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-tight mb-8 newsroom-title">
          {noticia.titol}
        </h1>

        {/* Imatge de Portada */}
        {noticia.imatge_portada && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-200 mb-10">
            <img
              src={noticia.imatge_portada}
              alt={noticia.titol}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Cos de l'Article */}
        {noticia.cos && (
          <div className="prose text-neutral-800 border-b border-neutral-200 pb-10">
            {noticia.cos.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-lg mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Enllaç a mitjans de premsa externs */}
        {noticia.tipus === 'premsa' && noticia.link_extern && (
          <div className="mt-8 p-6 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-neutral-900">Aquesta notícia prové d'un mitjà extern</h4>
              <p className="text-sm text-neutral-500 mt-1">Pots accedir a la publicació original per llegir tot el contingut.</p>
            </div>
            <a
              href={noticia.link_extern}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-primary px-5 py-3 text-sm font-bold text-white shadow hover:bg-primary-dark"
            >
              Llegir article complet
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Galeria de fotos si tipus és galeria o en conté */}
        {fotos.length > 0 && (
          <GaleriaGrid fotos={fotos} />
        )}
        
      </div>
    </article>
  )
}
