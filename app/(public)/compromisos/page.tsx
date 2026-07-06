import { createClient } from '@/lib/supabase/server'
import { Compromis } from '@/lib/types'
import { Target, CheckCircle2, Play, Circle, XCircle, Calendar } from 'lucide-react'

export const revalidate = 3600 // Cache d'una hora per als compromisos

const fallbackCompromisos: Compromis[] = [
  {
    id: 'c1',
    titol: "Defensar els autònoms i petits propietaris d'HUTs",
    descripcio: "Ens oposem a les traves excessives sobre petits habitatges turístics que mantenen l'economia familiar a la Costa Brava. Demanem una moratòria i diàleg amb el sector.",
    estat: 'en_curs',
    data_actualitzacio: "2026-06-10"
  },
  {
    id: 'c2',
    titol: "Campanyes de civisme i control de soroll a les zones d'oci",
    descripcio: "Exigim l'aplicació rigorosa de les ordenances de soroll i sancions clares per garantir la convivència del turisme amb els nostres veïns.",
    estat: 'complert',
    data_actualitzacio: "2026-06-25"
  },
  {
    id: 'c3',
    titol: "Reducció de les traves burocràtiques per a les entitats locals",
    descripcio: "Simplificar els permisos de penyes i entitats culturals/esportives a Platja d'Aro per tal que puguin organitzar actes sense costos excessius.",
    estat: 'pendent',
    data_actualitzacio: "2026-05-12"
  }
]

export const metadata = {
  title: "Seguiment de Compromisos",
  description: "Consulta l'estat d'execució de les propostes i compromisos d'Aliança Catalana Platja d'Aro.",
}

export default async function CompromisosPage() {
  let compromisos: Compromis[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('compromisos')
      .select('*')
      .order('titol', { ascending: true })

    if (data && data.length > 0) {
      compromisos = data
    } else {
      compromisos = fallbackCompromisos
    }
  } catch (error) {
    console.error('Error carregant compromisos, usant fallbacks', error)
    compromisos = fallbackCompromisos
  }

  // Calcul dels percentatges de progrés
  const total = compromisos.length
  const complerts = compromisos.filter(c => c.estat === 'complert').length
  const enCurs = compromisos.filter(c => c.estat === 'en_curs').length
  const pctComplert = total > 0 ? Math.round((complerts / total) * 100) : 0

  function getBadgeStyle(estat: string) {
    switch (estat) {
      case 'complert':
        return {
          bg: 'bg-green-50 border-green-200 text-green-700',
          label: 'Complert',
          icon: <CheckCircle2 size={14} className="text-green-600 shrink-0" />
        }
      case 'en_curs':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          label: 'En curs',
          icon: <Play size={14} className="text-blue-600 shrink-0" />
        }
      case 'rebutjat':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          label: 'Rebutjat',
          icon: <XCircle size={14} className="text-red-600 shrink-0" />
        }
      default:
        return {
          bg: 'bg-neutral-50 border-neutral-200 text-neutral-600',
          label: 'Pendent',
          icon: <Circle size={14} className="text-neutral-400 shrink-0" />
        }
    }
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest font-sans">Retiment de comptes</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Seguiment de Compromisos
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Mantenim el compromís amb la transparència. Consulta el progrés d'execució i l'estat de cadascuna de les nostres propostes i promeses locals.
          </p>
        </div>

        {/* Resum gràfic del progrés electoral */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 sm:p-8 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <h3 className="font-sans font-bold text-neutral-900 text-lg">Progrés de compromisos</h3>
            <p className="text-sm text-neutral-500">
              Hem assolit el <span className="font-bold text-primary">{pctComplert}%</span> de les nostres propostes definides o defensades activament al plenari municipal.
            </p>
          </div>
          
          <div className="flex gap-8 text-center justify-center shrink-0">
            <div>
              <span className="block text-3xl font-black text-neutral-900 font-sans">{total}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Propostes</span>
            </div>
            <div>
              <span className="block text-3xl font-black text-green-600 font-sans">{complerts}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Assolides</span>
            </div>
            <div>
              <span className="block text-3xl font-black text-blue-600 font-sans">{enCurs}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase">En marxa</span>
            </div>
          </div>
        </div>

        {/* Llista de compromisos */}
        <div className="space-y-6">
          {compromisos.map((c) => {
            const style = getBadgeStyle(c.estat)
            const formattedDate = new Date(c.data_actualitzacio).toLocaleDateString('ca', {
              month: 'long',
              year: 'numeric'
            })

            return (
              <div key={c.id} className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/5 text-primary border border-primary/10">
                      <Target size={16} />
                    </div>
                    <h3 className="font-sans font-bold text-neutral-900 text-base sm:text-lg">
                      {c.titol}
                    </h3>
                  </div>

                  <span className={`inline-flex items-center gap-1 border rounded px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.bg}`}>
                    {style.icon}
                    {style.label}
                  </span>
                </div>

                {c.descripcio && (
                  <p className="text-sm text-neutral-600 leading-relaxed pl-11 mb-4">
                    {c.descripcio}
                  </p>
                )}

                <div className="pl-11 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase">
                  <Calendar size={12} />
                  <span>Darrera actualització: {formattedDate}</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
