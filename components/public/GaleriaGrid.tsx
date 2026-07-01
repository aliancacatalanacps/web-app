'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Foto {
  url: string
}

interface GaleriaGridProps {
  fotos: Foto[]
}

export default function GaleriaGrid({ fotos }: GaleriaGridProps) {
  const [indexObert, setIndexObert] = useState<number | null>(null)

  if (!fotos || fotos.length === 0) return null

  function obrir(idx: number) {
    setIndexObert(idx)
  }

  function tancar() {
    setIndexObert(null)
  }

  function anterior() {
    if (indexObert === null) return
    setIndexObert((prev) => (prev === 0 ? fotos.length - 1 : prev! - 1))
  }

  function seguent() {
    if (indexObert === null) return
    setIndexObert((prev) => (prev === fotos.length - 1 ? 0 : prev! + 1))
  }

  return (
    <div className="mt-8">
      <h3 className="font-sans font-bold text-xl text-neutral-900 mb-4">Galeria de Fotos</h3>
      
      {/* Grid de miniatures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((f, idx) => (
          <button
            key={f.url}
            onClick={() => obrir(idx)}
            className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:opacity-90 transition-opacity border border-neutral-200"
          >
            <img
              src={f.url}
              alt={`Foto de la galeria ${idx + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {indexObert !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none">
          {/* Tancar */}
          <button
            onClick={tancar}
            className="absolute top-4 right-4 p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Tancar"
          >
            <X size={28} />
          </button>

          {/* Navegació Esquerra */}
          <button
            onClick={anterior}
            className="absolute left-4 p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={36} />
          </button>

          {/* Imatge de contingut */}
          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
            <img
              src={fotos[indexObert].url}
              alt={`Foto de la galeria ${indexObert + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          </div>

          {/* Navegació Dreta */}
          <button
            onClick={seguent}
            className="absolute right-4 p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Foto següent"
          >
            <ChevronRight size={36} />
          </button>

          {/* Comptador inferior */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-semibold uppercase tracking-wider">
            {indexObert + 1} de {fotos.length}
          </div>
        </div>
      )}
    </div>
  )
}
