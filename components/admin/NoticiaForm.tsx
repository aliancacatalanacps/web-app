'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Newspaper, Image as ImageIcon, FileText, Plus, X, ArrowLeft, Save, Trash, BarChart2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import FotoUploader from './FotoUploader'
import { Noticia, TipusNoticia, Mocio } from '@/lib/types'

interface NoticiaFormProps {
  initialData?: Noticia | null
  initialFotos?: string[]
}

interface FormValues {
  titol: string
  slug: string
  cos: string
  data_publicacio: string
  link_extern: string
  publicat: boolean
}

type MocioInput = Omit<Mocio, 'id' | 'noticia_id'>

export default function NoticiaForm({ initialData = null, initialFotos = [] }: NoticiaFormProps) {
  const router = useRouter()
  const [tipus, setTipus] = useState<TipusNoticia>(initialData?.tipus || 'noticia')
  const [portadaUrl, setPortadaUrl] = useState<string | null>(initialData?.imatge_portada || null)
  const [galeriaUrls, setGaleriaUrls] = useState<string[]>(initialFotos)
  const [mocions, setMocions] = useState<MocioInput[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Carregar mocions de forma dinàmica en mode edició
  useEffect(() => {
    if (initialData && initialData.tipus === 'noticia') {
      supabase
        .from('mocions')
        .select('*')
        .eq('noticia_id', initialData.id)
        .then(({ data }) => {
          if (data) setMocions(data)
        })
    }
  }, [initialData])

  // Helper per a generar slug
  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD') // Elimina accents
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-') // Espais a guions
      .replace(/[^\w\-]+/g, '') // Elimina caràcters especials
      .replace(/\-\-+/g, '-') // Elimina dobles guions
      .replace(/^-+/, '') // Treu guió inicial
      .replace(/-+$/, '') // Treu guió final
  }

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      titol: initialData?.titol || '',
      slug: initialData?.slug || '',
      cos: initialData?.cos || '',
      data_publicacio: initialData
        ? new Date(initialData.data_publicacio).toISOString().substring(0, 16)
        : new Date().toISOString().substring(0, 16),
      link_extern: initialData?.link_extern || '',
      publicat: initialData ? initialData.publicat : true,
    }
  })

  const titolWatch = watch('titol')

  // Auto-slugify en escriure el títol si no s'edita manualment
  function handleTitolChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setValue('titol', val)
    if (!initialData) {
      setValue('slug', slugify(val))
    }
  }

  // Pujada de foto de galeria
  function handleGaleriaUpload(url: string) {
    if (url) {
      setGaleriaUrls((prev) => [...prev, url])
    }
  }

  function handleRemoveGaleria(idxToRemove: number) {
    setGaleriaUrls((prev) => prev.filter((_, idx) => idx !== idxToRemove))
  }

  // Gestió de mocions locals
  function handleAddMocio() {
    setMocions((prev) => [
      ...prev,
      { titol: '', resultat: 'aprovada', vots_favor: 0, vots_contra: 0, abstencions: 0 }
    ])
  }

  function handleRemoveMocio(idx: number) {
    setMocions((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleMocioChange(idx: number, field: keyof MocioInput, val: any) {
    setMocions((prev) =>
      prev.map((mo, i) => {
        if (i === idx) {
          return { ...mo, [field]: val }
        }
        return mo
      })
    )
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setError(null)

    try {
      const dataPayload = {
        tipus,
        titol: values.titol,
        slug: values.slug || slugify(values.titol),
        cos: values.cos || null,
        data_publicacio: new Date(values.data_publicacio).toISOString(),
        imatge_portada: portadaUrl || null,
        link_extern: tipus === 'premsa' ? values.link_extern : null,
        publicat: values.publicat
      }

      let noticiaId = initialData?.id

      if (initialData) {
        // Mode edició: UPDATE
        const { error: updateError } = await supabase
          .from('noticies')
          .update(dataPayload)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        // Mode creació: INSERT
        const { data: insertedData, error: insertError } = await supabase
          .from('noticies')
          .insert([dataPayload])
          .select()
          .single()

        if (insertError) throw insertError
        noticiaId = insertedData.id
      }

      // Gestionar fotos addicionals de la galeria
      if (noticiaId && (tipus === 'galeria' || tipus === 'noticia')) {
        // Esborrem les fotos existents primer per a re-inserir en edició
        if (initialData) {
          await supabase.from('noticies_fotos').delete().eq('noticia_id', noticiaId)
        }

        if (galeriaUrls.length > 0) {
          const fotosPayload = galeriaUrls.map((url, index) => ({
            noticia_id: noticiaId,
            url,
            ordre: index
          }))

          const { error: fotosError } = await supabase
            .from('noticies_fotos')
            .insert(fotosPayload)

          if (fotosError) throw fotosError
        }
      }

      // Gestionar mocions associades
      if (noticiaId && tipus === 'noticia') {
        // Esborrar anteriors si estem en mode edició
        if (initialData) {
          await supabase.from('mocions').delete().eq('noticia_id', noticiaId)
        }

        if (mocions.length > 0) {
          const mocionsPayload = mocions.map(mo => ({
            noticia_id: noticiaId,
            titol: mo.titol,
            resultat: mo.resultat,
            vots_favor: mo.vots_favor || 0,
            vots_contra: mo.vots_contra || 0,
            abstencions: mo.abstencions || 0
          }))

          const { error: mocionsError } = await supabase
            .from('mocions')
            .insert(mocionsPayload)

          if (mocionsError) throw mocionsError
        }
      }

      router.push('/admin/noticies')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'S\'ha produït un error en desar.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!initialData) return
    if (!confirm('Segur que vols eliminar aquesta entrada? Aquesta acció no es pot desfer.')) return
    
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('noticies')
        .delete()
        .eq('id', initialData.id)

      if (error) throw error

      router.push('/admin/noticies')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'No s\'ha pogut eliminar l\'entrada.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white border border-neutral-200 rounded-lg p-6 sm:p-8">
      
      {/* Botó Enrere i Títol Form */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
        <button
          type="button"
          onClick={() => router.push('/admin/noticies')}
          className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Enrere
        </button>
        <h2 className="font-sans font-bold text-neutral-900">
          {initialData ? 'Edita l\'entrada' : 'Nova entrada'}
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      {/* 1. SELECTOR DE TIPUS (3 Botons grans per a mòbil) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">
          Tipus de publicació
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTipus('noticia')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all ${
              tipus === 'noticia'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <FileText size={18} className="mb-1" />
            Notícia
          </button>
          
          <button
            type="button"
            onClick={() => setTipus('premsa')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all ${
              tipus === 'premsa'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <Newspaper size={18} className="mb-1" />
            Premsa
          </button>

          <button
            type="button"
            onClick={() => setTipus('galeria')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all ${
              tipus === 'galeria'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <ImageIcon size={18} className="mb-1" />
            Galeria
          </button>
        </div>
      </div>

      {/* 2. DADES PRINCIPALS */}
      <div className="space-y-4">
        <div>
          <label htmlFor="titol" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Títol *
          </label>
          <input
            id="titol"
            type="text"
            required
            onChange={handleTitolChange}
            value={titolWatch}
            className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary"
            placeholder="Títol de la publicació"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Slug d'URL (Identificador únic) *
          </label>
          <input
            id="slug"
            type="text"
            required
            {...register('slug')}
            className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-950 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary font-mono text-xs"
            placeholder="pla-integral-maritim"
          />
        </div>

        <div>
          <label htmlFor="data_publicacio" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Data de publicació
          </label>
          <input
            id="data_publicacio"
            type="datetime-local"
            required
            {...register('data_publicacio')}
            className="rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white outline-none focus:border-primary"
          />
        </div>

        {/* Portada */}
        <FotoUploader
          label="Imatge de portada"
          defaultUrl={portadaUrl}
          onUploadSuccess={(url) => setPortadaUrl(url)}
        />

        {/* Link Extern per a Premsa */}
        {tipus === 'premsa' && (
          <div>
            <label htmlFor="link_extern" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
              Enllaç original de premsa *
            </label>
            <input
              id="link_extern"
              type="url"
              required={tipus === 'premsa'}
              {...register('link_extern')}
              className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary font-mono text-xs"
              placeholder="https://www.elpuntavui.cat/article/..."
            />
          </div>
        )}

        {/* Cos de l'Article */}
        <div>
          <label htmlFor="cos" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
            Cos de la publicació (Markdown admès)
          </label>
          <textarea
            id="cos"
            rows={8}
            {...register('cos')}
            className="w-full rounded border border-neutral-200 px-4 py-3 text-sm text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none focus:border-primary resize-y leading-relaxed font-sans"
            placeholder="Escriu el text aquí..."
          />
        </div>

        {/* Secció Galeria de Fotos */}
        {(tipus === 'galeria' || tipus === 'noticia') && (
          <div className="border-t border-neutral-100 pt-6 space-y-4">
            <h3 className="font-sans font-bold text-sm text-neutral-900">Fotos addicionals per a la Galeria</h3>
            
            {/* Grid de fotos existents de la galeria */}
            {galeriaUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {galeriaUrls.map((url, idx) => (
                  <div key={url} className="relative aspect-square rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img src={url} alt={`Galeria ${idx + 1}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGaleria(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      aria-label="Treure foto"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <FotoUploader
              label="Afegeix una foto a la galeria"
              onUploadSuccess={handleGaleriaUpload}
            />
          </div>
        )}

        {/* Secció de Mocions (Fase 3 - només si és de tipus noticia plenari) */}
        {tipus === 'noticia' && (
          <div className="border-t border-neutral-100 pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                <BarChart2 size={16} className="text-primary" />
                Mocions presentades en aquest Ple
              </h3>
              <button
                type="button"
                onClick={handleAddMocio}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                + Afegir moció
              </button>
            </div>

            {mocions.length === 0 ? (
              <p className="text-xs text-neutral-400">No hi ha mocions vinculades a aquesta publicació.</p>
            ) : (
              <div className="space-y-4">
                {mocions.map((mo, idx) => (
                  <div key={idx} className="border border-neutral-200 rounded p-4 bg-neutral-50/50 space-y-3 relative text-xs">
                    <button
                      type="button"
                      onClick={() => handleRemoveMocio(idx)}
                      className="absolute top-2 right-2 text-neutral-400 hover:text-red-600 transition-colors"
                      aria-label="Eliminar moció"
                    >
                      <X size={16} />
                    </button>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        Títol de la moció *
                      </label>
                      <input
                        type="text"
                        value={mo.titol}
                        onChange={(e) => handleMocioChange(idx, 'titol', e.target.value)}
                        placeholder="Ex: Moció per a la regulació del soroll"
                        className="w-full rounded border border-neutral-200 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Resultat
                        </label>
                        <select
                          value={mo.resultat}
                          onChange={(e) => handleMocioChange(idx, 'resultat', e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
                        >
                          <option value="aprovada">Aprovada</option>
                          <option value="rebutjada">Rebutjada</option>
                          <option value="retirada">Retirada</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Vots Favor
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={mo.vots_favor}
                          onChange={(e) => handleMocioChange(idx, 'vots_favor', parseInt(e.target.value) || 0)}
                          className="w-full rounded border border-neutral-200 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Vots Contra
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={mo.vots_contra}
                          onChange={(e) => handleMocioChange(idx, 'vots_contra', parseInt(e.target.value) || 0)}
                          className="w-full rounded border border-neutral-200 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Abstencions
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={mo.abstencions}
                          onChange={(e) => handleMocioChange(idx, 'abstencions', parseInt(e.target.value) || 0)}
                          className="w-full rounded border border-neutral-200 px-3 py-2 text-xs text-neutral-900 bg-white focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Publicat */}
        <div className="border-t border-neutral-100 pt-6">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('publicat')}
              className="accent-primary h-4 w-4 rounded border-neutral-300"
            />
            <span className="text-sm font-semibold text-neutral-700">
              Publicat a la web immediatament (si es desmarca quedarà com a esborrany)
            </span>
          </label>
        </div>
      </div>

      {/* Botons d'Acció Inferiors */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-neutral-100">
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-red-200 px-5 py-3 text-sm font-bold text-red-600 bg-white hover:bg-red-50 active:scale-95 transition-transform"
          >
            <Trash size={16} />
            Eliminar entrada
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 rounded bg-primary text-white px-6 py-3.5 text-sm font-bold shadow hover:bg-primary-dark active:scale-95 transition-transform disabled:bg-neutral-300"
        >
          <Save size={16} />
          {submitting ? 'Desant...' : 'Desar publicació'}
        </button>
      </div>
    </form>
  )
}
