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

    // ENVIAR A GOOGLE SHEETS DE DRIVE
    try {
      const { data: configData } = await supabase
        .from('configuracio')
        .select('*')
        .eq('clau', 'google_apps_script_url')
        .single()

      if (configData && configData.valor && configData.valor.startsWith('http')) {
        fetch(configData.valor, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipus: 'contacte',
            email: email.trim(),
            nom: nom.trim(),
            missatge: missatge.trim(),
            data: new Date().toISOString()
          })
        }).catch(err => console.error('Error enviant contacte a Google Sheets:', err))
      }
    } catch (sheetErr) {
      console.error('Error obtingut en enviar contacte al full de càlcul:', sheetErr)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API Error a contactes:', error)
    return NextResponse.json({ error: 'S\'ha produït un error de servidor' }, { status: 500 })
  }
}
