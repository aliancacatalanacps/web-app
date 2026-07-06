'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TransparenciaEconomica } from '@/lib/types'
import { Landmark, Plus, Trash2, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'

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
            document_url: null
          }
        ])

      if (error) throw error

      // Reset form i recarregar dades
      setConcepte('')
      setImportVal('')
      setDescripcio('')
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
    <div className="space-y-8">
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
        <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-neutral-900 text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Plus size={18} className="text-primary" />
            Nou moviment econòmic
          </h3>

          <form onSubmit={handleAddPartida} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Concepte *
              </label>
              <input
                type="text"
                value={concepte}
                onChange={(e) => setConcepte(e.target.value)}
                disabled={saving}
                placeholder="Ex: Subvenció municipal Q2"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Tipus *
                </label>
                <div className="flex rounded border border-neutral-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTipus('ingres')}
                    className={`flex-1 py-2 font-bold text-center ${
                      tipus === 'ingres' ? 'bg-green-600 text-white' : 'bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    Ingrés
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipus('despesa')}
                    className={`flex-1 py-2 font-bold text-center ${
                      tipus === 'despesa' ? 'bg-red-700 text-white' : 'bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    Despesa
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Import (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={importVal}
                  onChange={(e) => setImportVal(e.target.value)}
                  disabled={saving}
                  placeholder="0.00"
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Data de registre *
                </label>
                <input
                  type="date"
                  value={dataPartida}
                  onChange={(e) => setDataPartida(e.target.value)}
                  disabled={saving}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Descripció addicional
              </label>
              <textarea
                rows={3}
                value={descripcio}
                onChange={(e) => setDescripcio(e.target.value)}
                disabled={saving}
                placeholder="Detall opcional per a la transparència..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-primary text-white py-2.5 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{saving ? 'Guardant...' : 'Afegir moviment'}</span>
            </button>
          </form>
        </div>

        {/* Llistat actual */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm lg:col-span-2">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Historial de moviments</h3>
            <span className="text-xs text-neutral-400 font-bold">{partides.length} partides</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-neutral-400 text-xs">Carregant...</div>
          ) : partides.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-xs">No hi ha moviments registrats.</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {partides.map((p) => {
                const isIngres = p.import > 0
                return (
                  <li key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                          isIngres ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isIngres ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
                          {isIngres ? 'Ingrés' : 'Despesa'}
                        </span>
                        <time className="text-[9px] text-neutral-400 font-semibold">{p.data}</time>
                      </div>
                      <h4 className="font-bold text-neutral-900 text-xs">{p.concepte}</h4>
                      {p.descripcio && <p className="text-[10px] text-neutral-400 leading-normal">{p.descripcio}</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`font-bold text-xs ${isIngres ? 'text-green-600' : 'text-neutral-900'}`}>
                        {isIngres ? '+' : '-'}{Math.abs(p.import).toFixed(2)} €
                      </span>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors"
                        aria-label="Eliminar moviment"
                      >
                        <Trash2 size={14} />
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
