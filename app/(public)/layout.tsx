import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let config: Record<string, string> = {}

  try {
    const supabase = await createClient()
    const { data } = await supabase.from('configuracio').select('*')
    if (data) {
      data.forEach((row) => {
        config[row.clau] = row.valor
      })
    }
  } catch (error) {
    console.error('Error carregant configuració global al layout:', error)
  }

  return (
    <>
      <Header config={config} />
      <div className="flex-1">
        {children}
      </div>
      <Footer config={config} />
    </>
  )
}
