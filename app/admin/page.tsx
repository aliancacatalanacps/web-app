import Link from 'next/link'
import {
  Plus,
  FileText,
  Users,
  Mail,
  AlertTriangle,
  ArrowRight,
  MailQuestion,
  Landmark,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  Store,
  Settings
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Noticia, Contacte } from '@/lib/types'

export const revalidate = 0 // Evitar cache per a les dades de l'admin

export default async function AdminDashboardPage() {
  let totals = { noticies: 0, membres: 0, contactes: 0, butlleti: 0, preguntesPendents: 0, comercosPendents: 0 }
  let contactesRecents: Contacte[] = []
  let noticiesRecents: Noticia[] = []
  let isDbConfigured = true

  try {
    const supabase = await createClient()

    // 1. Comptadors existents
    const { count: countNoticies } = await supabase
      .from('noticies')
      .select('*', { count: 'exact', head: true })
    
    const { count: countMembres } = await supabase
      .from('membres')
      .select('*', { count: 'exact', head: true })

    const { count: countContactes } = await supabase
      .from('contactes')
      .select('*', { count: 'exact', head: true })

    // 2. Comptadors de Fases 2, 4 i 5
    const { count: countButlleti } = await supabase
      .from('butlleti_subscriptors')
      .select('*', { count: 'exact', head: true })

    const { count: countPreguntes } = await supabase
      .from('preguntes_ciutadanes')
      .select('*', { count: 'exact', head: true })
      .eq('respost', false)

    const { count: countComercos } = await supabase
      .from('comerc_local')
      .select('*', { count: 'exact', head: true })
      .eq('aprovat', false)

    totals = {
      noticies: countNoticies || 0,
      membres: countMembres || 0,
      contactes: countContactes || 0,
      butlleti: countButlleti || 0,
      preguntesPendents: countPreguntes || 0,
      comercosPendents: countComercos || 0
    }

    // 3. Notícies recents
    const { data: dbNoticies } = await supabase
      .from('noticies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    if (dbNoticies) noticiesRecents = dbNoticies

    // 4. Contactes recents (no llegits primer)
    const { data: dbContactes } = await supabase
      .from('contactes')
      .select('*')
      .order('llegit', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3)

    if (dbContactes) contactesRecents = dbContactes

  } catch (error) {
    console.error('Error carregant dades del Dashboard, possiblement sense connexió', error)
    isDbConfigured = false
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Capçalera del Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="font-sans font-black text-3xl text-neutral-900 tracking-tight">Panell de Control</h1>
          <p className="text-sm text-neutral-500 mt-1">Benvingut a l'administració de la web local de Platja d'Aro.</p>
        </div>
        
        {/* Acció ràpida Prominent */}
        <Link
          href="/admin/noticies/nova"
          className="inline-flex items-center justify-center gap-2 rounded bg-primary text-white px-5 py-3 text-sm font-bold shadow hover:bg-primary-dark active:scale-95 transition-transform"
        >
          <Plus size={18} />
          Nova entrada
        </Link>
      </div>

      {/* Avís si no hi ha connexió */}
      {!isDbConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex gap-3 items-start">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold">Supabase no està configurat o connectat</p>
            <p className="text-xs text-amber-700 mt-1">Revisa que hagis definit correctament les variables d'entorn a `.env.local` i hagis carregat l'esquema SQL a la teva consola de Supabase.</p>
          </div>
        </div>
      )}

      {/* Grid de Targetes de Resum */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Notícies</span>
          <span className="font-sans font-black text-2xl text-neutral-900 mt-2">{totals.noticies}</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Equip</span>
          <span className="font-sans font-black text-2xl text-neutral-900 mt-2">{totals.membres}</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Contactes</span>
          <span className="font-sans font-black text-2xl text-neutral-900 mt-2">{totals.contactes}</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Subscriptors</span>
          <span className="font-sans font-black text-2xl text-neutral-900 mt-2">{totals.butlleti}</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Preguntes pend.</span>
          <span className={`font-sans font-black text-2xl mt-2 ${totals.preguntesPendents > 0 ? 'text-red-600' : 'text-neutral-900'}`}>{totals.preguntesPendents}</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Comerços pend.</span>
          <span className={`font-sans font-black text-2xl mt-2 ${totals.comercosPendents > 0 ? 'text-yellow-600' : 'text-neutral-900'}`}>{totals.comercosPendents}</span>
        </div>
      </div>

      {/* Targetes de Gestió Ràpida (Mòbil Friendly) */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider">Gestió de Mòduls</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link href="/admin/noticies" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <FileText className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Notícies i Actualitat</span>
          </Link>

          <Link href="/admin/membres" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <Users className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Equip Municipal</span>
          </Link>

          <Link href="/admin/comerc" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm relative">
            <Store className="text-primary" size={20} />
            {totals.comercosPendents > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-yellow-500 rounded-full animate-pulse"></span>
            )}
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Directori Comerç</span>
          </Link>

          <Link href="/admin/transparencia" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <Landmark className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Transparència</span>
          </Link>

          <Link href="/admin/dades" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <TrendingUp className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Dades municipi</span>
          </Link>

          <Link href="/admin/compromisos" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <ShieldCheck className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Compromisos</span>
          </Link>

          <Link href="/admin/contactes" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <Mail className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Bústia de Contacte</span>
          </Link>

          <Link href="/admin/preguntes" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm relative">
            <HelpCircle className="text-primary" size={20} />
            {totals.preguntesPendents > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-600 rounded-full animate-pulse"></span>
            )}
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Preguntes Ciutadanes</span>
          </Link>

          <Link href="/admin/butlleti" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <MailQuestion className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Subscriptors Butlletí</span>
          </Link>

          <Link href="/admin/configuracio" className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm">
            <Settings className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Configuració</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Notícies Recents */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
            <h3 className="font-sans font-bold text-lg text-neutral-900">Notícies recents</h3>
            <Link href="/admin/noticies" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Veure totes
              <ArrowRight size={12} />
            </Link>
          </div>

          {noticiesRecents.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">No s'ha publicat cap notícia encara.</p>
          ) : (
            <ul className="space-y-4">
              {noticiesRecents.map((n) => (
                <li key={n.id} className="group border-b border-neutral-50 last:border-b-0 pb-4 last:pb-0">
                  <Link href={`/admin/noticies/${n.id}`} className="block">
                    <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1">
                      {n.tipus}
                    </span>
                    <h4 className="font-bold text-sm text-neutral-800 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {n.titol}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-semibold block mt-1">
                      {new Date(n.data_publicacio).toLocaleDateString('ca', { day: 'numeric', month: 'short' })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Missatges de Contacte Recents */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
            <h3 className="font-sans font-bold text-lg text-neutral-900">Últims missatges</h3>
            <Link href="/admin/contactes" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Gestionar
              <ArrowRight size={12} />
            </Link>
          </div>

          {contactesRecents.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">No hi ha cap missatge de contacte rebut.</p>
          ) : (
            <ul className="space-y-4">
              {contactesRecents.map((c) => (
                <li key={c.id} className="border-b border-neutral-50 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-bold text-sm text-neutral-800 line-clamp-1">{c.nom}</h4>
                    {!c.llegit && (
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[9px] font-black uppercase px-1.5 py-0.5 rounded leading-none">
                        Nou
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{c.missatge}</p>
                  <span className="text-[10px] text-neutral-400 block mt-2">
                    {new Date(c.created_at).toLocaleDateString('ca', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
