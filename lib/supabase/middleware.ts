import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sessió d'usuari
  const { data: { user } } = await supabase.auth.getUser()

  // Comprovar rol de l'usuari si està loggejat
  let role = 'user'
  if (user) {
    try {
      const { data: perfil } = await supabase
        .from('usuaris')
        .select('role')
        .eq('id', user.id)
        .single()
      if (perfil) role = perfil.role
    } catch (e) {
      console.error('Error consultant rol de l\'usuari al middleware:', e)
    }
  }

  // A. Protecció de la zona d'Administració (/admin)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Si no està loggejat i no està intentant anar a login, redirigir a login d'admin o de ciutadà
    if (!user && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Si està loggejat però NO és admin, redirigir al tauler ciutadà (ja que és un ciutadà ordinari)
    if (user && role !== 'admin' && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/tauler'
      return NextResponse.redirect(url)
    }

    // Si és admin i intenta anar al login d'admin, el redirigim al panell d'admin
    if (user && role === 'admin' && request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  // B. Protecció de la zona de Ciutadans (/tauler)
  if (request.nextUrl.pathname.startsWith('/tauler')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
