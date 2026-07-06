'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Download, Mail, LogOut, CheckCircle2, User, Landmark, HelpCircle, Loader2 } from 'lucide-react'

export default function CitizenDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const supabase = createClient()

  async function checkUserSession() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Obtenir perfil del ciutadà
      const { data: perfilData } = await supabase
        .from('usuaris')
        .select('*')
        .eq('id', user.id)
        .single()
      setPerfil(perfilData)

      // Comprovar si ja està subscrit al butlletí
      if (user.email) {
        const { data: sub } = await supabase
          .from('butlleti_subscriptors')
          .select('id')
          .eq('email', user.email)
          .maybeSingle()
        setIsSubscribed(!!sub)
      }
    } catch (err) {
      console.error('Error carregant dades del tauler ciutadà:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUserSession()
  }, [])

  async function handleNewsletterToggle() {
    if (!user?.email) return
    setSubscribing(true)
    setActionMsg(null)

    try {
      if (isSubscribed) {
        // Donar de baixa
        const { error } = await supabase
          .from('butlleti_subscriptors')
          .delete()
          .eq('email', user.email)

        if (error) throw error
        setIsSubscribed(false)
        setActionMsg('T\'has donat de baixa correctament del butlletí.')
      } else {
        // Donar d'alta
        const { error } = await supabase
          .from('butlleti_subscriptors')
          .insert([{ email: user.email, actiu: true }])

        if (error) throw error
        setIsSubscribed(true)
        setActionMsg('T\'has subscrit correctament al butlletí!')

        // Sincronitzar a Google Sheets de fons si està configurat
        try {
          const { data: configData } = await supabase
            .from('configuracio')
            .select('*')
            .eq('clau', 'google_apps_script_url')
            .single()

          if (configData && configData.valor && configData.valor.startsWith('http')) {
            fetch(configData.valor, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tipus: 'butlleti_tauler',
                email: user.email,
                nom: perfil?.nom || 'Ciutadà Registrat',
                missatge: 'Subscripció feta directament des del Tauler Ciutadà.',
                data: new Date().toISOString()
              })
            }).catch(err => console.error(err))
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error(err)
      setActionMsg('S\'ha produït un error al gestionar la teva subscripció.')
    } finally {
      setSubscribing(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-neutral-400">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="text-xs font-bold uppercase tracking-wider">Carregant Tauler Ciutadà...</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-10 text-xs">
      
      {/* Capçalera del Tauler */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Espai de Participació</span>
          <h1 className="font-sans font-black text-3xl text-neutral-900 tracking-tight mt-1">
            Hola, {perfil?.nom || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-neutral-500 mt-1">Benvingut a la teva zona privada d'Aliança Catalana. Des d'aquí pots descarregar documentació i col·laborar.</p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 rounded text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors font-bold uppercase tracking-wider text-[10px]"
        >
          <LogOut size={13} />
          Tancar sessió
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Columna Esquerra: Descàrregues de documents */}
        <div className="md:col-span-8 space-y-6">
          <h3 className="font-sans font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            📥 Documentació i Recursos Municipals
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Document 1 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44">
              <div>
                <span className="bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded">PDF Oficial</span>
                <h4 className="font-bold text-neutral-900 text-sm mt-3 leading-snug">Programa Electoral 2023-2027</h4>
                <p className="text-neutral-400 text-[11px] mt-1.5 leading-normal">Consulta totes les propostes i full de ruta dissenyats per al nostre municipi.</p>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Descàrrega simulada: Programa Electoral AC Castell d'Aro.pdf"); }}
                className="mt-4 inline-flex items-center gap-1 text-primary hover:underline font-bold text-[10px] uppercase tracking-wider"
              >
                <Download size={13} />
                Descarregar Document
              </a>
            </div>

            {/* Document 2 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44">
              <div>
                <span className="bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded">PDF Oficial</span>
                <h4 className="font-bold text-neutral-900 text-sm mt-3 leading-snug">Díptic Municipal de Propostes</h4>
                <p className="text-neutral-400 text-[11px] mt-1.5 leading-normal">Full de resum de compromisos pel regidor i l'agrupació local.</p>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Descàrrega simulada: Diptic AC Platja d'Aro i s'Agaró.pdf"); }}
                className="mt-4 inline-flex items-center gap-1 text-primary hover:underline font-bold text-[10px] uppercase tracking-wider"
              >
                <Download size={13} />
                Descarregar Díptic
              </a>
            </div>

            {/* Document 3 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44">
              <div>
                <span className="bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded">PDF Informatiu</span>
                <h4 className="font-bold text-neutral-900 text-sm mt-3 leading-snug">Guia d'Ús de la Bústia Ciutadana</h4>
                <p className="text-neutral-400 text-[11px] mt-1.5 leading-normal">Com funciona el sistema de preguntes directes al Ple de l'Ajuntament.</p>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Descàrrega simulada: Guia Bustia Ciutadana Ple.pdf"); }}
                className="mt-4 inline-flex items-center gap-1 text-primary hover:underline font-bold text-[10px] uppercase tracking-wider"
              >
                <Download size={13} />
                Descarregar Guia
              </a>
            </div>

            {/* Document 4 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44">
              <div>
                <span className="bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded">Infografia</span>
                <h4 className="font-bold text-neutral-900 text-sm mt-3 leading-snug">Dades del Municipi Obert</h4>
                <p className="text-neutral-400 text-[11px] mt-1.5 leading-normal">Detalls gràfics dels indicadors i pressupostos consolidats.</p>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Descàrrega simulada: Infografia Dades Municipi.pdf"); }}
                className="mt-4 inline-flex items-center gap-1 text-primary hover:underline font-bold text-[10px] uppercase tracking-wider"
              >
                <Download size={13} />
                Descarregar Infografia
              </a>
            </div>

          </div>
        </div>

        {/* Columna Dreta: Gestió de Mailing i Voluntariat */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Bloc 1: Butlletí */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-neutral-900 text-xs uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-1">
              <Mail size={14} className="text-primary" />
              Subscripció al Butlletí
            </h4>

            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Vols rebre al teu correu electrònic les últimes notícies, convocatòries d'actes i informació econòmica mensualment?
            </p>

            {actionMsg && (
              <div className="p-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-[10px] font-semibold rounded">
                {actionMsg}
              </div>
            )}

            <button
              onClick={handleNewsletterToggle}
              disabled={subscribing}
              className={`w-full py-2.5 rounded font-bold uppercase tracking-wider text-[10px] text-center border transition-colors cursor-pointer ${
                isSubscribed
                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  : 'bg-primary border-primary text-white hover:bg-primary-dark'
              }`}
            >
              {subscribing ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="animate-spin" size={11} />
                  Processant...
                </span>
              ) : isSubscribed ? (
                'Subscrit ✓ (Baixa)'
              ) : (
                'Subscriure\'m amb 1 Clic'
              )}
            </button>
          </div>

          {/* Bloc 2: Voluntariat */}
          <div className="bg-neutral-950 text-white rounded-lg p-5 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1">
              <Landmark size={14} className="text-primary" />
              Vols col·laborar?
            </h4>

            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Necessitem la col·laboració de ciutadans actius per a l'enganxada de cartells, organització d'actes públics i preparació del programa.
            </p>

            <a
              href="mailto:platjadaro@aliancacatalana.cat?subject=Vull col·laborar com a voluntari a Platja d'Aro"
              className="block w-full py-2.5 rounded bg-primary text-white text-center font-bold uppercase tracking-wider text-[10px] hover:bg-primary-dark transition-colors"
            >
              Contactar i Sumar-me
            </a>
          </div>

        </div>

      </div>

    </div>
  )
}
