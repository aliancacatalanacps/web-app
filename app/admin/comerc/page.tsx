'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ComercLocal } from '@/lib/types'
import { Store, Check, Trash2, Clock, MapPin, Phone, Globe } from 'lucide-react'

export default function AdminComercPage() {
  const [comercos, setComercos] = useState<ComercLocal[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

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
    if (!confirm('Segur que vols eliminar/rebutjar aquest negoci?')) return

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
    <div className="space-y-8">
      {/* Capçalera */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Comerç i Autònoms Locals</h1>
        <p className="text-sm text-neutral-500">Valida, aprova i modera les sol·licituds ciutadanes del directori comercial municipal.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-xs font-bold text-red-600">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-neutral-400 text-xs">Carregant llista de comerços...</div>
      ) : (
        <div className="space-y-10 text-xs">
          
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
              <p className="text-xs text-neutral-400 py-2">No hi ha sol·licituds de comerç pendents de moderació.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendents.map((c) => (
                  <div key={c.id} className="bg-white border border-yellow-200 rounded-lg p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-sans font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                          <Store size={16} className="text-neutral-400" />
                          {c.nom}
                        </h4>
                        <span className="bg-yellow-100 text-yellow-800 text-[8px] font-black uppercase tracking-wider rounded px-1.5 py-0.5">
                          {c.categoria}
                        </span>
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
                            <span className="text-primary hover:underline font-mono text-[10px]">{c.web}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-neutral-100 justify-end">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="rounded border border-neutral-200 text-neutral-600 px-3 py-1.5 text-xs font-bold hover:bg-neutral-50 flex items-center gap-1"
                      >
                        Rebutjar
                      </button>
                      <button
                        onClick={() => handleApprove(c.id)}
                        className="rounded bg-green-600 text-white px-4.5 py-1.5 text-xs font-bold hover:bg-green-700 flex items-center gap-1 shadow"
                      >
                        <Check size={14} />
                        Aprovar negoci
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
              <p className="text-xs text-neutral-400 py-2">Encara no s'ha aprovat cap negoci al directori.</p>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                <ul className="divide-y divide-neutral-100">
                  {aprovats.map((c) => (
                    <li key={c.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50/20 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                            <Store size={14} className="text-neutral-400" />
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

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-neutral-300 hover:text-red-600 p-1.5 transition-colors self-end sm:self-center"
                        aria-label="Eliminar comerç"
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
