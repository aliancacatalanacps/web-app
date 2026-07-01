'use client'

import { useState, useEffect } from 'react'
import { Mail, Check, Trash, Loader2, Calendar, Reply } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Contacte } from '@/lib/types'

export default function AdminContactesPage() {
  const [contactes, setContactes] = useState<Contacte[]>([])
  const [loading, setLoading] = useState(true)
  const [missatgeObert, setMissatgeObert] = useState<Contacte | null>(null)
  
  const supabase = createClient()

  async function carregarContactes() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('contactes')
        .select('*')
        .order('llegit', { ascending: true })
        .order('created_at', { ascending: false })

      if (data) setContactes(data)
    } catch (error) {
      console.error('Error carregant contactes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarContactes()
  }, [])

  async function marcarComLlegit(contacte: Contacte) {
    if (contacte.llegit) return
    try {
      const { error } = await supabase
        .from('contactes')
        .update({ llegit: true })
        .eq('id', contacte.id)

      if (error) throw error

      // Actualitzar l'estat local
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

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="font-sans font-black text-2xl text-neutral-900 tracking-tight">Bústia de Missatges</h1>
        <p className="text-xs text-neutral-500 mt-1">Llegeix i respon els missatges enviats a través del formulari públic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Llista de missatges a l'esquerra */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-sans font-bold text-sm text-neutral-400 uppercase tracking-wider mb-2">Entrada</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-10 text-neutral-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Carregant missatges...</span>
            </div>
          ) : contactes.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center text-neutral-400 text-xs shadow-sm">
              La bústia de contacte està buida.
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm divide-y divide-neutral-100 max-h-[70vh] overflow-y-auto">
              {contactes.map((c) => {
                const formattedDate = new Date(c.created_at).toLocaleDateString('ca', {
                  day: 'numeric',
                  month: 'short'
                })

                return (
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
                      <span className={`text-xs truncate font-bold ${!c.llegit ? 'text-neutral-950 font-black' : 'text-neutral-700'}`}>
                        {c.nom}
                      </span>
                      <time className="text-[10px] text-neutral-400 font-semibold whitespace-nowrap">
                        {formattedDate}
                      </time>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-1 leading-snug">
                      {c.missatge}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Detall del missatge seleccionat a la dreta */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-sans font-bold text-sm text-neutral-400 uppercase tracking-wider mb-2">Detalls del missatge</h3>

          {missatgeObert ? (
            <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm space-y-6">
              
              {/* Capçalera del detall */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="font-sans font-bold text-lg text-neutral-950">{missatgeObert.nom}</h2>
                  <a href={`mailto:${missatgeObert.email}`} className="text-xs font-semibold text-primary hover:underline block mt-0.5">
                    {missatgeObert.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-400">
                  <Calendar size={12} />
                  <span>
                    {new Date(missatgeObert.created_at).toLocaleDateString('ca', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Cos del missatge */}
              <div className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 border border-neutral-100 rounded-lg p-4 font-normal whitespace-pre-wrap">
                {missatgeObert.missatge}
              </div>

              {/* Botons d'Acció */}
              <div className="flex justify-between items-center gap-4 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => eliminarContacte(missatgeObert.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-red-100 px-4 py-2.5 text-xs font-bold text-red-600 bg-white hover:bg-red-50"
                >
                  <Trash size={14} />
                  Eliminar
                </button>

                <a
                  href={`mailto:${missatgeObert.email}?subject=Re: Missatge a Aliança Catalana Platja d'Aro`}
                  className="inline-flex items-center justify-center gap-1.5 rounded bg-primary text-white px-5 py-2.5 text-xs font-bold shadow hover:bg-primary-dark"
                >
                  <Reply size={14} />
                  Respondre per correu
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-neutral-400 text-sm shadow-sm">
              Selecciona un missatge de la bústia d'entrada per visualitzar els detalls i respondre.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
