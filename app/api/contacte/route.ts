import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, email, missatge } = body

    if (!nom || !email || !missatge) {
      return NextResponse.json({ error: 'Camps obligatoris absents' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('contactes')
      .insert([
        {
          nom,
          email,
          missatge,
          llegit: false
        }
      ])

    if (error) {
      console.error('Error insertant contacte a Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API Error a contactes:', error)
    return NextResponse.json({ error: 'S\'ha produït un error de servidor' }, { status: 500 })
  }
}
