'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ComercLocal } from '@/lib/types'
import { Store, Check, Trash2, Clock, MapPin, Phone, Globe, Plus, Loader2, Image as ImageIcon } from 'lucide-react'
import FotoUploader from '@/components/admin/FotoUploader'

export default function AdminComercPage() {
  const [comercos, setComercos] = useState<ComercLocal[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Estats del formulari per afegir comerç
  const [nom, setNom] = useState('')
  const [categoria, setCategoria] = useState('')
  const [adreca, setAdreca] = useState('')
  const [telefon, setTelefon] = useState('')
  const [web, setWeb] = useState('')
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)

  const supabase = createClient()

  async function fetchComercos() {
    try {
      const { data, error } = await supabase
        .from('comerc_local')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setComercos(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error carregant comerços.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComercos()
  }, [])

  async function handleAddComerc(e: React.FormEvent) {
    e.preventDefault()
    if (!nom || !categoria) {
      alert('El nom i la categoria són camps obligatoris.')
      return
    }

    setSaving(true)
    setErrorMsg('')
    try {
      const { error } = await supabase
        .from('comerc_local')
        .insert([
          {
            nom: nom.trim(),
            categoria: categoria.trim(),
            adreca: adreca.trim() || null,
            telefon: telefon.trim() || null,
            web: web.trim() || null,
            aprovat: true, // Un comerç afegit directament per l'admin s'aprova a l'instant
            imatge_url: imatgeUrl || null
          }
        ])

      if (error) throw error

      // Reset dels camps
      setNom('')
      setCategoria('')
      setAdreca('')
      setTelefon('')
      setWeb('')
      setImatgeUrl(null)
      setMostrarForm(false)
      fetchComercos()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error desant el comerç local.')
    } finally {
      setSaving(false)
    }
  }

  async function handleApprove(id: string) {
    try {
      const { error } = await supabase
        .from('comerc_local')
        .update({ aprovat: true })
        .eq('id', id)

      if (error) throw error
      fetchComercos()
    } catch (err: any) {
      alert(err.message || 'Error aprovant el negoci.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Segur que vols eliminar aquest negoci del directori?')) return

    try {
      const { error } = await supabase
        .from('comerc_local')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchComercos()
    } catch (err: any) {
      alert(err.message || 'Error eliminant negoci.')
    }
  }

  // Separem per estat
  const pendents = comercos.filter(c => !c.aprovat)
  const aprovats = comercos.filter(c => c.aprovat)

  return (
    <div className="space-y-8 text-xs pb-10">
      
      {/* Capçalera */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Comerç i Autònoms Locals</h1>
          <p className="text-sm text-neutral-500 mt-1">Gestiona els comerços, restaurants i autònoms locals en el directori municipal.</p>
        </div>
        
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="inline-flex items-center gap-1.5 rounded bg-primary text-neutral-950 px-4 py-2.5 font-bold shadow hover:bg-primary-dark transition-all"
        >
          <Plus size={14} />
          {mostrarForm ? 'Tancar formulari' : 'Afegir Comerç'}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded p-4 font-bold text-red-600">
          {errorMsg}
        </div>
      )}

      {/* Formular d'inserció manual de l'admin */}
      {mostrarForm && (
        <form onSubmit={handleAddComerc} className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4 max-w-2xl font-sans">
          <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            Afegir Nou Negoci (Directe)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Nom del Comerç
              </label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="Ex. Restaurant La Plaça"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Categoria
              </label>
              <input
                type="text"
                required
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="Ex. Restauració, Moda, Alimentació..."
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Adreça física
              </label>
              <input
                type="text"
                value={adreca}
                onChange={(e) => setAdreca(e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="Ex. Avinguda de S'Agaró, 120"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Telèfon de contacte
              </label>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none"
                placeholder="Ex. 972 81 80 00"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Pàgina Web / Xarxes Socials (URL)
            </label>
            <input
              type="url"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:border-primary outline-none font-mono"
              placeholder="Ex. https://restaurantlaplaca.com"
            />
          </div>

          {/* Pujada d'imatge de la botiga */}
          <FotoUploader
            label="Foto de la façana o local del comerç (opcional)"
            defaultUrl={imatgeUrl}
            onUploadSuccess={(url) => setImatgeUrl(url)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMostrarForm(false)}
              className="rounded border border-neutral-200 text-neutral-600 px-4 py-2 font-bold hover:bg-neutral-50"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-primary text-neutral-950 px-5 py-2 font-bold shadow hover:bg-primary-dark transition-colors flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={13} />
                  Desant negoci...
                </>
              ) : (
                'Desar i publicar'
              )}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span>Carregant directori comercial...</span>
        </div>
      ) : (
        <div className="space-y-10 font-sans">
          
          {/* 1. COMERÇOS PENDENTS (Moderació) */}
          <div className="space-y-4">
            <h3 className="font-sans font-black text-base text-neutral-900 tracking-tight flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Clock className="text-yellow-600 shrink-0" size={18} />
              Sol·licituds Pendents d'Aprovació
              <span className="text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-0.5 ml-1">
                {pendents.length}
              </span>
            </h3>

            {pendents.length === 0 ? (
              <p className="text-neutral-400 py-2">No hi ha sol·licituds de comerç pendents de moderació.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendents.map((c) => (
                  <div key={c.id} className="bg-white border border-yellow-200 rounded-lg p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {/* Imatge preview */}
                        {c.imatge_url ? (
                          <div className="h-10 w-10 rounded overflow-hidden border border-neutral-200 shrink-0">
                            <img src={c.imatge_url} alt={c.nom} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-neutral-50 border border-neutral-200 shrink-0 flex items-center justify-center text-neutral-300">
                            <ImageIcon size={16} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="font-bold text-neutral-900 text-xs sm:text-sm leading-none truncate">
                            {c.nom}
                          </h4>
                          <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 text-[8px] font-black uppercase tracking-wider rounded px-1.5 py-0.5 mt-1">
                            {c.categoria}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-neutral-500 font-medium leading-relaxed">
                        {c.adreca && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-neutral-400" />
                            <span>{c.adreca}</span>
                          </div>
                        )}
                        {c.telefon && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-neutral-400" />
                            <span>{c.telefon}</span>
                          </div>
                        )}
                        {c.web && (
                          <div className="flex items-center gap-1.5">
                            <Globe size={12} className="text-neutral-400" />
                            <span className="text-primary hover:underline font-mono text-[10px] truncate max-w-[200px]">{c.web}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-neutral-100 justify-end">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="rounded border border-red-100 text-red-600 px-3 py-1.5 font-bold hover:bg-red-50 flex items-center gap-1"
                      >
                        Rebutjar / Eliminar
                      </button>
                      <button
                        onClick={() => handleApprove(c.id)}
                        className="rounded bg-green-600 text-white px-4 py-1.5 font-bold hover:bg-green-700 flex items-center gap-1 shadow"
                      >
                        <Check size={14} />
                        Aprovar i Publicar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. COMERÇOS APROVATS (Actius al directori) */}
          <div className="space-y-4">
            <h3 className="font-sans font-black text-base text-neutral-900 tracking-tight flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Store className="text-primary shrink-0" size={18} />
              Comerços Aprovats i Actius
              <span className="text-xs font-bold text-primary bg-primary/5 border border-primary/10 rounded-full px-2.5 py-0.5 ml-1">
                {aprovats.length}
              </span>
            </h3>

            {aprovats.length === 0 ? (
              <p className="text-neutral-400 py-2">Encara no s'ha aprovat cap negoci al directori.</p>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                <ul className="divide-y divide-neutral-100">
                  {aprovats.map((c) => (
                    <li key={c.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50/20 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Miniatura si té foto */}
                        {c.imatge_url ? (
                          <div className="h-10 w-10 rounded overflow-hidden border border-neutral-200 shrink-0">
                            <img src={c.imatge_url} alt={c.nom} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-neutral-50 border border-neutral-200 shrink-0 flex items-center justify-center text-neutral-300">
                            <ImageIcon size={16} />
                          </div>
                        )}

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1 leading-none">
                              {c.nom}
                            </h4>
                            <span className="text-[8px] font-black text-neutral-400 bg-neutral-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
                              {c.categoria}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-neutral-400 font-medium">
                            {c.adreca && (
                              <span className="flex items-center gap-1">
                                <MapPin size={10} />
                                {c.adreca}
                              </span>
                            )}
                            {c.telefon && (
                              <span className="flex items-center gap-1">
                                <Phone size={10} />
                                {c.telefon}
                              </span>
                            )}
                            {c.web && (
                              <a href={c.web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline font-mono">
                                <Globe size={10} />
                                {c.web}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-neutral-300 hover:text-red-600 p-1.5 transition-colors self-end sm:self-center"
                        aria-label="Eliminar comerç"
                        title="Eliminar negoci de forma directa"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
