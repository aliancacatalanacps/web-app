import { createClient } from '@/lib/supabase/server'
import MembreCard from '@/components/public/MembreCard'
import { Membre } from '@/lib/types'

const fallbackMembres: Membre[] = [
  {
    id: 'm1',
    nom: "Aitor Tendero i Guirado",
    carrec: "Portaveu i Regidor Municipal",
    bio: "Graduat en Ciències Polítiques i de l'Administració (UPF). Emprenedor local amb àmplia experiència internacional (Austràlia). Regidor i portaveu a l'Ajuntament de Castell-Platja d'Aro i S'Agaró, on treballa activament en comissions de Turisme, Promoció Econòmica i Esports. Defensor de la identitat nacional i la seguretat ciutadana.",
    foto: null,
    ordre: 1,
    actiu: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm2',
    nom: "David Schelvis i Gibert",
    carrec: "Coordinador d'Esdeveniments i Entitats",
    bio: "Empresari especialitzat en la gestió i organització d'esdeveniments d'oci, cultura i esports a Platja d'Aro. President de l'Associació Penya Barça Fans d'Aro i promotor actiu del teixit social, turístic i cultural local.",
    foto: null,
    ordre: 2,
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
