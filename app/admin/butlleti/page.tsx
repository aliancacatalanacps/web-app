import { createClient } from '@/lib/supabase/server'
import { ButlletiSubscriptor } from '@/lib/types'
import { Mail, Calendar, UserCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminButlletiPage() {
  let subscriptors: ButlletiSubscriptor[] = []
  let errorMsg = ''

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('butlleti_subscriptors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    if (data) subscriptors = data
  } catch (err: any) {
    errorMsg = err.message || 'Error carregant subscriptors.'
  }

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Subscriptors del Butlletí</h1>
          <p className="text-sm text-neutral-500">Llista de ciutadans inscrits per rebre les novetats mensuals del partit.</p>
        </div>
        <div className="bg-primary/5 text-primary border border-primary/10 rounded px-3 py-1.5 text-xs font-bold shrink-0">
          Total: {subscriptors.length} inscrits
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-xs font-bold text-red-600">
          {errorMsg}
        </div>
      )}

      {/* Llistat */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        {subscriptors.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            Encara no hi ha cap subscriptor registrat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Correu Electrònic</th>
                  <th className="px-6 py-3">Data de Registre</th>
                  <th className="px-6 py-3">Estat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                {subscriptors.map((sub) => {
                  const date = new Date(sub.created_at).toLocaleDateString('ca', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })

                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4 font-bold text-neutral-900 flex items-center gap-2">
                        <Mail size={14} className="text-neutral-400" />
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} className="text-neutral-400" />
                          {date}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          sub.actiu ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <UserCheck size={10} />
                          {sub.actiu ? 'Actiu' : 'Baixa'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
