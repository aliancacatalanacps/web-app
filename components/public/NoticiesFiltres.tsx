'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const filtres = [
  { id: 'tot', label: 'Totes' },
  { id: 'premsa', label: 'Premsa' },
  { id: 'galeria', label: 'Galeries' },
]

export default function NoticiesFiltres() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipusActiu = searchParams.get('tipus') || 'tot'

  function handleFiltre(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (id === 'tot') {
      params.delete('tipus')
    } else {
      params.set('tipus', id)
    }
    router.push(`/noticies?${params.toString()}`)
  }

  return (
    <div className="flex border-b border-neutral-200 w-full mb-8">
      <div className="flex space-x-8">
        {filtres.map((f) => {
          const isActive = tipusActiu === f.id
          return (
            <button
              key={f.id}
              onClick={() => handleFiltre(f.id)}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
