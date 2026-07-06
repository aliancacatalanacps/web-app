export type TipusNoticia = 'noticia' | 'premsa' | 'galeria'

export interface Noticia {
  id: string
  tipus: TipusNoticia
  titol: string
  slug: string
  cos: string | null
  data_publicacio: string
  imatge_portada: string | null
  link_extern: string | null
  publicat: boolean
  created_at: string
}

export interface NoticiaFoto {
  id: string
  noticia_id: string
  url: string
  ordre: number
}

export interface Membre {
  id: string
  nom: string
  carrec: string | null
  bio: string | null
  foto: string | null
  ordre: number
  actiu: boolean
  created_at: string
}

export interface Contacte {
  id: string
  nom: string
  email: string
  missatge: string
  llegit: boolean
  created_at: string
}

export interface ButlletiSubscriptor {
  id: string
  email: string
  actiu: boolean
  created_at: string
}

export interface TransparenciaEconomica {
  id: string
  concepte: string
  import: number
  data: string
  descripcio: string | null
  document_url: string | null
}

export interface DadesMunicipi {
  id: string
  nom_indicador: string
  valor: string
  unitat: string | null
  font: string
  data_actualitzacio: string
}

export interface Mocio {
  id: string
  noticia_id: string
  titol: string
  resultat: 'aprovada' | 'rebutjada' | 'retirada'
  vots_favor: number
  vots_contra: number
  abstencions: number
}

export interface PreguntaCiutadana {
  id: string
  nom: string | null
  pregunta: string
  resposta: string | null
  respost: boolean
  publicat: boolean
  created_at: string
}

export interface Compromis {
  id: string
  titol: string
  descripcio: string | null
  estat: 'pendent' | 'en_curs' | 'complert' | 'rebutjat'
  data_actualitzacio: string
}

export interface ComercLocal {
  id: string
  nom: string
  categoria: string | null
  adreca: string | null
  telefon: string | null
  web: string | null
  aprovat: boolean
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      noticies: {
        Row: Noticia
        Insert: Omit<Noticia, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Noticia, 'id' | 'created_at'>>
      }
      noticies_fotos: {
        Row: NoticiaFoto
        Insert: Omit<NoticiaFoto, 'id'> & { id?: string }
        Update: Partial<Omit<NoticiaFoto, 'id'>>
      }
      membres: {
        Row: Membre
        Insert: Omit<Membre, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Membre, 'id' | 'created_at'>>
      }
      contactes: {
        Row: Contacte
        Insert: Omit<Contacte, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Contacte, 'id' | 'created_at'>>
      }
      butlleti_subscriptors: {
        Row: ButlletiSubscriptor
        Insert: Omit<ButlletiSubscriptor, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<ButlletiSubscriptor, 'id' | 'created_at'>>
      }
      transparencia_economica: {
        Row: TransparenciaEconomica
        Insert: Omit<TransparenciaEconomica, 'id'> & { id?: string }
        Update: Partial<Omit<TransparenciaEconomica, 'id'>>
      }
      dades_municipi: {
        Row: DadesMunicipi
        Insert: Omit<DadesMunicipi, 'id'> & { id?: string }
        Update: Partial<Omit<DadesMunicipi, 'id'>>
      }
      mocions: {
        Row: Mocio
        Insert: Omit<Mocio, 'id'> & { id?: string }
        Update: Partial<Omit<Mocio, 'id'>>
      }
      preguntes_ciutadanes: {
        Row: PreguntaCiutadana
        Insert: Omit<PreguntaCiutadana, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<PreguntaCiutadana, 'id' | 'created_at'>>
      }
      compromisos: {
        Row: Compromis
        Insert: Omit<Compromis, 'id'> & { id?: string }
        Update: Partial<Omit<Compromis, 'id'>>
      }
      comerc_local: {
        Row: ComercLocal
        Insert: Omit<ComercLocal, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<ComercLocal, 'id' | 'created_at'>>
      }
    }
  }
}
