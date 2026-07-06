'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Compromis } from '@/lib/types'
import { Plus, Trash2, Target, CheckCircle2, Play, Circle, XCircle, Image as ImageIcon, Loader2 } from 'lucide-react'
import FotoUploader from '@/components/admin/FotoUploader'

export default function AdminCompromisosPage() {
  const [compromisos, setCompromisos] = useState<Compromis[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Estats del formulari
  const [titol, setTitol] = useState('')
  const [descripcio, setDescripcio] = useState('')
  const [estat, setEstat] = useState<'pendent' | 'en_curs' | 'complert' | 'rebutjat'>('pendent')
  const [dataActualitzacio, setDataActualitzacio] = useState(new Date().toISOString().split('T')[0])
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null)
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
            data_actualitzacio: dataActualitzacio,
            imatge_url: imatgeUrl || null
          }
        ])

      if (error) throw error

      // Reset form
      setTitol('')
      setDescripcio('')
      setEstat('pendent')
      setImatgeUrl(null)
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
      alert(err.message || 'Error eliminant element.')
    }
  }

  return (
    <div className="space-y-8 text-xs pb-10">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Seguiment de Compromisos</h1>
        <p className="text-sm text-neutral-500">Administra el nivell de compliment del nostre programa electoral municipal.</p>
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
            Nou compromís electoral
          </h3>

          <form onSubmit={handleAddCompromis} className="space-y-4">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Títol del compromís *
              </label>
              <input
                type="text"
                value={titol}
                onChange={(e) => setTitol(e.target.value)}
                disabled={saving}
                placeholder="Ex: Reclamar seguretat integral"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Descripció i Context
              </label>
              <textarea
                rows={3}
                value={descripcio}
                onChange={(e) => setDescripcio(e.target.value)}
                disabled={saving}
                placeholder="Explicació de la proposta o estat actual..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Estat inicial
                </label>
                <select
                  value={estat}
                  onChange={(e: any) => setEstat(e.target.value)}
                  disabled={saving}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none bg-white"
                >
                  <option value="pendent">Pendent</option>
                  <option value="en_curs">En curs</option>
                  <option value="complert">Complert</option>
                  <option value="rebutjat">Rebutjat pel Ple</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Data d'estat *
                </label>
                <input
                  type="date"
                  value={dataActualitzacio}
                  onChange={(e) => setDataActualitzacio(e.target.value)}
                  disabled={saving}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none bg-white"
                  required
                />
              </div>
            </div>

            {/* Foto del compromís o infografia */}
            <FotoUploader
              label="Foto o Infografia del compromís (opcional)"
              defaultUrl={imatgeUrl}
              onUploadSuccess={(url) => setImatgeUrl(url)}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-primary text-neutral-950 py-2.5 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              <span>{saving ? 'Guardant...' : 'Afegir compromís'}</span>
            </button>
          </form>
        </div>

        {/* Llistat actual */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm lg:col-span-2">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Compromisos del Programa</h3>
            <span className="text-xs text-neutral-400 font-bold">{compromisos.length} compromisos</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-neutral-400">
              <Loader2 className="animate-spin inline-block mr-2" size={16} />
              <span>Carregant llista...</span>
            </div>
          ) : compromisos.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">No hi ha compromisos electorals definits.</div>
          ) : (
            <ul className="divide-y divide-neutral-100 font-sans">
              {compromisos.map((c) => {
                return (
                  <li key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50/40 transition-colors">
                    
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Miniatura si té foto */}
                      {c.imatge_url ? (
                        <div className="h-10 w-10 rounded overflow-hidden border border-neutral-200 shrink-0">
                          <img src={c.imatge_url} alt={c.titol} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-neutral-50 border border-neutral-200 shrink-0 flex items-center justify-center text-neutral-300">
                          <ImageIcon size={16} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="font-bold text-neutral-900 text-xs sm:text-sm leading-snug truncate">{c.titol}</h4>
                        {c.descripcio && <p className="text-neutral-400 text-[10px] mt-0.5 line-clamp-1">{c.descripcio}</p>}
                        <span className="inline-block text-[8px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                          Actualitzat el {new Date(c.data_actualitzacio).toLocaleDateString('ca', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0 self-end sm:self-center">
                      {/* Selectors de canvi d'estat ràpids per a l'admin */}
                      <select
                        value={c.estat}
                        onChange={(e) => handleEstatChange(c.id, e.target.value)}
                        className={`text-[9px] font-black uppercase tracking-wider rounded px-2.5 py-1.5 border outline-none bg-white cursor-pointer ${
                          c.estat === 'complert'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : c.estat === 'en_curs'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : c.estat === 'rebutjat'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-500'
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
                        title="Eliminar compromís"
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
