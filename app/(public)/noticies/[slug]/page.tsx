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
    titol: "Aliança Catalana demana reforçar la seguretat i aplicar un pla de civisme integral a Platja d'Aro per a la temporada d'estiu",
    slug: 'reforc-seguretat-pla-civisme-estiu',
    cos: "El regidor i portaveu Aitor Tendero demana mesures fermes davant l'augment del turisme per garantir el descans dels veïns i recolzar els comerciants locals del municipi.\n\nProposem augmentar els patrullatges preventius de la Policia Local a les zones comercials i d'oci nocturn, i sancionar amb severitat el soroll i les actituds incíviques per assegurar que Platja d'Aro segueixi sent una destinació acollidora i segura. Treballem cada dia per mantenir l'ordre i el benestar de la nostra comunitat.",
    data_publicacio: new Date().toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    link_extern: null,
    publicat: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'f2',
    tipus: 'premsa',
    titol: "Aitor Tendero a Ràdio Platja d'Aro: 'Cal una regulació equilibrada per defensar els petits propietaris d'habitatges turístics'",
    slug: 'aitor-tendero-declaracions-habitatge-turistic',
    cos: "El portaveu municipal d'Aliança Catalana defensa els autònoms i petits propietaris de la Vall d'Aro davant les noves restriccions que amenacen l'economia familiar.",
    data_publicacio: new Date(Date.now() - 86400000).toISOString(),
    imatge_portada: null,
    link_extern: 'https://www.rpa.cat',
    publicat: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'f3',
    tipus: 'noticia',
    titol: "David Schelvis proposa un pla de dinamització per recolzar les entitats, penyes i associacions culturals de Castell i Platja d'Aro",
    slug: 'david-schelvis-pla-dinamitzacio-entitats-locals',
    cos: "El representant de l'equip local proposa simplificar la burocràcia municipal i crear noves línies de suport directe per reactivar l'activitat de les associacions esportives i de lleure que formen la identitat del nostre municipi.\n\nHem recollit propostes de diverses entitats locals per dissenyar un suport econòmic flexible que els permeti seguir dinamitzant Castell-Platja d'Aro i S'Agaró.",
    data_publicacio: new Date(Date.now() - 172800000).toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    link_extern: null,
    publicat: true,
    created_at: new Date().toISOString()
  }
]

const fallbackFotos: Record<string, NoticiaFoto[]> = {
  'david-schelvis-pla-dinamitzacio-entitats-locals': [
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
