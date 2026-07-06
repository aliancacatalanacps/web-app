'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DadesMunicipi } from '@/lib/types'
import { Plus, Trash2, TrendingUp, Calendar, Landmark, Image as ImageIcon } from 'lucide-react'
import FotoUploader from '@/components/admin/FotoUploader'

export default function AdminDadesPage() {
  const [indicadors, setIndicadors] = useState<DadesMunicipi[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Estats del formulari
  const [nomIndicador, setNomIndicador] = useState('')
  const [valor, setValor] = useState('')
  const [unitat, setUnitat] = useState('')
  const [font, setFont] = useState('')
  const [dataActualitzacio, setDataActualitzacio] = useState(new Date().toISOString().split('T')[0])
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function fetchIndicadors() {
    try {
      const { data, error } = await supabase
        .from('dades_municipi')
        .select('*')
        .order('data_actualitzacio', { ascending: false })

      if (error) throw error
      if (data) setIndicadors(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error carregant indicadors municipals.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndicadors()
  }, [])

  async function handleAddIndicador(e: React.FormEvent) {
    e.preventDefault()
    if (!nomIndicador || !valor || !font) return

    setSaving(true)
    setErrorMsg('')
    try {
      const { error } = await supabase
        .from('dades_municipi')
        .insert([
          {
            nom_indicador: nomIndicador.trim(),
            valor: valor.trim(),
            unitat: unitat.trim() || null,
            font: font.trim(),
            data_actualitzacio: dataActualitzacio,
            imatge_url: imatgeUrl || null
          }
        ])

      if (error) throw error

      // Reset form
      setNomIndicador('')
      setValor('')
      setUnitat('')
      setFont('')
      setImatgeUrl(null)
      fetchIndicadors()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error guardant indicador.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Segur que vols esborrar aquest indicador municipal?')) return

    try {
      const { error } = await supabase
        .from('dades_municipi')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchIndicadors()
    } catch (err: any) {
      alert(err.message || 'Error esborrant element.')
    }
  }

  return (
    <div className="space-y-8 text-xs pb-10">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Dades Municipals</h1>
        <p className="text-sm text-neutral-500">Administra els indicadors oberts del municipi de Platja d'Aro visibles per als veïns.</p>
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
            Nou indicador municipal
          </h3>

          <form onSubmit={handleAddIndicador} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Nom de l'Indicador *
              </label>
              <input
                type="text"
                value={nomIndicador}
                onChange={(e) => setNomIndicador(e.target.value)}
                disabled={saving}
                placeholder="Ex: Pressupost Municipal"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Valor *
                </label>
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  disabled={saving}
                  placeholder="Ex: 38.200.000 o 9,5"
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Unitat <span className="text-[10px] text-neutral-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={unitat}
                  onChange={(e) => setUnitat(e.target.value)}
                  disabled={saving}
                  placeholder="Ex: € o %"
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Font d'Informació Oficial *
              </label>
              <input
                type="text"
                value={font}
                onChange={(e) => setFont(e.target.value)}
                disabled={saving}
                placeholder="Ex: Ajuntament de Castell-Platja d'Aro (2026)"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Data d'actualització *
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

            {/* Pujador d'imatges addicional */}
            <FotoUploader
              label="Foto / Infografia de l'indicador (opcional)"
              defaultUrl={imatgeUrl}
              onUploadSuccess={(url) => setImatgeUrl(url)}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-primary text-neutral-950 py-2.5 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              <span>{saving ? 'Guardant...' : 'Afegir indicador'}</span>
            </button>
          </form>
        </div>

        {/* Llistat actual */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm lg:col-span-2">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Indicadors Actius</h3>
            <span className="text-xs text-neutral-400 font-bold">{indicadors.length} indicadors</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-neutral-400 text-xs">Carregant...</div>
          ) : indicadors.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-xs">No hi ha indicadors registrats.</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {indicadors.map((ind) => (
                <li key={ind.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Miniatura si té imatge */}
                    {ind.imatge_url ? (
                      <div className="h-10 w-10 rounded overflow-hidden border border-neutral-200 shrink-0">
                        <img src={ind.imatge_url} alt={ind.nom_indicador} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded bg-neutral-50 border border-neutral-200 shrink-0 flex items-center justify-center text-neutral-300">
                        <ImageIcon size={16} />
                      </div>
                    )}

                    <div className="space-y-0.5 min-w-0 truncate">
                      <h4 className="font-bold text-neutral-900 truncate">{ind.nom_indicador}</h4>
                      <div className="text-[10px] text-neutral-400 font-medium">
                        Font: <span className="text-neutral-500 font-semibold">{ind.font}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="font-black text-sm text-neutral-900">{ind.valor}</span>
                      {ind.unitat && <span className="font-bold text-[10px] text-neutral-400 ml-0.5">{ind.unitat}</span>}
                      <span className="block text-[8px] text-neutral-400 font-semibold uppercase">{ind.data_actualitzacio}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(ind.id)}
                      className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors"
                      aria-label="Eliminar indicador"
                    >
                      <Trash2 size={14} />
                    </button>
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
