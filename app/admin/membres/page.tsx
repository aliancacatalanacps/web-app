'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Shield, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MembreForm from '@/components/admin/MembreForm'
import { Membre } from '@/lib/types'

export default function AdminMembresPage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [membreSeleccionat, setMembreSeleccionat] = useState<Membre | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  
  const supabase = createClient()

  async function carregarMembres() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('membres')
        .select('*')
        .order('ordre', { ascending: true })

      if (data) setMembres(data)
    } catch (error) {
      console.error('Error carregant membres:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarMembres()
  }, [])

  function handleEdit(membre: Membre) {
    setMembreSeleccionat(membre)
    setMostrarForm(true)
  }

  function handleNou() {
    setMembreSeleccionat(null)
    setMostrarForm(true)
  }

  function handleSaved() {
    setMostrarForm(false)
    setMembreSeleccionat(null)
    carregarMembres()
  }

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="font-sans font-black text-2xl text-neutral-900 tracking-tight">Equip Municipal</h1>
          <p className="text-xs text-neutral-500 mt-1">Gestiona els membres de l'agrupació política local.</p>
        </div>
        {!mostrarForm && (
          <button
            onClick={handleNou}
            className="inline-flex items-center gap-1.5 rounded bg-primary text-white px-4 py-2.5 text-xs font-bold shadow hover:bg-primary-dark"
          >
            <Plus size={14} />
            Afegir membre
          </button>
        )}
      </div>

      {mostrarForm ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
          <h3 className="font-sans font-bold text-lg text-neutral-900 mb-6 pb-2 border-b border-neutral-100">
            {membreSeleccionat ? `Edita: ${membreSeleccionat.nom}` : 'Afegir nou membre de l\'equip'}
          </h3>
          <MembreForm
            initialData={membreSeleccionat}
            onClose={() => setMostrarForm(false)}
            onSaved={handleSaved}
          />
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span>Carregant equip...</span>
        </div>
      ) : membres.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-neutral-400 text-sm shadow-sm">
          No hi ha cap membre de l'equip definit. Fes clic a "Afegir membre" per afegir el primer.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <ul className="divide-y divide-neutral-100">
            {membres.map((m) => (
              <li key={m.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Foto de Perfil o Avatar */}
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center font-bold text-xs text-neutral-500">
                    {m.foto ? (
                      <img src={m.foto} alt={m.nom} className="h-full w-full object-cover" />
                    ) : (
                      m.nom.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-bold text-sm sm:text-base text-neutral-900 truncate">
                        {m.nom}
                      </h3>
                      {!m.actiu && (
                        <span className="bg-neutral-100 text-neutral-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-neutral-200">
                          <EyeOff size={10} />
                          Inactiu
                        </span>
                      )}
                    </div>
                    {m.carrec && (
                      <p className="text-xs font-semibold text-primary uppercase mt-0.5 truncate">
                        {m.carrec}
                      </p>
                    )}
                    <span className="inline-block bg-neutral-100 text-neutral-500 text-[9px] font-bold px-1.5 py-0.5 rounded mt-1.5">
                      Posició d'ordre: {m.ordre}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(m)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-primary hover:border-primary shadow-sm active:scale-95 transition-transform"
                  title="Editar membre"
                >
                  <Edit2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
