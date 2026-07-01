'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import FotoUploader from './FotoUploader'
import { Membre } from '@/lib/types'
import { ArrowLeft, Save, Trash } from 'lucide-react'

interface MembreFormProps {
  initialData?: Membre | null
  onClose?: () => void
  onSaved?: () => void
}

interface FormValues {
  nom: string
  carrec: string
  bio: string
  ordre: number
  actiu: boolean
}

export default function MembreForm({ initialData = null, onClose, onSaved }: MembreFormProps) {
  const router = useRouter()
  const [fotoUrl, setFotoUrl] = useState<string | null>(initialData?.foto || null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      nom: initialData?.nom || '',
      carrec: initialData?.carrec || '',
      bio: initialData?.bio || '',
      ordre: initialData?.ordre ?? 1,
      actiu: initialData ? initialData.actiu : true,
    }
  })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setError(null)

    try {
      const dataPayload = {
        nom: values.nom,
        carrec: values.carrec || null,
        bio: values.bio || null,
        foto: fotoUrl || null,
        ordre: Number(values.ordre),
        actiu: values.actiu
      }

      if (initialData) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('membres')
          .update(dataPayload)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('membres')
          .insert([dataPayload])

        if (insertError) throw insertError
      }

      if (onSaved) onSaved()
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error en desar el membre.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!initialData) return
    if (!confirm('Segur que vols eliminar aquest membre de l\'equip?')) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('membres')
        .delete()
        .eq('id', initialData.id)

      if (error) throw error

      if (onSaved) onSaved()
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'No s\'ha pogut eliminar el membre.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Nom complet *
          </label>
          <input
            id="nom"
            type="text"
            required
            {...register('nom')}
            className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
            placeholder="Nom complet"
          />
        </div>

        <div>
          <label htmlFor="carrec" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Càrrec o responsabilitat
          </label>
          <input
            id="carrec"
            type="text"
            {...register('carrec')}
            className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
            placeholder="Ex: Cap de llista, Coordinador, etc."
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Biografia curta (2-3 línies)
          </label>
          <textarea
            id="bio"
            rows={3}
            {...register('bio')}
            className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary resize-none leading-relaxed"
            placeholder="Biografia breu del membre de l'equip..."
          />
        </div>

        {/* Pujador de foto */}
        <FotoUploader
          label="Foto de perfil"
          defaultUrl={fotoUrl}
          onUploadSuccess={(url) => setFotoUrl(url)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ordre" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
              Ordre de visualització
            </label>
            <input
              id="ordre"
              type="number"
              required
              {...register('ordre', { min: 1 })}
              className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white outline-none focus:border-primary"
              placeholder="1"
            />
          </div>
          
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('actiu')}
                className="accent-primary h-4 w-4 rounded border-neutral-300"
              />
              <span className="text-sm font-semibold text-neutral-700">Actiu</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-4 border-t border-neutral-100">
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1 text-xs font-bold text-red-600 hover:underline"
          >
            Eliminar membre
          </button>
        )}

        <div className="flex gap-2 ml-auto">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel·lar
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary text-white px-5 py-2.5 text-xs font-bold shadow hover:bg-primary-dark"
          >
            <Save size={14} />
            {submitting ? 'Desant...' : 'Desar membre'}
          </button>
        </div>
      </div>
    </form>
  )
}
