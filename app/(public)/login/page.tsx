'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function UnifiedLoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const supabase = createClient()

  // Si ja està loggejat, redirigir fora de la pàgina
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: perfil } = await supabase
          .from('usuaris')
          .select('role')
          .eq('id', user.id)
          .single()
        if (perfil?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/tauler')
        }
      }
    }
    checkUser()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Correu o contrasenya incorrectes.' : error.message)
      } else if (data.user) {
        // Obtenir rol per a redirigir de fons
        const { data: perfil } = await supabase
          .from('usuaris')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (perfil?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/tauler')
        }
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError("S'ha produït un error al connectar amb el servidor.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    if (!nom.trim()) {
      setError('Si us plau, introdueix el teu nom.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nom: nom.trim(),
          },
          emailRedirectTo: `${window.location.origin}/tauler`
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccessMsg("T'has registrat correctament! Si és necessari, confirma el correu des de la teva bústia d'entrada.")
        
        // Intentar autologin si l'usuari ja s'ha loggejat immediatament (depèn de la configuració de Supabase)
        if (data?.session) {
          router.push('/tauler')
          router.refresh()
        } else {
          setActiveTab('login')
        }
      }
    } catch (err) {
      console.error(err)
      setError("S'ha produït un error en registrar-te.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-neutral-200 rounded-lg shadow-sm">
        
        {/* Capçalera */}
        <div className="text-center flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Aliança Catalana"
            className="h-12 w-auto object-contain mb-4"
          />
          <h2 className="font-sans font-black text-2xl tracking-tight text-neutral-900 leading-none">
            Zona Ciutadana
          </h2>
          <p className="mt-2 text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Castell d'Aro, Platja d'Aro i s'Agaró
          </p>
        </div>

        {/* Pestanyes de Navegació */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => { setActiveTab('login'); setError(null); setSuccessMsg(null); }}
            className={`w-1/2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-colors ${
              activeTab === 'login'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Iniciar Sessió
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); setSuccessMsg(null); }}
            className={`w-1/2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-colors ${
              activeTab === 'register'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Crear Compte
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'login' ? (
          <form className="space-y-5 text-xs" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Correu electrònic
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-xs text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="el-teu-correu@exemple.cat"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Contrasenya
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-xs text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary py-3.5 px-4 font-bold text-white uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:bg-neutral-300 items-center gap-1.5"
            >
              {loading ? 'Accedint...' : 'Entrar'}
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          <form className="space-y-5 text-xs" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  El teu nom complet
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-xs text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="Nom i Cognoms"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Correu electrònic
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-xs text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="correu@exemple.cat"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Tria una contrasenya
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-xs text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="Mínim 6 caràcters"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary py-3.5 px-4 font-bold text-white uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:bg-neutral-300 items-center gap-1.5"
            >
              {loading ? 'Creant compte...' : 'Registrar-me'}
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
