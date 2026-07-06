'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Compromis } from '@/lib/types'
import { Plus, Trash2, Target, CheckCircle2, Play, Circle, XCircle } from 'lucide-react'

export default function AdminCompromisosPage() {
  const [compromisos, setCompromisos] = useState<Compromis[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Estats del formulari
  const [titol, setTitol] = useState('')
  const [descripcio, setDescripcio] = useState('')
  const [estat, setEstat] = useState<'pendent' | 'en_curs' | 'complert' | 'rebutjat'>('pendent')
  const [dataActualitzacio, setDataActualitzacio] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function fetchCompromisos() {
    try {
      const { data, error } = await supabase
        .from('compromisos')
        .select('*')
        .order('titol', { ascending: true })

      if (error) throw error
      if (data) setCompromisos(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error carregant compromisos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompromisos()
  }, [])

  async function handleAddCompromis(e: React.FormEvent) {
    e.preventDefault()
    if (!titol) return

    setSaving(true)
    setErrorMsg('')
    try {
      const { error } = await supabase
        .from('compromisos')
        .insert([
          {
            titol: titol.trim(),
            descripcio: descripcio.trim() || null,
            estat,
            data_actualitzacio: dataActualitzacio
          }
        ])

      if (error) throw error

      // Reset form
      setTitol('')
      setDescripcio('')
      setEstat('pendent')
      fetchCompromisos()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error guardant compromís.')
    } finally {
      setSaving(false)
    }
  }

  async function handleEstatChange(id: string, nouEstat: any) {
    try {
      const { error } = await supabase
        .from('compromisos')
        .update({
          estat: nouEstat,
          data_actualitzacio: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)

      if (error) throw error
      fetchCompromisos()
    } catch (err: any) {
      alert(err.message || 'Error actualitzant estat.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Segur que vols eliminar aquest compromís?')) return

    try {
      const { error } = await supabase
        .from('compromisos')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCompromisos()
    } catch (err: any) {
      alert(err.message || 'Error eliminant compromís.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Seguiment de Compromisos</h1>
        <p className="text-sm text-neutral-500">Registra i gestiona l'estat d'assoliment del programa municipal i les propostes locals.</p>
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
            Nou compromís / Proposta
          </h3>

          <form onSubmit={handleAddCompromis} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Títol del compromís *
              </label>
              <input
                type="text"
                value={titol}
                onChange={(e) => setTitol(e.target.value)}
                disabled={saving}
                placeholder="Ex: Ampliació efectius Policia Local"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Estat inicial *
              </label>
              <select
                value={estat}
                onChange={(e) => setEstat(e.target.value as any)}
                disabled={saving}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors font-semibold"
              >
                <option value="pendent">Pendent</option>
                <option value="en_curs">En curs / En marxa</option>
                <option value="complert">Complert / Assolit</option>
                <option value="rebutjat">Rebutjat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Data de l'estat *
              </label>
              <input
                type="date"
                value={dataActualitzacio}
                onChange={(e) => setDataActualitzacio(e.target.value)}
                disabled={saving}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Descripció i context del compromís
              </label>
              <textarea
                rows={4}
                value={descripcio}
                onChange={(e) => setDescripcio(e.target.value)}
                disabled={saving}
                placeholder="Detalla de quina proposta es tracta, motius o explicació..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors resize-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-primary text-white py-2.5 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              <span>{saving ? 'Guardant...' : 'Afegir compromís'}</span>
            </button>
          </form>
        </div>

        {/* Llistat actual */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm lg:col-span-2 text-xs">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Compromisos Registrats</h3>
            <span className="text-xs text-neutral-400 font-bold">{compromisos.length} propostes</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-neutral-400">Carregant compromisos...</div>
          ) : compromisos.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">No hi ha compromisos definits.</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {compromisos.map((c) => (
                <li key={c.id} className="p-5 space-y-4 hover:bg-neutral-50/20 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                        <Target size={16} className="text-neutral-400" />
                        {c.titol}
                      </h4>
                      {c.descripcio && <p className="text-neutral-500 max-w-xl leading-normal">{c.descripcio}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <select
                        value={c.estat}
                        onChange={(e) => handleEstatChange(c.id, e.target.value)}
                        className={`rounded border px-2 py-1 font-bold text-[10px] uppercase outline-none focus:border-primary bg-white ${
                          c.estat === 'complert'
                            ? 'text-green-700 border-green-200 bg-green-50'
                            : c.estat === 'en_curs'
                            ? 'text-blue-700 border-blue-200 bg-blue-50'
                            : c.estat === 'rebutjat'
                            ? 'text-red-700 border-red-200 bg-red-50'
                            : 'text-neutral-700 border-neutral-200 bg-neutral-50'
                        }`}
                      >
                        <option value="pendent">Pendent</option>
                        <option value="en_curs">En curs</option>
                        <option value="complert">Complert</option>
                        <option value="rebutjat">Rebutjat</option>
                      </select>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-neutral-300 hover:text-red-600 p-1.5 transition-colors"
                        aria-label="Eliminar compromís"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
