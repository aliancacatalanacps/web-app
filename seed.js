const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// 1. Llegir variables del fitxer .env.local
let supabaseUrl = ''
let supabaseServiceKey = ''

try {
  const envPath = path.join(__dirname, '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim()
      }
      if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
        supabaseServiceKey = line.split('=')[1].trim()
      }
    }
  }
} catch (e) {
  console.log('Avís: No s\'ha pogut llegir el fitxer .env.local')
}

// Fallback a variables d'entorn globals de l'entorn de terminal
supabaseUrl = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
supabaseServiceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project-id')) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Configura primer el teu fitxer .env.local amb les credencials reals del teu projecte a supabase.com per poder connectar la base de dades!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const noticiesData = [
  {
    tipus: 'noticia',
    titol: "Aliança Catalana demana reforçar la seguretat i aplicar un pla de civisme integral a Platja d'Aro per a la temporada d'estiu",
    slug: 'reforc-seguretat-pla-civisme-estiu',
    cos: "El regidor i portaveu Aitor Tendero demana mesures fermes davant l'augment del turisme per garantir el descans dels veïns i recolzar els comerciants locals del municipi.\n\nProposem augmentar els patrullatges preventius de la Policia Local a les zones comercials i d'oci nocturn, i sancionar amb severitat el soroll i les actituds incíviques per assegurar que Platja d'Aro segueixi sent una destinació acollidora i segura. Treballem cada dia per mantenir l'ordre i el benestar de la nostra comunitat.",
    data_publicacio: new Date().toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    link_extern: null,
    publicat: true
  },
  {
    tipus: 'premsa',
    titol: "Aitor Tendero a Ràdio Platja d'Aro: 'Cal una regulació equilibrada per defensar els petits propietaris d'habitatges turístics'",
    slug: 'aitor-tendero-declaracions-habitatge-turistic',
    cos: "El portaveu municipal d'Aliança Catalana defensa els autònoms i petits propietaris de la Vall d'Aro davant les noves restriccions que amenacen l'economia familiar.",
    data_publicacio: new Date(Date.now() - 86400000).toISOString(),
    imatge_portada: null,
    link_extern: 'https://www.rpa.cat',
    publicat: true
  },
  {
    tipus: 'noticia',
    titol: "David Schelvis proposa un pla de dinamització per recolzar les entitats, penyes i associacions culturals de Castell i Platja d'Aro",
    slug: 'david-schelvis-pla-dinamitzacio-entitats-locals',
    cos: "El representant de l'equip local proposa simplificar la burocràcia municipal i crear noves línies de suport directe per reactivar l'activitat de les associacions esportives i de lleure que formen la identitat del nostre municipi.\n\nHem recollit propostes de diverses entitats locals per dissenyar un suport econòmic flexible que els permeti seguir dinamitzant Castell-Platja d'Aro i S'Agaró.",
    data_publicacio: new Date(Date.now() - 172800000).toISOString(),
    imatge_portada: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    link_extern: null,
    publicat: true
  }
]

const membresData = [
  {
    nom: "Aitor Tendero i Guirado",
    carrec: "Portaveu i Regidor Municipal",
    bio: "Graduat en Ciències Polítiques i de l'Administració (UPF). Emprenedor local amb àmplia experiència internacional (Austràlia). Regidor i portaveu a l'Ajuntament de Castell-Platja d'Aro i S'Agaró, on treballa activament en comissions de Turisme, Promoció Econòmica i Esports. Defensor de la identitat nacional i la seguretat ciutadana.",
    foto: null,
    ordre: 1,
    actiu: true
  },
  {
    nom: "David Schelvis i Gibert",
    carrec: "Coordinador d'Esdeveniments i Entitats",
    bio: "Empresari especialitzat en la gestió i organització d'esdeveniments d'oci, cultura i esports a Platja d'Aro. President de l'Associació Penya Barça Fans d'Aro i promotor actiu del teixit social, turístic i cultural local.",
    foto: null,
    ordre: 2,
    actiu: true
  }
]

async function seed() {
  console.log('Iniciant alimentació de dades a Supabase...')

  try {
    // 1. Esborrar dades anteriors per evitar duplicats
    console.log('Netejant dades anteriors de notícies i membres...')
    await supabase.from('noticies').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('membres').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // 2. Inserir Membres
    console.log('Inserint membres de l\'equip...')
    const { error: membresError } = await supabase.from('membres').insert(membresData)
    if (membresError) throw membresError

    // 3. Inserir Notícies
    console.log('Inserint notícies municipals...')
    const { data: insertedNoticies, error: noticiesError } = await supabase.from('noticies').insert(noticiesData).select()
    if (noticiesError) throw noticiesError

    // 4. Inserir Fotos per a Galeria
    console.log('Inserint fotos de la galeria per David Schelvis...')
    const noticiaGaleria = insertedNoticies.find(n => n.slug === 'david-schelvis-pla-dinamitzacio-entitats-locals')
    if (noticiaGaleria) {
      const fotosData = [
        { noticia_id: noticiaGaleria.id, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', ordre: 1 },
        { noticia_id: noticiaGaleria.id, url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', ordre: 2 },
        { noticia_id: noticiaGaleria.id, url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80', ordre: 3 }
      ]
      const { error: fotosError } = await supabase.from('noticies_fotos').insert(fotosData)
      if (fotosError) throw fotosError
    }

    console.log('\x1b[32m%s\x1b[0m', '✅ Procés completat amb èxit! La teva base de dades de Supabase ja està configurada amb les dades reals dels teus candidats i notícies municipals.')
  } catch (error) {
    console.error('Error durant el procés d\'alimentació de dades:', error)
  }
}

seed()
