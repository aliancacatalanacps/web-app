'use client'

import { useState, useEffect } from 'react'
import { Mail, Check, Trash, Loader2, Calendar, Reply, Users, HelpCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Contacte } from '@/lib/types'

interface Subscriptor {
  id: string
  email: string
  actiu: boolean
  created_at: string
}

interface Pregunta {
  id: string
  nom: string | null
  email: string | null
  pregunta: string
  resposta: string | null
  respost: boolean
  created_at: string
}

export default function AdminContactesPage() {
  const [activeTab, setActiveTab] = useState<'contactes' | 'subscriptors' | 'preguntes'>('contactes')
  const [loading, setLoading] = useState(true)

  // Dades
  const [contactes, setContactes] = useState<Contacte[]>([])
  const [subscriptors, setSubscriptors] = useState<Subscriptor[]>([])
  const [preguntes, setPreguntes] = useState<Pregunta[]>([])

  const [missatgeObert, setMissatgeObert] = useState<Contacte | null>(null)
  const supabase = createClient()

  async function carregarDades() {
    setLoading(true)
    try {
      // 1. Contactes
      const { data: dataContactes } = await supabase
        .from('contactes')
        .select('*')
        .order('llegit', { ascending: true })
        .order('created_at', { ascending: false })

      if (dataContactes) setContactes(dataContactes)

      // 2. Subscriptors
      const { data: dataSubscriptors } = await supabase
        .from('butlleti_subscriptors')
        .select('*')
        .order('created_at', { ascending: false })

      if (dataSubscriptors) setSubscriptors(dataSubscriptors)

      // 3. Preguntes ciutadanes
      const { data: dataPreguntes } = await supabase
        .from('preguntes_ciutadanes')
        .select('*')
        .order('created_at', { ascending: false })

      if (dataPreguntes) setPreguntes(dataPreguntes)

    } catch (error) {
      console.error('Error carregant base de dades de ciutadans:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDades()
  }, [])

  // ACCIONS CONTACTES
  async function marcarComLlegit(contacte: Contacte) {
    if (contacte.llegit) return
    try {
      const { error } = await supabase
        .from('contactes')
        .update({ llegit: true })
        .eq('id', contacte.id)

      if (error) throw error

      setContactes((prev) =>
        prev.map((c) => (c.id === contacte.id ? { ...c, llegit: true } : c))
      )
      if (missatgeObert?.id === contacte.id) {
        setMissatgeObert((prev) => (prev ? { ...prev, llegit: true } : null))
      }
    } catch (error) {
      console.error('Error marcant com a llegit:', error)
    }
  }

  async function eliminarContacte(id: string) {
    if (!confirm('Segur que vols eliminar aquest missatge de contacte?')) return
    try {
      const { error } = await supabase
        .from('contactes')
        .delete()
        .eq('id', id)

      if (error) throw error

      setContactes((prev) => prev.filter((c) => c.id !== id))
      if (missatgeObert?.id === id) {
        setMissatgeObert(null)
      }
    } catch (error) {
      console.error('Error eliminant contacte:', error)
    }
  }

  function handleObrirMissatge(c: Contacte) {
    setMissatgeObert(c)
    marcarComLlegit(c)
  }

  // ACCIONS SUBSCRIPTORS
  async function eliminarSubscriptor(id: string) {
    if (!confirm('Segur que vols donar de baixa aquest subscriptor?')) return
    try {
      const { error } = await supabase
        .from('butlleti_subscriptors')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSubscriptors((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Error eliminant subscriptor:', error)
    }
  }

  // ACCIONS PREGUNTES
  async function eliminarPregunta(id: string) {
    if (!confirm('Segur que vols eliminar aquesta pregunta de la base de dades?')) return
    try {
      const { error } = await supabase
        .from('preguntes_ciutadanes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPreguntes((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error eliminant pregunta:', error)
    }
  }

  return (
    <div className="space-y-6 pb-10 text-xs">
      {/* Capçalera */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="font-sans font-black text-2xl text-neutral-900 tracking-tight">Base de Dades de Ciutadans</h1>
        <p className="text-sm text-neutral-500 mt-1">Registres centralitzats de totes les persones del municipi que s'han posat en contacte amb el grup local.</p>
      </div>

      {/* Pestanyes de Navegació */}
      <div className="flex border-b border-neutral-200 gap-4">
        <button
          onClick={() => setActiveTab('contactes')}
          className={`pb-3 font-bold uppercase tracking-wider border-b-2 px-1 transition-colors flex items-center gap-1.5 ${
            activeTab === 'contactes'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Mail size={14} />
          Missatges de Contacte
          <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
            {contactes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptors')}
          className={`pb-3 font-bold uppercase tracking-wider border-b-2 px-1 transition-colors flex items-center gap-1.5 ${
            activeTab === 'subscriptors'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Users size={14} />
          Subscriptors Butlletí
          <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
            {subscriptors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('preguntes')}
          className={`pb-3 font-bold uppercase tracking-wider border-b-2 px-1 transition-colors flex items-center gap-1.5 ${
            activeTab === 'preguntes'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <HelpCircle size={14} />
          Gent que pregunta
          <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
            {preguntes.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span>Carregant dades del registre de ciutadans...</span>
        </div>
      ) : (
        <div className="space-y-6">

          {/* A. TAULA DE MISSATGES DE CONTACTE */}
          {activeTab === 'contactes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Llista */}
              <div className="lg:col-span-5 space-y-3">
                {contactes.length === 0 ? (
                  <p className="text-neutral-400 py-6">No s'ha rebut cap missatge de contacte.</p>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm divide-y divide-neutral-100 max-h-[60vh] overflow-y-auto">
                    {contactes.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleObrirMissatge(c)}
                        className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors block border-l-2 outline-none ${
                          missatgeObert?.id === c.id
                            ? 'border-primary bg-primary/5'
                            : !c.llegit
                            ? 'border-amber-500 bg-amber-50/20'
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`truncate font-bold ${!c.llegit ? 'text-neutral-950 font-black' : 'text-neutral-700'}`}>
                            {c.nom}
                          </span>
                          <time className="text-[9px] text-neutral-400 font-semibold whitespace-nowrap">
                            {new Date(c.created_at).toLocaleDateString('ca', { day: 'numeric', month: 'short' })}
                          </time>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-1">{c.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detall */}
              <div className="lg:col-span-7">
                {missatgeObert ? (
                  <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-5">
                    <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm leading-none">{missatgeObert.nom}</h3>
                        <a href={`mailto:${missatgeObert.email}`} className="text-primary hover:underline font-mono text-[10px] block mt-1.5">
                          {missatgeObert.email}
                        </a>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-semibold">
                        {new Date(missatgeObert.created_at).toLocaleDateString('ca', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-lg p-4 font-normal whitespace-pre-wrap leading-relaxed">
                      {missatgeObert.missatge}
                    </div>

                    <div className="flex justify-between items-center gap-4 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => eliminarContacte(missatgeObert.id)}
                        className="inline-flex items-center justify-center gap-1 text-red-600 hover:underline font-bold"
                      >
                        <Trash size={13} />
                        Eliminar missatge
                      </button>

                      <a
                        href={`mailto:${missatgeObert.email}?subject=Re: Missatge a Aliança Catalana`}
                        className="inline-flex items-center justify-center gap-1 rounded bg-primary text-white px-4 py-2 font-bold shadow hover:bg-primary-dark"
                      >
                        <Reply size={13} />
                        Respondre per correu
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-neutral-400 shadow-sm">
                    Selecciona un missatge per veure els detalls de la bústia de contacte.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* B. LLISTAT DE SUBSCRIPTORS AL BUTLLETÍ */}
          {activeTab === 'subscriptors' && (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <h3 className="font-sans font-bold text-neutral-900 text-sm uppercase tracking-wider">Subscriptors Registrats</h3>
                <span className="text-[10px] text-neutral-400 font-bold">Base de mailing activa</span>
              </div>

              {subscriptors.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">No hi ha subscriptors registrats al butlletí.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email del ciutadà</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Data de registre</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Estat</th>
                        <th className="px-6 py-3 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Acció</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-100">
                      {subscriptors.map((s) => (
                        <tr key={s.id} className="hover:bg-neutral-50/20">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-neutral-900 font-mono text-[11px]">
                            {s.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                            {new Date(s.created_at).toLocaleDateString('ca', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                              Actiu
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => eliminarSubscriptor(s.id)}
                              className="text-neutral-300 hover:text-red-600 p-1.5 transition-colors"
                              title="Esborrar subscriptor"
                            >
                              <Trash size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* C. LLISTAT DE PREGUNTES DE LA GENT (GENT QUE PREGUNTA COSES) */}
          {activeTab === 'preguntes' && (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <h3 className="font-sans font-bold text-neutral-900 text-sm uppercase tracking-wider">Consultes i Bústia Ciutadana</h3>
                <span className="text-[10px] text-neutral-400 font-bold">Contactes de Q&A</span>
              </div>

              {preguntes.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">Ningú ha fet cap pregunta encara a través de la bústia.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Correu electrònic</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pregunta</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Estat</th>
                        <th className="px-6 py-3 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Accions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-100">
                      {preguntes.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/20">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-neutral-900">
                            {p.nom || 'Anònim'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-neutral-700">
                            {p.email ? (
                              <a href={`mailto:${p.email}`} className="text-primary hover:underline">
                                {p.email}
                              </a>
                            ) : (
                              <span className="text-neutral-400 italic">No proporcionat</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-neutral-500 max-w-xs truncate" title={p.pregunta}>
                            {p.pregunta}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {p.respost ? (
                              <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 w-fit">
                                <CheckCircle2 size={10} />
                                Respost
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-black uppercase px-2 py-0.5 rounded-full w-fit">
                                Pendent
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            {p.email && (
                              <a
                                href={`mailto:${p.email}?subject=Re: La teva pregunta al regidor d'Aliança Catalana`}
                                className="inline-flex items-center justify-center p-1.5 rounded-full border border-neutral-200 text-neutral-400 hover:text-primary hover:border-primary bg-white shadow-sm"
                                title="Respondre ciutadà"
                              >
                                <Reply size={13} />
                              </a>
                            )}
                            <button
                              onClick={() => eliminarPregunta(p.id)}
                              className="inline-flex items-center justify-center p-1.5 rounded-full border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 bg-white shadow-sm"
                              title="Eliminar pregunta"
                            >
                              <Trash size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
