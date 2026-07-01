import { Membre } from '@/lib/types'

interface MembreCardProps {
  membre: Membre
}

export default function MembreCard({ membre }: MembreCardProps) {
  const { nom, carrec, bio, foto } = membre

  const initials = nom
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden group h-full">
      {/* Contenidor Foto */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden w-full">
        {foto ? (
          <img
            src={foto}
            alt={nom}
            className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-neutral-100 text-neutral-400 font-bold text-2xl tracking-wider">
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-sans font-bold text-lg text-neutral-900 leading-snug">
          {nom}
        </h3>
        {carrec && (
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mt-1 block">
            {carrec}
          </span>
        )}
        {bio && (
          <p className="text-sm text-neutral-500 mt-3 leading-relaxed border-t border-neutral-100 pt-3">
            {bio}
          </p>
        )}
      </div>
    </div>
  )
}
