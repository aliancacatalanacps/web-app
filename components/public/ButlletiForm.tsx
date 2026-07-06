'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ButlletiForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Introdueix un correu vàlid.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/butlleti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'S\'ha produït un error de subscripció.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage('No s\'ha pogut connectar amb el servidor.')
    }
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-neutral-900 uppercase tracking-wider">Butlletí de novetats</h4>
      <p className="text-xs text-neutral-500 max-w-xs leading-normal">
        Subscriu-te per rebre el nostre butlletí resum directament a la teva bústia cada mes.
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 border border-green-200 rounded p-2.5 max-w-xs">
          <CheckCircle size={16} className="shrink-0" />
          <span>Subscripció realitzada correctament!</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-xs" noValidate>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              placeholder="correu@exemple.cat"
              className="flex-1 min-w-0 rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:bg-white transition-colors outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded bg-primary text-white px-3.5 py-2 text-xs font-bold shadow hover:bg-primary-dark active:scale-95 transition-transform disabled:bg-neutral-300 flex items-center justify-center shrink-0"
              aria-label="Subscriure's"
            >
              <Send size={13} />
            </button>
          </div>

          {status === 'error' && (
            <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle size={12} className="shrink-0" />
              {errorMessage}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
