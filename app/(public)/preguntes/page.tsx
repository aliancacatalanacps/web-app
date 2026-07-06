import { createClient } from '@/lib/supabase/server'
import { PreguntaCiutadana } from '@/lib/types'
import { MessageSquare, HelpCircle, User, CheckCircle, AlertTriangle } from 'lucide-react'
import PreguntaForm from './PreguntaForm'

export const revalidate = 60 // Revalidació d'un minut per a les preguntes

const fallbackPreguntes: PreguntaCiutadana[] = [
  {
    id: 'pr1',
    nom: "Carles S.",
    pregunta: "Quines mesures proposa Aliança Catalana per augmentar el patrullatge a les nits de cap de setmana a la zona comercial?",
    resposta: "Hem demanat formalment al ple municipal l'increment de patrulles a peu de la Policia Local, especialment en horari de tancament comercial, per oferir un suport directe als nostres botiguers i dissuadir conductes incíviques. Seguirem pressionant l'equip de govern en aquesta direcció.",
    respost: true,
    publicat: true,
    created_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 'pr2',
    nom: "Marta R.",
    pregunta: "Com tenim previst recolzar les associacions i penyes de Castell d'Aro per les festes locals?",
    resposta: "El nostre representant David Schelvis està dissenyant un projecte per simplificar les traves burocràtiques de l'ajuntament i rebaixar les taxes de seguretat i logística que s'apliquen a les penyes locals. Volem que el veïnatge sigui el cor de la festa.",
    respost: true,
    publicat: true,
    created_at: new Date(Date.now() - 864000000).toISOString()
  }
]

export const metadata = {
  title: "Pregunta al Regidor",
  description: "Envia les teves consultes, queixes o suggeriments directament al nostre regidor Aitor Tendero.",
}

export default async function PreguntesPage() {
  let preguntes: PreguntaCiutadana[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('preguntes_ciutadanes')
      .select('*')
      .eq('publicat', true)
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      preguntes = data
    } else {
      preguntes = fallbackPreguntes
    }
  } catch (error) {
    console.error('Error carregant preguntes, usant fallbacks', error)
    preguntes = fallbackPreguntes
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Capçalera */}
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest font-sans">Contacte directe</span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mt-2 newsroom-title">
            Pregunta al Regidor
          </h1>
          <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
            La bústia ciutadana d'Aliança Catalana. Escriu la teva pregunta o suggeriment directament al regidor Aitor Tendero. Responem i publiquem per donar total transparència.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Formulari lateral (Client Component) */}
          <div className="lg:col-span-1 bg-neutral-50 border border-neutral-200 rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="font-sans font-bold text-neutral-900 text-lg mb-2 flex items-center gap-2">
              <MessageSquare className="text-primary" size={20} />
              Envia la teva pregunta
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              La teva pregunta serà tramesa a l'equip. Es respondrà i es podrà publicar en aquest directori. El nom és opcional.
            </p>
            
            <PreguntaForm />
          </div>

          {/* Directori de preguntes contestades */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-sans font-black text-xl text-neutral-900 tracking-tight flex items-center gap-2">
              Preguntes Respostes
              <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded px-2.5 py-1">
                {preguntes.length}
              </span>
            </h3>

            {preguntes.length === 0 ? (
              <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-200 rounded-lg">
                Encara no hi ha preguntes contestades publicades. Sigues el primer a preguntar!
              </div>
            ) : (
              <div className="space-y-6">
                {preguntes.map((pr) => {
                  const formattedDate = new Date(pr.created_at).toLocaleDateString('ca', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })

                  return (
                    <div key={pr.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                      {/* Pregunta */}
                      <div className="p-6 bg-neutral-50/50 border-b border-neutral-100">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-bold">
                            <User size={14} className="text-neutral-400" />
                            <span>{pr.nom || 'Veí anònim'}</span>
                          </div>
                          <time className="text-[10px] text-neutral-400 font-bold uppercase">{formattedDate}</time>
                        </div>
                        <h4 className="font-sans font-bold text-neutral-900 leading-snug flex gap-2">
                          <HelpCircle className="text-primary shrink-0 mt-0.5" size={18} />
                          <span>{pr.pregunta}</span>
                        </h4>
                      </div>

                      {/* Resposta */}
                      {pr.resposta && (
                        <div className="p-6 bg-white flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-white font-extrabold text-[10px] border border-primary-dark">
                            AT
                          </div>
                          <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">Resposta d'Aitor Tendero</span>
                            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                              {pr.resposta}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
