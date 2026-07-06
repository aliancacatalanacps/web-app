import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, email, pregunta } = body

    if (!pregunta || pregunta.trim().length < 10) {
      return NextResponse.json({ error: 'La pregunta ha de tenir almenys 10 caràcters.' }, { status: 400 })
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Cal introduir un correu electrònic vàlid.' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('preguntes_ciutadanes')
      .insert([
        {
          nom: nom ? nom.substring(0, 50) : null,
          email: email.trim(),
          pregunta: pregunta.trim(),
          resposta: null,
          respost: false,
          publicat: false // No visible fins que s'aprovi des de l'admin
        }
      ])

    if (error) {
      console.error('Error insertant pregunta ciutadana:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API Error a preguntes:', error)
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 })
  }
}
