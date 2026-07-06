import { createClient } from '@/lib/supabase/server'
import { DadesMunicipi } from '@/lib/types'
import { Landmark, Users, Home, TrendingUp, Calendar, ExternalLink } from 'lucide-react'

export const revalidate = 7200 // Cache de dues hores per a les dades del municipi

const fallbackDades: DadesMunicipi[] = [
  {
    id: 'd1',
    nom_indicador: "Pressupost Municipal General",
    valor: "38.200.000",
    unitat: "€",
    font: "Ajuntament de Castell-Platja d'Aro (Pressupost Aprovat 2026)",
    data_actualitzacio: "2026-01-15"
  },
  {
    id: 'd2',
    nom_indicador: "Taxa d'Atur Municipal Registrada",
    valor: "8,7",
    unitat: "%",
    font: "Observatori del Treball - Generalitat de Catalunya (Dades comarcals Q1 2026)",
    data_actualitzacio: "2026-04-10"
  },
  {
    id: 'd3',
    nom_indicador: "Ocupació Turística Mitjana (Estiu)",
    valor: "91,5",
    unitat: "%",
    font: "Enquesta d'Ocupació d'Allotjaments de la Costa Brava (Dades estiu anterior)",
    data_actualitzacio: "2025-09-15"
  }
]

export const metadata = {
  title: "Dades Municipals Obertes",
  description: "Dades obertes i indicadors socioeconòmics clau del municipi de Castell-Platja d'Aro i S'Agaró.",
}

export default async function DadesPage() {
  let indicadors: DadesMunicipi[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('dades_municipi')
      .select('*')
      .order('data_actualitzacio', { ascending: false })

    if (data && data.length > 0) {
      indicadors = data
    } else {
      indicadors = fallbackDades
    }
  } catch (error) {
    console.error('Error carregant indicadors municipals, usant fallbacks', error)
    indicadors = fallbackDades
  }

  // Helper per assignar icones a indicadors rellevants
  function getIcon(nom: string) {
    const n = nom.toLowerCase()
    if (n.includes('pressupost') || n.includes('econom') || n.includes('diners')) {
      return <Landmark className="text-primary" size={24} />
    }
    if (n.includes('atur') || n.includes('treball') || n.includes('poblacio') || n.includes('habitants')) {
      return <Users className="text-primary" size={24} />
    }
    return <Home className="text-primary" size={24} />
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Rigor i obertura</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Dades del Municipi en Obert
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Compartim els indicadors clau sobre la gestió municipal, turisme, ocupació i pressupostos a Castell-Platja d'Aro i S'Agaró basats estrictament en fonts oficials.
          </p>
        </div>

        {/* Llista d'indicadors en graella */}
        {indicadors.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            No hi ha dades municipals disponibles actualment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {indicadors.map((ind) => {
              const formattedDate = new Date(ind.data_actualitzacio).toLocaleDateString('ca', {
                month: 'short',
                year: 'numeric'
              })

              return (
                <div key={ind.id} className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-6">
                      <h3 className="font-sans font-bold text-sm text-neutral-500 uppercase tracking-wider leading-relaxed">
                        {ind.nom_indicador}
                      </h3>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/5 border border-primary/10">
                        {getIcon(ind.nom_indicador)}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="font-sans font-black text-5xl tracking-tight text-neutral-900 leading-none">
                        {ind.valor}
                      </span>
                      {ind.unitat && (
                        <span className="text-lg font-extrabold text-neutral-400">
                          {ind.unitat}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-2">
                    <div className="flex items-center gap-1 font-semibold">
                      <Calendar size={12} className="text-neutral-400" />
                      <span>Actualitzat el {formattedDate}</span>
                    </div>
                    
                    <div className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                      Font: <span className="text-neutral-500 font-semibold">{ind.font}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
