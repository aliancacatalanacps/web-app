import Link from 'next/link'
import { Newspaper, Image as ImageIcon, ExternalLink, Calendar } from 'lucide-react'
import { Noticia } from '@/lib/types'

interface NoticiaCardProps {
  noticia: Noticia
}

export default function NoticiaCard({ noticia }: NoticiaCardProps) {
  const { tipus, titol, slug, cos, data_publicacio, imatge_portada, link_extern } = noticia
  
  const formattedDate = new Date(data_publicacio).toLocaleDateString('ca', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // 1. Variant PREMSA
  if (tipus === 'premsa') {
    return (
      <article className="flex flex-col justify-between p-6 bg-white border border-neutral-200 rounded-lg hover:shadow-md transition-shadow group h-full">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded text-primary">
              <Newspaper size={12} />
              Premsa
            </span>
            <span className="text-neutral-400 flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
          <h3 className="font-sans font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors line-clamp-3 mb-2 leading-snug">
            {titol}
          </h3>
          {cos && (
            <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
              {cos}
            </p>
          )}
        </div>
        <div className="pt-4 border-t border-neutral-100 mt-auto">
          {link_extern ? (
            <a
              href={link_extern}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline"
            >
              Llegir article original
              <ExternalLink size={12} />
            </a>
          ) : (
            <span className="text-xs font-bold text-neutral-400">Enllaç no disponible</span>
          )}
        </div>
      </article>
    )
  }

  // 2. Variant GALERIA
  if (tipus === 'galeria') {
    return (
      <article className="flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group h-full">
        {/* Imatge de portada amb icona de galeria */}
        <Link href={`/noticies/${slug}`} className="block relative aspect-video bg-neutral-100 overflow-hidden">
          {imatge_portada ? (
            <img
              src={imatge_portada}
              alt={titol}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-neutral-100 text-neutral-400">
              <ImageIcon size={32} />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-neutral-900/85 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
            <ImageIcon size={10} />
            Galeria
          </div>
        </Link>

        <div className="flex flex-col flex-1 p-6">
          <time className="text-xs text-neutral-400 font-semibold mb-2 block">
            {formattedDate}
          </time>
          <h3 className="font-sans font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
            <Link href={`/noticies/${slug}`}>{titol}</Link>
          </h3>
          {cos && (
            <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
              {cos}
            </p>
          )}
          <div className="pt-4 border-t border-neutral-100 mt-auto">
            <Link
              href={`/noticies/${slug}`}
              className="text-xs font-bold text-primary group-hover:underline"
            >
              Veure reportatge fotogràfic →
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // 3. Variant NOTÍCIA estàndard
  return (
    <article className="flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group h-full">
      {/* Portada */}
      {imatge_portada && (
        <Link href={`/noticies/${slug}`} className="block relative aspect-video bg-neutral-100 overflow-hidden">
          <img
            src={imatge_portada}
            alt={titol}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
            Notícia
          </span>
          <span className="text-xs text-neutral-400 font-semibold">
            {formattedDate}
          </span>
        </div>
        <h3 className="font-sans font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
          <Link href={`/noticies/${slug}`}>{titol}</Link>
        </h3>
        {cos && (
          <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
            {cos}
          </p>
        )}
        <div className="pt-4 border-t border-neutral-100 mt-auto">
          <Link
            href={`/noticies/${slug}`}
            className="text-xs font-bold text-primary group-hover:underline"
          >
            Llegir més →
          </Link>
        </div>
      </div>
    </article>
  )
}
