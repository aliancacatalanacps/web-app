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
    }
  }
}
