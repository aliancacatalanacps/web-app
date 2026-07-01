'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface FotoUploaderProps {
  onUploadSuccess: (url: string) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
  defaultUrl?: string | null
  label?: string
}

export default function FotoUploader({
  onUploadSuccess,
  onUploadStart,
  onUploadEnd,
  defaultUrl = null,
  label = "Imatge de portada"
}: FotoUploaderProps) {
  const [url, setUrl] = useState<string | null>(defaultUrl)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploading(true)
    if (onUploadStart) onUploadStart()

    try {
      // Generem un nom de fitxer únic
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `noticies/${fileName}`

      // Pujada a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Obtenir la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      setUrl(publicUrl)
      onUploadSuccess(publicUrl)
    } catch (error) {
      console.error('Error pujant la imatge:', error)
      alert('S\'ha produït un error en pujar la imatge.')
    } finally {
      setUploading(false)
      if (onUploadEnd) onUploadEnd()
    }
  }

  function triggerFileInput() {
    fileInputRef.current?.click()
  }

  function handleRemove() {
    setUrl(null)
    onUploadSuccess('')
  }

  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">
        {label}
      </span>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {url ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 group max-w-sm">
          <img src={url} alt="Imatge pujada" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors"
            aria-label="Eliminar imatge"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg p-6 bg-neutral-50 hover:bg-neutral-100 hover:border-primary/50 transition-colors w-full max-w-sm aspect-video text-neutral-500"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-xs font-semibold">Pujant imatge...</span>
            </>
          ) : (
            <>
              <Upload className="mb-2" size={24} />
              <span className="text-xs font-semibold">Puja una foto des del mòbil</span>
              <span className="text-[10px] text-neutral-400 mt-1">Càmera o galeria</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
