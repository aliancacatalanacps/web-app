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

    // ENVIAR A GOOGLE SHEETS DE DRIVE
    try {
      const { data: configData } = await supabase
        .from('configuracio')
        .select('*')
        .eq('clau', 'google_apps_script_url')
        .single()

      if (configData && configData.valor && configData.valor.startsWith('http')) {
        // Fem fetch asíncron en segon pla (sense bloquejar la resposta del client)
        fetch(configData.valor, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipus: 'butlleti',
            email: email,
            nom: 'Subscriptor Butlletí',
            missatge: 'Nova subscripció al butlletí mensual.',
            data: new Date().toISOString()
          })
        }).catch(err => console.error('Error enviant a Google Sheets:', err))
      }
    } catch (sheetErr) {
      console.error('Error obtingut en enviar al full de càlcul:', sheetErr)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API Error a butlleti:', error)
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 })
  }
}
