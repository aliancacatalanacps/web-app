'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, AlertTriangle } from 'lucide-react'

const categories = [
  'Alimentació',
  'Restauració',
  'Moda i Complements',
  'Serveis professionals',
  'Salut i Estètica',
  'Construcció i Reformes',
  'Tecnologia i Oci',
  'Altres'
]

export default function ComercForm() {
  const [nom, setNom] = useState('')
  const [categoria, setCategoria] = useState('Alimentació')
  const [adreca, setAdreca] = useState('')
  const [telefon, setTelefon] = useState('')
  const [web, setWeb] = useState('')
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nom || nom.trim().length < 3) {
      setStatus('error')
      setErrorMessage('Introdueix el nom del negoci (mínim 3 lletres).')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/comerc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          categoria,
          adreca: adreca.trim() || null,
          telefon: telefon.trim() || null,
          web: web.trim() || null
        })
      })

      if (res.ok) {
        setStatus('success')
        setNom('')
        setAdreca('')
        setTelefon('')
        setWeb('')
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'S\'ha produït un error en sol·licitar l\'alta.')
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
        <h4 className="font-sans font-bold text-neutral-900 text-sm">Sol·licitud enviada!</h4>
        <p className="text-xs text-neutral-500 leading-normal">
          Gràcies per sumar-te. L'equip validarà les dades comercial i s'aprovarà la seva aparició al directori de Platja d'Aro ben aviat.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs font-bold text-primary hover:underline"
        >
          Afegir un altre comerç
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="nom" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Nom del Comerç / Autònom *
        </label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          disabled={status === 'loading'}
          placeholder="Ex: Fleca de Castell"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="categoria" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Categoria comercial *
        </label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          disabled={status === 'loading'}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="adreca" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Adreça física
        </label>
        <input
          type="text"
          id="adreca"
          value={adreca}
          onChange={(e) => setAdreca(e.target.value)}
          disabled={status === 'loading'}
          placeholder="Ex: Avinguda de S'Agaró, 45"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="telefon" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Telèfon de contacte
        </label>
        <input
          type="tel"
          id="telefon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          disabled={status === 'loading'}
          placeholder="Ex: 972 81 81 81"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="web" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Pàgina web o xarxa social
        </label>
        <input
          type="url"
          id="web"
          value={web}
          onChange={(e) => setWeb(e.target.value)}
          disabled={status === 'loading'}
          placeholder="Ex: https://www.lanostrafleca.cat"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
        />
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
        <span>{status === 'loading' ? 'Enviant...' : 'Sol·licitar inscripció'}</span>
        <Plus size={12} />
      </button>
    </form>
  )
}
