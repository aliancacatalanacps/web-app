import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GaleriaGrid from '@/components/public/GaleriaGrid'
import { Noticia, NoticiaFoto, Mocio } from '@/lib/types'
import { CheckCircle2, XCircle, AlertCircle as AlertIcon, Calendar, ArrowLeft, ExternalLink, Share2 } from 'lucide-react'

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
    cos: "El representant de l'equip local proposa simplificar la burocràcia municipal i crear noves línies de suport directe per reactivar l'activitat de les associacions esportives i de lleure que formen la identitat del nostre municipi.\n\nHem recollit propostes de diverses entitats locals per dissenyar un suport econòmic flexible que os permeti seguir dinamitzant Castell-Platja d'Aro i S'Agaró.",
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

const fallbackMocions: Record<string, Mocio[]> = {
  'reforc-seguretat-pla-civisme-estiu': [
    {
      id: 'mo1',
      noticia_id: 'f1',
      titol: "Moció per incrementar els recursos i patrulles nocturnes de la Policia Local a Castell-Platja d'Aro",
      resultat: 'rebutjada',
      vots_favor: 6,
      vots_contra: 11,
      abstencions: 0
    },
    {
      id: 'mo2',
      noticia_id: 'f1',
      titol: "Moció per impulsar campanyes informatives de civisme a la zona d'oci nocturn",
      resultat: 'aprovada',
      vots_favor: 17,
      vots_contra: 0,
      abstencions: 0
    }
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
    // ignorat
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
  let mocions: Mocio[] = []

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

      // Obtenir mocions associades
      const { data: dbMocions } = await supabase
        .from('mocions')
        .select('*')
        .eq('noticia_id', dbNoticia.id)

      if (dbMocions) mocions = dbMocions
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
    mocions = fallbackMocions[slug] || []
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
          <div className="mt-8 border-t border-neutral-200 pt-8">
            <GaleriaGrid fotos={fotos} />
          </div>
        )}

        {/* Bloc especial de Mocions del Ple si n'hi ha */}
        {mocions.length > 0 && (
          <div className="mt-12 border-t border-neutral-200 pt-8 space-y-6">
            <h3 className="font-sans font-black text-xl text-neutral-900 tracking-tight flex items-center gap-2">
              <span className="h-5 w-1 bg-primary inline-block rounded"></span>
              Mocions i Votacions en aquest Ple
            </h3>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              Detall de les propostes i resolucions presentades pel nostre grup municipal en aquesta sessió ordinària del consistori de Platja d'Aro.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {mocions.map((mo) => {
                const totalVots = mo.vots_favor + mo.vots_contra + mo.abstencions
                const pctFavor = totalVots > 0 ? (mo.vots_favor / totalVots) * 100 : 0
                const pctContra = totalVots > 0 ? (mo.vots_contra / totalVots) * 100 : 0
                const pctAbstencions = totalVots > 0 ? (mo.abstencions / totalVots) * 100 : 0

                return (
                  <div key={mo.id} className="border border-neutral-200 rounded-lg p-5 bg-neutral-50 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          mo.resultat === 'aprovada'
                            ? 'bg-green-100 text-green-800'
                            : mo.resultat === 'rebutjada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}>
                          {mo.resultat === 'aprovada' ? (
                            <CheckCircle2 size={10} />
                          ) : mo.resultat === 'rebutjada' ? (
                            <XCircle size={10} />
                          ) : (
                            <AlertIcon size={10} />
                          )}
                          {mo.resultat}
                        </span>
                      </div>
                      
                      <h4 className="font-sans font-bold text-neutral-900 text-sm leading-snug mb-4">
                        {mo.titol}
                      </h4>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-neutral-200/60">
                      {/* Favor */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-neutral-500">A favor</span>
                          <span className="text-neutral-700">{mo.vots_favor} vots</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${pctFavor}%` }}></div>
                        </div>
                      </div>

                      {/* Contra */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-neutral-500">En contra</span>
                          <span className="text-neutral-700">{mo.vots_contra} vots</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${pctContra}%` }}></div>
                        </div>
                      </div>

                      {/* Abstencions */}
                      {mo.abstencions > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-neutral-500">Abstencions</span>
                            <span className="text-neutral-700">{mo.abstencions} vots</span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-400 rounded-full" style={{ width: `${pctAbstencions}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
      </div>
    </article>
  )
}
