'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TransparenciaEconomica } from '@/lib/types'
import { Landmark, Plus, Trash2, ArrowUpRight, ArrowDownRight, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react'
import FotoUploader from '@/components/admin/FotoUploader'

export default function AdminTransparenciaPage() {
  const [partides, setPartides] = useState<TransparenciaEconomica[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Estats del formulari
  const [concepte, setConcepte] = useState('')
  const [importVal, setImportVal] = useState('')
  const [tipus, setTipus] = useState<'ingres' | 'despesa'>('despesa')
  const [dataPartida, setDataPartida] = useState(new Date().toISOString().split('T')[0])
  const [descripcio, setDescripcio] = useState('')
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function fetchPartides() {
    try {
      const { data, error } = await supabase
        .from('transparencia_economica')
        .select('*')
        .order('data', { ascending: false })

      if (error) throw error
      if (data) setPartides(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error carregant transparència.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartides()
  }, [])

  async function handleAddPartida(e: React.FormEvent) {
    e.preventDefault()
    if (!concepte || !importVal) return

    setSaving(true)
    setErrorMsg('')
    try {
      // Ingressos són valors positius, despeses valors negatius
      const numericImport = Math.abs(parseFloat(importVal)) * (tipus === 'ingres' ? 1 : -1)

      const { error } = await supabase
        .from('transparencia_economica')
        .insert([
          {
            concepte: concepte.trim(),
            import: numericImport,
            data: dataPartida,
            descripcio: descripcio.trim() || null,
            document_url: null,
            imatge_url: imatgeUrl || null
          }
        ])

      if (error) throw error

      // Reset form i recarregar dades
      setConcepte('')
      setImportVal('')
      setDescripcio('')
      setImatgeUrl(null)
      fetchPartides()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error guardant partida econòmica.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Segur que vols esborrar aquest moviment econòmic?')) return

    try {
      const { error } = await supabase
        .from('transparencia_economica')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPartides()
    } catch (err: any) {
      alert(err.message || 'Error esborrant element.')
    }
  }

  return (
    <div className="space-y-8 text-xs pb-10">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Gestió de Transparència</h1>
        <p className="text-sm text-neutral-500">Registra i gestiona els ingressos i despeses del grup local per a la vista pública.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-xs font-bold text-red-600">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Formulari d'alta */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4 font-sans">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Plus size={18} className="text-primary" />
            Nou moviment econòmic
          </h3>

          <form onSubmit={handleAddPartida} className="space-y-4">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Concepte del moviment *
              </label>
              <input
                type="text"
                value={concepte}
                onChange={(e) => setConcepte(e.target.value)}
                disabled={saving}
                placeholder="Ex: Lloguer de sala acte públic"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Import en € *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={importVal}
                  onChange={(e) => setImportVal(e.target.value)}
                  disabled={saving}
                  placeholder="Ex: 150.00"
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Tipus
                </label>
                <select
                  value={tipus}
                  onChange={(e: any) => setTipus(e.target.value)}
                  disabled={saving}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none bg-white font-bold"
                >
                  <option value="despesa">Despesa</option>
                  <option value="ingres">Ingrés</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Data del moviment *
                </label>
                <input
                  type="date"
                  value={dataPartida}
                  onChange={(e) => setDataPartida(e.target.value)}
                  disabled={saving}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Detalls addicionals (opcional)
              </label>
              <textarea
                rows={2}
                value={descripcio}
                onChange={(e) => setDescripcio(e.target.value)}
                disabled={saving}
                placeholder="Ex: Factura número 12..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors resize-none"
              />
            </div>

            {/* Foto del comprovant/factura o infografia */}
            <FotoUploader
              label="Factura o Comprovant (Foto/Imatge)"
              defaultUrl={imatgeUrl}
              onUploadSuccess={(url) => setImatgeUrl(url)}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-primary text-neutral-950 py-2.5 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              <span>{saving ? 'Guardant...' : 'Afegir moviment'}</span>
            </button>
          </form>
        </div>

        {/* Llistat actual */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm lg:col-span-2">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Balanç Consolidat</h3>
            <span className="text-xs text-neutral-400 font-bold">{partides.length} registres</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-neutral-400">
              <Loader2 className="animate-spin inline-block mr-2" size={16} />
              <span>Carregant comptes...</span>
            </div>
          ) : partides.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">No s'ha registrat cap moviment econòmic.</div>
          ) : (
            <ul className="divide-y divide-neutral-100 font-sans">
              {partides.map((p) => {
                const isDespesa = p.import < 0
                const formattedDate = new Date(p.data).toLocaleDateString('ca', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })

                return (
                  <li key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/40 transition-colors">
                    
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Miniatura si té foto */}
                      {p.imatge_url ? (
                        <div className="h-10 w-10 rounded overflow-hidden border border-neutral-200 shrink-0">
                          <img src={p.imatge_url} alt={p.concepte} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-neutral-50 border border-neutral-200 shrink-0 flex items-center justify-center text-neutral-300">
                          <ImageIcon size={16} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="font-bold text-neutral-900 text-xs sm:text-sm leading-snug truncate">{p.concepte}</h4>
                        <div className="flex items-center gap-2 text-[9px] text-neutral-400 font-medium uppercase mt-0.5">
                          <span>{formattedDate}</span>
                          {p.descripcio && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[200px]" title={p.descripcio}>{p.descripcio}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className={`font-black text-sm ${isDespesa ? 'text-red-600' : 'text-green-600'}`}>
                          {isDespesa ? '-' : '+'}{Math.abs(p.import).toLocaleString('ca', { minimumFractionDigits: 2 })} €
                        </span>
                        <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
                          {isDespesa ? 'Despesa' : 'Ingrés'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-neutral-300 hover:text-red-600 p-1.5 transition-colors"
                        title="Eliminar partida"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
