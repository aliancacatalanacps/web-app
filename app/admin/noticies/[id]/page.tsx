import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NoticiaForm from '@/components/admin/NoticiaForm'
import { Noticia } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function AdminEditNoticiaPage({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  let noticia: Noticia | null = null
  let fotos: string[] = []

  try {
    const supabase = await createClient()
    
    // Obtenir notícia
    const { data: dbNoticia } = await supabase
      .from('noticies')
      .select('*')
      .eq('id', id)
      .single()

    if (dbNoticia) {
      noticia = dbNoticia

      // Obtenir fotos
      const { data: dbFotos } = await supabase
        .from('noticies_fotos')
        .select('url')
        .eq('noticia_id', dbNoticia.id)
        .order('ordre', { ascending: true })

      if (dbFotos) {
        fotos = dbFotos.map(f => f.url)
      }
    }
  } catch (error) {
    console.error('Error carregant la notícia per a edició:', error)
  }

  if (!noticia) {
    // Si no es troba la notícia a la base de dades, redirigim a la llista
    redirect('/admin/noticies')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <NoticiaForm initialData={noticia} initialFotos={fotos} />
    </div>
  )
}
