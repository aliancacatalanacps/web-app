import { createClient } from '@/lib/supabase/server'
import NoticiaCard from '@/components/public/NoticiaCard'
import NoticiesFiltres from '@/components/public/NoticiesFiltres'
import { Noticia, TipusNoticia } from '@/lib/types'

const fallbackNoticies: Noticia[] = [
  {
    id: 'f1',
    tipus: 'noticia',
    titol: "Aliança Catalana demana reforçar la seguretat i aplicar un pla de civisme integral a Platja d'Aro per a la temporada d'estiu",
    slug: 'reforc-seguretat-pla-civisme-estiu',
    cos: "El regidor i portaveu Aitor Tendero demana mesures fermes davant l'augment del turisme per garantir el descans dels veïns i recolzar els comerciants locals del municipi.\n\nProposem augmentar els patrullatges preventius de la Policia Local a les zones comercials i d'oci nocturn, i sancionar amb severitat el soroll i les actituds incíviques per assegurar que Platja d'Aro segueixi sent una destinació acollidora i segura.",
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
    cos: "El representant de l'equip local proposa simplificar la burocràcia municipal i crear noves línies de suport directe per reactivar l'activitat de les associacions esportives i de lleure que formen la identitat del nostre municipi.",
    data_publicacio: new Date(Date.now() - 172800000).toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    link_extern: null,
    publicat: true,
    created_at: new Date().toISOString()
  }
]

export const metadata = {
  title: "Notícies i Actualitat",
  description: "Segueix l'actualitat i les notícies de l'agrupació d'Aliança Catalana a Platja d'Aro.",
}

interface PageProps {
  searchParams: Promise<{ tipus?: string }>
}

export default async function NoticiesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const tipusFiltre = resolvedSearchParams.tipus

  let noticies: Noticia[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('noticies')
      .select('*')
      .eq('publicat', true)
      .eq('arxivat', false)
      .order('data_publicacio', { ascending: false })

    if (tipusFiltre && tipusFiltre !== 'tot') {
      query = query.eq('tipus', tipusFiltre as TipusNoticia)
    }

    const { data: dbNoticies } = await query

    if (dbNoticies && dbNoticies.length > 0) {
      noticies = dbNoticies
    } else {
      // Filtrar el fallback si no hi ha base de dades
      noticies = tipusFiltre && tipusFiltre !== 'tot'
        ? fallbackNoticies.filter(n => n.tipus === tipusFiltre)
        : fallbackNoticies
    }
  } catch (error) {
    console.error('Error carregant notícies, usant fallbacks', error)
    noticies = tipusFiltre && tipusFiltre !== 'tot'
      ? fallbackNoticies.filter(n => n.tipus === tipusFiltre)
      : fallbackNoticies
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Sala de premsa</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Notícies i Actualitat
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Tots els comunicats oficials, resums d'actes amb imatges i el seguiment dels mitjans de comunicació externs en un sol lloc.
          </p>
        </div>

        {/* Filtres de pestanya */}
        <NoticiesFiltres />

        {/* Llistat */}
        {noticies.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            No s'ha trobat cap entrada que coincideixi amb el filtre seleccionat.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticies.map((noticia) => (
              <div key={noticia.id}>
                <NoticiaCard noticia={noticia} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
