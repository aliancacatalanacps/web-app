'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError("Correu o contrasenya incorrectes.")
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError("S'ha produït un error en iniciar sessió.")
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Si us plau, introdueix el teu correu electrònic primer.")
      return
    }
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setMagicLinkSent(true)
      }
    } catch (err) {
      console.error(err)
      setError("No s'ha pogut enviar l'enllaç màgic.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-neutral-200 rounded-lg shadow-sm">
        
        {/* Capçalera */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-primary text-white font-extrabold text-lg border border-primary-dark">
            AC
          </div>
          <h2 className="mt-6 font-sans font-black text-2xl tracking-tight text-neutral-900">
            Panell d'Administració
          </h2>
          <p className="mt-2 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Aliança Catalana Platja d'Aro
          </p>
        </div>

        {magicLinkSent ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm text-center">
            <p className="font-bold mb-1">Enllaç màgic enviat! ✉️</p>
            <p className="text-xs text-green-600">Revisa la teva bústia de correu i fes clic a l'enllaç per accedir directament.</p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="mt-4 text-xs font-bold text-primary underline"
            >
              Tornar a iniciar sessió amb contrasenya
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Correu electrònic
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="correu@exemple.cat"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Contrasenya
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded border border-neutral-200 pl-10 pr-3 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded bg-primary py-3.5 px-4 text-sm font-bold text-white hover:bg-primary-dark transition-colors disabled:bg-neutral-300"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-light group-hover:text-white">
                  <LogIn size={16} />
                </span>
                {loading ? 'Accedint...' : 'Iniciar sessió'}
              </button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full text-center text-xs font-bold text-neutral-500 hover:text-primary transition-colors py-2"
              >
                Envia'm un enllaç màgic per email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
