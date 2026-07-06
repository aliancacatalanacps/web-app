'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function PreguntaForm() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [pregunta, setPregunta] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Si us plau, introdueix un correu electrònic vàlid per poder rebre la resposta.')
      return
    }
    if (!pregunta || pregunta.trim().length < 10) {
      setStatus('error')
      setErrorMessage('La pregunta ha de tenir almenys 10 caràcters.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/preguntes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim() || 'Anònim',
          email: email.trim(),
          pregunta: pregunta.trim()
        })
      })

      if (res.ok) {
        setStatus('success')
        setNom('')
        setEmail('')
        setPregunta('')
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'S\'ha produït un error en desar la teva pregunta.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage('No s\'ha pogut connectar amb el servidor.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200">
          <CheckCircle2 size={24} />
        </div>
        <h4 className="font-sans font-bold text-neutral-900 text-sm">Pregunta tramesa amb èxit!</h4>
        <p className="text-xs text-neutral-500 leading-normal">
          El nostre regidor rebrà la teva consulta de seguida. S'analitzarà i es respondrà el més aviat possible al correu que has indicat.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs font-bold text-primary hover:underline"
        >
          Enviar una altra pregunta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Nom o Sobrenom
          </label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            disabled={status === 'loading'}
            placeholder="Ex: Joan de S'Agaró"
            className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Correu electrònic *
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            placeholder="Ex: joan@correu.cat"
            className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="pregunta" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
          La teva pregunta o suggeriment
        </label>
        <textarea
          id="pregunta"
          rows={4}
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          disabled={status === 'loading'}
          placeholder="Escriu de forma clara la teva consulta sobre el nostre municipi..."
          className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors resize-none"
        ></textarea>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
          <AlertTriangle size={14} className="shrink-0" />
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded bg-primary text-white py-2.5 text-xs font-bold shadow hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
      >
        <span>{status === 'loading' ? 'Trametent...' : 'Enviar pregunta'}</span>
        <Send size={12} />
      </button>
    </form>
  )
}
