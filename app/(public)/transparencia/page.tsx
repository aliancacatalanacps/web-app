import { createClient } from '@/lib/supabase/server'
import { TransparenciaEconomica } from '@/lib/types'
import { FileText, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

export const revalidate = 3600 // Cache d'una hora per a la transparència

const fallbackTransparencia: TransparenciaEconomica[] = [
  {
    id: 't1',
    concepte: "Assignació municipal pel Grup Polític Castell-Platja d'Aro i S'Agaró",
    import: 1200.00,
    data: "2026-02-15",
    descripcio: "Ingrés corresponent al primer trimestre rebut de la corporació municipal.",
    document_url: null
  },
  {
    id: 't2',
    concepte: "Impremta i disseny de pamflets informatius locals",
    import: -350.25,
    data: "2026-03-02",
    descripcio: "Impressió de fullets per a les parades informatives municipals realitzades.",
    document_url: null
  },
  {
    id: 't3',
    concepte: "Reserva de sala per a acte obert de l'agrupació",
    import: -120.00,
    data: "2026-04-10",
    descripcio: "Lloguer puntual de l'espai per a la reunió oberta amb veïns del municipi.",
    document_url: null
  }
]

export const metadata = {
  title: "Transparència Econòmica",
  description: "Balanç econòmic del grup municipal d'Aliança Catalana Platja d'Aro. Com utilitzem els nostres recursos.",
}

export default async function TransparenciaPage() {
  let partides: TransparenciaEconomica[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('transparencia_economica')
      .select('*')
      .order('data', { ascending: false })

    if (data && data.length > 0) {
      partides = data
    } else {
      partides = fallbackTransparencia
    }
  } catch (error) {
    console.error('Error carregant transparència, usant fallbacks', error)
    partides = fallbackTransparencia
  }

  // Calcul dels totals
  const totalIngressos = partides.filter(p => p.import > 0).reduce((acc, p) => acc + p.import, 0)
  const totalDespeses = partides.filter(p => p.import < 0).reduce((acc, p) => acc + Math.abs(p.import), 0)
  const saldo = totalIngressos - totalDespeses

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Compromís ètic</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Transparència Econòmica
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Creiem en una política neta. Aquí detallem de forma pública fins a l'últim cèntim rebut i utilitzat pel nostre grup local.
          </p>
        </div>

        {/* Resum de Balanç (3 columnes) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 shadow-sm">
            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Total ingressos</span>
            <div className="flex items-baseline gap-1 mt-2 text-green-600">
              <span className="font-sans font-black text-3xl">{totalIngressos.toFixed(2)}</span>
              <span className="text-sm font-semibold">€</span>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 shadow-sm">
            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Total despeses</span>
            <div className="flex items-baseline gap-1 mt-2 text-red-600">
              <span className="font-sans font-black text-3xl">{totalDespeses.toFixed(2)}</span>
              <span className="text-sm font-semibold">€</span>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Saldo acumulat</span>
              <div className={`flex items-baseline gap-1 mt-2 ${saldo >= 0 ? 'text-primary' : 'text-red-700'}`}>
                <span className="font-sans font-black text-3xl">{(saldo).toFixed(2)}</span>
                <span className="text-sm font-semibold">€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Llistat detallat de partides */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Detall de partides</h3>
            <span className="text-xs text-neutral-400 font-semibold">{partides.length} registres actius</span>
          </div>

          <ul className="divide-y divide-neutral-100">
            {partides.map((p) => {
              const isIngres = p.import > 0
              const formattedDate = new Date(p.data).toLocaleDateString('ca', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })

              return (
                <li key={p.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        isIngres ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isIngres ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {isIngres ? 'Ingrés' : 'Despesa'}
                      </span>
                      <time className="text-[10px] text-neutral-400 font-bold uppercase">{formattedDate}</time>
                    </div>
                    <h4 className="font-sans font-bold text-neutral-900 leading-snug">
                      {p.concepte}
                    </h4>
                    {p.descripcio && (
                      <p className="text-xs text-neutral-500 leading-relaxed pt-0.5">{p.descripcio}</p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                    <span className={`font-sans font-extrabold text-lg ${isIngres ? 'text-green-600' : 'text-neutral-900'}`}>
                      {isIngres ? '+' : '-'}{Math.abs(p.import).toFixed(2)} €
                    </span>

                    {p.document_url && (
                      <a
                        href={p.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                      >
                        <FileText size={12} />
                        Veure justificant PDF
                      </a>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
