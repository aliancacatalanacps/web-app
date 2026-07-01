'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react'

const contactSchema = z.object({
  nom: z.string().min(2, { message: "El nom ha de tenir almenys 2 caràcters" }),
  email: z.string().email({ message: "Correu electrònic no vàlid" }),
  missatge: z.string().min(10, { message: "El missatge ha de tenir almenys 10 caràcters" }),
  acceptaPrivacitat: z.boolean().refine(val => val === true, {
    message: "Has d'acceptar la política de privacitat"
  })
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nom: '',
      email: '',
      missatge: '',
      acceptaPrivacitat: false
    }
  })

  async function onSubmit(data: ContactFormData) {
    setStatus('loading')
    try {
      const response = await fetch('/api/contacte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: data.nom,
          email: data.email,
          missatge: data.missatge
        })
      })

      if (response.ok) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Atenció ciutadana</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Contacta amb nosaltres
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Tens alguna proposta per al nostre municipi o vols transmetre'ns una queixa? Volem escoltar-te.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Informació de contacte a l'esquerra */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8">
              <h3 className="font-sans font-bold text-lg text-neutral-950 mb-6 border-b border-neutral-200 pb-3">
                Dades de contacte
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Correu electrònic</span>
                    <a href="mailto:platjadaro@aliancacatalana.cat" className="text-sm font-semibold text-neutral-800 hover:text-primary">
                      platjadaro@aliancacatalana.cat
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Telèfon</span>
                    <span className="text-sm font-semibold text-neutral-800">
                      +34 972 XX XX XX
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Localització</span>
                    <span className="text-sm font-semibold text-neutral-800 leading-relaxed">
                      Castell-Platja d'Aro i S'Agaró<br />
                      Baix Empordà, Girona, Catalunya
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulari a la dreta */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-lg p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 border border-green-200">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-sans font-bold text-xl text-neutral-900 mb-2">Missatge enviat amb èxit</h3>
                <p className="text-neutral-500 max-w-sm mb-6 text-sm">
                  Gràcies pel teu interès. L'equip d'Aliança Catalana Platja d'Aro respondrà a la teva sol·licitud al més aviat possible.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="rounded border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  Enviar un altre missatge
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="nom" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                    Nom complet
                  </label>
                  <input
                    id="nom"
                    type="text"
                    {...register('nom')}
                    className={`w-full rounded border px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none ${
                      errors.nom ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-neutral-200 focus:border-primary'
                    }`}
                    placeholder="El teu nom"
                  />
                  {errors.nom && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.nom.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                    Correu electrònic
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`w-full rounded border px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none ${
                      errors.email ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-neutral-200 focus:border-primary'
                    }`}
                    placeholder="correu@exemple.cat"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="missatge" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                    Missatge
                  </label>
                  <textarea
                    id="missatge"
                    rows={5}
                    {...register('missatge')}
                    className={`w-full rounded border px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none resize-none ${
                      errors.missatge ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-neutral-200 focus:border-primary'
                    }`}
                    placeholder="Explica'ns en què et podem ajudar..."
                  />
                  {errors.missatge && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.missatge.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('acceptaPrivacitat')}
                      className="mt-1 accent-primary h-4 w-4 rounded border-neutral-300"
                    />
                    <span className="text-xs text-neutral-500 leading-normal">
                      He llegit i accepto la política de privacitat per al tractament de les meves dades personals per part d'Aliança Catalana.
                    </span>
                  </label>
                  {errors.acceptaPrivacitat && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.acceptaPrivacitat.message}
                    </p>
                  )}
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    S'ha produït un error en enviar el missatge. Si us plau, torna-ho a provar.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 rounded bg-primary text-white py-3.5 text-sm font-bold shadow hover:bg-primary-dark transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  {status === 'loading' ? 'Enviant...' : 'Enviar missatge'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
