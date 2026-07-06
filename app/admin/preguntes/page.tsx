'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PreguntaCiutadana } from '@/lib/types'
import { MessageSquare, HelpCircle, User, CheckCircle, AlertTriangle, Send, Trash2 } from 'lucide-react'

export default function AdminPreguntesPage() {
  const [preguntes, setPreguntes] = useState<PreguntaCiutadana[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Resposta temporal en escriure
  const [respostesEdit, setRespostesEdit] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const supabase = createClient()

  async function fetchPreguntes() {
    try {
      const { data, error } = await supabase
        .from('preguntes_ciutadanes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        setPreguntes(data)
        // Inicialitzem els camps d'edició amb respostes existents si n'hi ha
        const initialEdits: Record<string, string> = {}
        data.forEach((p) => {
          initialEdits[p.id] = p.resposta || ''
        })
        setRespostesEdit(initialEdits)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error carregant preguntes ciutadanes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreguntes()
  }, [])

  async function handleAnswerSubmit(id: string) {
    const respostaText = respostesEdit[id]
    if (!respostaText || respostaText.trim().length < 5) {
      alert('Escriu una resposta vàlida d\'almenys 5 caràcters.')
      return
    }

    setSavingId(id)
    try {
      const { error } = await supabase
        .from('preguntes_ciutadanes')
        .update({
          resposta: respostaText.trim(),
          respost: true,
          publicat: true // Es publica per defecte en respondre
        })
        .eq('id', id)

      if (error) throw error
      fetchPreguntes()
    } catch (err: any) {
      alert(err.message || 'Error desant resposta.')
    } finally {
      setSavingId(null)
    }
  }

  async function handleTogglePublicat(id: string, currentPublicat: boolean) {
    try {
      const { error } = await supabase
        .from('preguntes_ciutadanes')
        .update({ publicat: !currentPublicat })
        .eq('id', id)

      if (error) throw error
      fetchPreguntes()
    } catch (err: any) {
      alert(err.message || 'Error canviant estat de publicació.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Segur que vols eliminar aquesta pregunta?')) return

    try {
      const { error } = await supabase
        .from('preguntes_ciutadanes')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPreguntes()
    } catch (err: any) {
      alert(err.message || 'Error eliminant element.')
    }
  }

  // Separem preguntes
  const pendents = preguntes.filter((p) => !p.respost)
  const contestades = preguntes.filter((p) => p.respost)

  return (
    <div className="space-y-8">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Pregunta al Regidor</h1>
        <p className="text-sm text-neutral-500">Gestiona, respon i publica les consultes ciutadanes rebudes des de la web municipal.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-xs font-bold text-red-600">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-neutral-400 text-xs">Carregant preguntes ciutadanes...</div>
      ) : (
        <div className="space-y-10">
          
          {/* 1. PREGUNTES PENDENTS */}
          <div className="space-y-4">
            <h3 className="font-sans font-black text-base text-neutral-900 tracking-tight flex items-center gap-2 border-b border-neutral-100 pb-2">
              <span className="h-4 w-1 bg-red-600 inline-block rounded"></span>
              Consultes Pendents de Resposta
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5 ml-1">
                {pendents.length}
              </span>
            </h3>

            {pendents.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4">No hi ha preguntes pendents de respondre actualment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendents.map((p) => (
                  <div key={p.id} className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4 relative">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="space-y-1">
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">
                        Rebuda de: <span className="text-neutral-500 font-semibold">{p.nom || 'Veí anònim'}</span>
                      </div>
                      <p className="font-bold text-neutral-900 text-xs leading-relaxed flex gap-1.5">
                        <HelpCircle size={16} className="text-primary shrink-0 mt-0.5" />
                        {p.pregunta}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 space-y-3">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        Redacta la resposta d'Aitor Tendero
                      </label>
                      <textarea
                        rows={3}
                        value={respostesEdit[p.id] || ''}
                        onChange={(e) => setRespostesEdit({ ...respostesEdit, [p.id]: e.target.value })}
                        disabled={savingId === p.id}
                        placeholder="Escriu la resposta oficial del regidor local aquí..."
                        className="w-full rounded border border-neutral-200 p-3 text-xs text-neutral-900 bg-neutral-50/50 focus:bg-white transition-colors outline-none focus:border-primary resize-none leading-relaxed"
                      ></textarea>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAnswerSubmit(p.id)}
                          disabled={savingId === p.id}
                          className="rounded bg-primary text-white px-4 py-2 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center gap-1.5"
                        >
                          <Send size={12} />
                          <span>{savingId === p.id ? 'Desant...' : 'Respondre i Publicar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. PREGUNTES CONTESTADES / HISTORIAL */}
          <div className="space-y-4">
            <h3 className="font-sans font-black text-base text-neutral-900 tracking-tight flex items-center gap-2 border-b border-neutral-100 pb-2">
              <span className="h-4 w-1 bg-green-600 inline-block rounded"></span>
              Historial de Preguntes Contestades
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 ml-1">
                {contestades.length}
              </span>
            </h3>

            {contestades.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4">No s'ha contestat cap pregunta encara.</p>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                <ul className="divide-y divide-neutral-100">
                  {contestades.map((p) => (
                    <li key={p.id} className="p-5 space-y-4 hover:bg-neutral-50/20 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] text-neutral-400 font-bold uppercase">
                            Preguntat per: <span className="text-neutral-500 font-semibold">{p.nom || 'Veí anònim'}</span>
                          </div>
                          <p className="font-bold text-neutral-900 text-xs flex gap-1.5">
                            <HelpCircle size={15} className="text-primary shrink-0 mt-0.5" />
                            {p.pregunta}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleTogglePublicat(p.id, p.publicat)}
                            className={`rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                              p.publicat
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            }`}
                          >
                            {p.publicat ? 'Públic' : 'Ocult'}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-neutral-300 hover:text-red-600 p-1 transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Resposta formulada */}
                      <div className="bg-neutral-50 border border-neutral-100 rounded p-4 text-xs space-y-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded bg-primary text-white font-extrabold text-[8px] flex items-center justify-center border border-primary-dark">
                            AT
                          </div>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Resposta d'Aitor Tendero</span>
                        </div>
                        
                        <p className="text-neutral-700 leading-relaxed font-medium">
                          {p.resposta}
                        </p>
                      </div>
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
