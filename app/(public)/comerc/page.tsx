import { createClient } from '@/lib/supabase/server'
import { ComercLocal } from '@/lib/types'
import { Store, Tag, MapPin, Phone, Globe, PlusCircle, CheckCircle } from 'lucide-react'
import ComercForm from './ComercForm'

export const revalidate = 3600 // Cache d'una hora per als comerços

const fallbackComerc: ComercLocal[] = [
  {
    id: 'co1',
    nom: "Restaurant Can Lloret",
    categoria: "Restauració",
    adreca: "Avinguda de Cavall Bernat, 45",
    telefon: "972 81 81 81",
    web: "https://www.canlloret.cat",
    aprovat: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'co2',
    nom: "Fruiteria d'Aro",
    categoria: "Alimentació",
    adreca: "Avinguda de S'Agaró, 122",
    telefon: "972 82 12 34",
    web: null,
    aprovat: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'co3',
    nom: "Impremta Aubert",
    categoria: "Serveis",
    adreca: "Carrer del Carme, 8",
    telefon: "972 81 50 50",
    web: "https://www.aubert.cat",
    aprovat: true,
    created_at: new Date().toISOString()
  }
]

export const metadata = {
  title: "Directori de Comerç Local",
  description: "Directori de suport a autònoms i petits comerços de Castell-Platja d'Aro i S'Agaró.",
}

export default async function ComercPage() {
  let comercos: ComercLocal[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('comerc_local')
      .select('*')
      .eq('aprovat', true)
      .order('nom', { ascending: true })

    if (data && data.length > 0) {
      comercos = data
    } else {
      comercos = fallbackComerc
    }
  } catch (error) {
    console.error('Error carregant comerços, usant fallbacks', error)
    comercos = fallbackComerc
  }

  // Agrupem per categoria
  const categories = Array.from(new Set(comercos.map(c => c.categoria || 'Altres')))

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest font-sans">Compromís comercial</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Comerç i Autònoms Locals
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            Donem suport al teixit econòmic local. Aquest és un directori gratuït per a tots els comerços, autònoms i pimes del nostre municipi. Sol·licita l'alta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Formulari d'alta */}
          <div className="lg:col-span-1 bg-neutral-50 border border-neutral-200 rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="font-sans font-bold text-neutral-900 text-lg mb-2 flex items-center gap-2">
              <PlusCircle className="text-primary" size={20} />
              Afegeix el teu negoci
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Ets autònom o tens un comerç a Castell-Platja d'Aro o S'Agaró? Registra't sense cap cost. Es publicarà un cop moderat.
            </p>
            
            <ComercForm />
          </div>

          {/* Llistat agrupats */}
          <div className="lg:col-span-2 space-y-10">
            {categories.map((cat) => {
              const comercosCat = comercos.filter(c => (c.categoria || 'Altres') === cat)

              return (
                <div key={cat} className="space-y-4">
                  <h3 className="font-sans font-black text-lg text-neutral-900 tracking-tight flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Tag className="text-primary shrink-0" size={18} />
                    <span>{cat}</span>
                    <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5 ml-1">
                      {comercosCat.length}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {comercosCat.map((c) => (
                      <div key={c.id} className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-sans font-bold text-neutral-900 text-sm mb-3 flex items-center gap-1.5">
                            <Store size={16} className="text-neutral-400" />
                            {c.nom}
                          </h4>
                          
                          <div className="space-y-2 text-xs text-neutral-500 font-medium">
                            {c.adreca && (
                              <div className="flex items-center gap-2">
                                <MapPin size={13} className="text-neutral-400 shrink-0" />
                                <span>{c.adreca}</span>
                              </div>
                            )}
                            {c.telefon && (
                              <div className="flex items-center gap-2">
                                <Phone size={13} className="text-neutral-400 shrink-0" />
                                <span>{c.telefon}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {c.web && (
                          <div className="mt-4 pt-3 border-t border-neutral-100 flex">
                            <a
                              href={c.web}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                            >
                              <Globe size={12} />
                              Visitar lloc web ↗
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}
