import { createClient } from '@/lib/supabase/server'
import MembreCard from '@/components/public/MembreCard'
import { Membre } from '@/lib/types'

const fallbackMembres: Membre[] = [
  {
    id: 'm1',
    nom: "Sílvia Rovira i Vila",
    carrec: "Portaveu i Cap de llista",
    bio: "Llicenciada en Dret. Defensora ferma de la identitat nacional i de la seguretat a Castell-Platja d'Aro i S'Agaró. Amb una llarga trajectòria en l'àmbit jurídic local.",
    foto: null,
    ordre: 1,
    actiu: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm2',
    nom: "Joan Mas i Sabater",
    carrec: "Coordinador Local",
    bio: "Empresari de restauració a Platja d'Aro. Compromès amb la defensa dels autònoms, comerciants i empreses de proximitat catalanes.",
    foto: null,
    ordre: 2,
    actiu: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm3',
    nom: "Carme Soler i Font",
    carrec: "Responsable de Cohesió i Afiliats",
    bio: "Professora de secundària. Compromesa amb el manteniment del teixit associatiu, la llengua catalana i les nostres tradicions.",
    foto: null,
    ordre: 3,
    actiu: true,
    created_at: new Date().toISOString()
  }
]

export const metadata = {
  title: "Qui som",
  description: "Coneix l'equip d'Aliança Catalana Platja d'Aro. Treballem per defensar el nostre municipi.",
}

export default async function QuiSomPage() {
  let membres: Membre[] = []

  try {
    const supabase = await createClient()
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
    console.error('Error carregant membres, usant fallbacks', error)
    membres = fallbackMembres
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Capçalera de secció */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">La nostra organització</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Qui som
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Un equip compromès amb el teixit local, l'arrelament a la nostra terra i la millora contínua de les condicions de vida a Platja d'Aro, Castell i S'Agaró.
          </p>
        </div>

        {/* Grid de l'equip */}
        {membres.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            No hi ha dades disponibles sobre l'equip local.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {membres.map((membre) => (
              <div key={membre.id}>
                <MembreCard membre={membre} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
