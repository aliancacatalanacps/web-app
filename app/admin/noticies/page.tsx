import Link from 'next/link'
import { Plus, Edit2, Newspaper, Image as ImageIcon, FileText, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Noticia } from '@/lib/types'

export const revalidate = 0

export default async function AdminNoticiesListPage() {
  let noticies: Noticia[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('noticies')
      .select('*')
      .order('data_publicacio', { ascending: false })

    if (data) noticies = data
  } catch (error) {
    console.error('Error llegint llista de notícies per a admin', error)
  }

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="font-sans font-black text-2xl text-neutral-900 tracking-tight">Notícies i Publicacions</h1>
          <p className="text-xs text-neutral-500 mt-1">Gestiona les publicacions de la web (notícies, premsa i galeries).</p>
        </div>
        <Link
          href="/admin/noticies/nova"
          className="inline-flex items-center gap-1.5 rounded bg-primary text-white px-4 py-2.5 text-xs font-bold shadow hover:bg-primary-dark"
        >
          <Plus size={14} />
          Afegir
        </Link>
      </div>

      {/* Llistat d'entrades */}
      {noticies.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-neutral-400 text-sm shadow-sm">
          No hi ha cap publicació. Fes clic a "Afegir" per crear la teva primera entrada.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <ul className="divide-y divide-neutral-100">
            {noticies.map((n) => {
              const formattedDate = new Date(n.data_publicacio).toLocaleDateString('ca', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })

              return (
                <li key={n.id} className="p-4 sm:p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Indicador de tipus */}
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          n.tipus === 'noticia'
                            ? 'bg-blue-100 text-blue-800'
                            : n.tipus === 'premsa'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {n.tipus}
                        </span>

                        {/* Estat de publicació */}
                        {!n.publicat && (
                          <span className="bg-neutral-100 text-neutral-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200">
                            Esborrany
                          </span>
                        )}

                        {n.arxivat && (
                          <span className="bg-red-50 text-red-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-red-200">
                            Arxivat
                          </span>
                        )}
                      </div>

                      {/* Títol */}
                      <h3 className="font-sans font-bold text-base text-neutral-900 leading-snug">
                        {n.titol}
                      </h3>

                      {/* Data */}
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-semibold">
                        <Calendar size={12} />
                        <span>Publicat el {formattedDate}</span>
                      </div>
                    </div>

                    {/* Botó edició d'accés ràpid per a mòbil */}
                    <Link
                      href={`/admin/noticies/${n.id}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-primary hover:border-primary shadow-sm active:scale-95 transition-transform"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
