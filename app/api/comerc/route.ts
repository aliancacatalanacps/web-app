import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, categoria, adreca, telefon, web } = body

    if (!nom || nom.trim().length < 3) {
      return NextResponse.json({ error: 'El nom és obligatori i ha de tenir 3 lletres com a mínim.' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('comerc_local')
      .insert([
        {
          nom: nom.trim(),
          categoria: categoria || 'Altres',
          adreca: adreca ? adreca.trim() : null,
          telefon: telefon ? telefon.trim() : null,
          web: web ? web.trim() : null,
          aprovat: false // S'aprovarà des del panell
        }
      ])

    if (error) {
      console.error('Error sol·licitant comerç local:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API Error a comerc:', error)
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 })
  }
}
