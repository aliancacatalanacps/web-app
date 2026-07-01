import AdminNav from '@/components/admin/AdminNav'

export const metadata = {
  title: "AC Platja d'Aro — Administració",
  description: "Panell d'administració",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 md:pl-64 pb-20 md:pb-0 min-h-screen">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
