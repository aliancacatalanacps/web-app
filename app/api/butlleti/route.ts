import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Correu electrònic invàlid' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('butlleti_subscriptors')
      .insert([{ email, actiu: true }])

    if (error) {
      // Codi de clau duplicada a Postgres és 23505
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Aquest correu ja està subscrit.' }, { status: 400 })
      }
      console.error('Error insertant subscriptor:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API Error a butlleti:', error)
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 })
  }
}
