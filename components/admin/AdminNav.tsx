'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  LogOut,
  Landmark,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  Store,
  MailQuestion
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Enllaços principals que es mostren a la barra inferior del mòbil (max 4 per espai)
const mobileLinks = [
  { href: '/admin', label: 'Inici', icon: LayoutDashboard },
  { href: '/admin/noticies', label: 'Notícies', icon: FileText },
  { href: '/admin/contactes', label: 'Missatges', icon: Mail },
]

// Tots els enllaços per a la barra lateral de l'escriptori
const desktopLinks = [
  { href: '/admin', label: 'Inici', icon: LayoutDashboard },
  { href: '/admin/noticies', label: 'Notícies', icon: FileText },
  { href: '/admin/membres', label: 'Equip', icon: Users },
  { href: '/admin/contactes', label: 'Missatges', icon: Mail },
  { href: '/admin/butlleti', label: 'Butlletí', icon: MailQuestion },
  { href: '/admin/transparencia', label: 'Transparència', icon: Landmark },
  { href: '/admin/dades', label: 'Dades municipi', icon: TrendingUp },
  { href: '/admin/preguntes', label: 'Bústia preguntes', icon: HelpCircle },
  { href: '/admin/compromisos', label: 'Compromisos', icon: ShieldCheck },
  { href: '/admin/comerc', label: 'Comerços', icon: Store },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* 1. NAVEGACIÓ MÒBIL (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 flex justify-around items-center h-16 pb-safe shadow-lg">
        {mobileLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-bold uppercase tracking-wider ${
                isActive ? 'text-primary' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span>{link.label}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-full h-full text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-red-600"
          aria-label="Tancar sessió"
        >
          <LogOut size={20} className="mb-1" />
          <span>Sortir</span>
        </button>
      </nav>

      {/* 2. NAVEGACIÓ DESKTOP (Sidebar) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 bg-white h-screen fixed top-0 left-0 p-6 z-30 overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-white font-extrabold text-sm border border-primary-dark">
            AC
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-xs tracking-tight text-neutral-900 leading-none">Aliança Catalana</span>
            <span className="font-sans text-[8px] font-semibold text-primary tracking-widest uppercase mt-0.5 leading-none">Platja d'Aro</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1">
          {desktopLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-bold transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="pt-6 border-t border-neutral-100 shrink-0 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded text-xs font-bold text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span>Tancar sessió</span>
          </button>
        </div>
      </aside>
    </>
  )
}
