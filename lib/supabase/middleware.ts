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

  // Si l'usuari intenta accedir a /admin i no està autenticat, el redirigim a /admin/login
  // (excepte si ja està a /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Si ja està autenticat i intenta anar a /admin/login, el redirigim a /admin
    if (user && request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
