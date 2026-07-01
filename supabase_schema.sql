-- Base de dades per a Aliança Catalana Platja d'Aro

-- 1. Taula de Notícies (noticia, premsa, galeria)
create table if not exists public.noticies (
  id uuid primary key default gen_random_uuid(),
  tipus text not null check (tipus in ('noticia', 'premsa', 'galeria')),
  titol text not null,
  slug text unique not null,
  cos text,                    -- cos del text en markdown o HTML
  data_publicacio timestamptz not null default now(),
  imatge_portada text,         -- url de la imatge a Supabase Storage
  link_extern text,            -- només rellevant per a tipus = 'premsa'
  publicat boolean default true,
  created_at timestamptz default now()
);

-- 2. Taula de Fotos per a Galeries o Notícies amb múltiples fotos
create table if not exists public.noticies_fotos (
  id uuid primary key default gen_random_uuid(),
  noticia_id uuid references public.noticies(id) on delete cascade,
  url text not null,
  ordre int default 0
);

-- 3. Taula de Membres de l'Equip (Qui som)
create table if not exists public.membres (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  carrec text,
  bio text,
  foto text,                   -- url de la foto a Supabase Storage
  ordre int default 0,
  actiu boolean default true,
  created_at timestamptz default now()
);

-- 4. Taula de Contactes (Formulari públic)
create table if not exists public.contactes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  missatge text not null,
  llegit boolean default false,
  created_at timestamptz default now()
);

-- Habilitar Row Level Security (RLS)
alter table public.noticies enable row level security;
alter table public.noticies_fotos enable row level security;
alter table public.membres enable row level security;
alter table public.contactes enable row level security;

-- POLÍTIQUES RLS --

-- noticies: Lectura pública si està publicat. Escriptura només per a usuaris autenticats (admins)
create policy "Permetre lectura pública de notícies publicades"
  on public.noticies for select
  using (publicat = true);

create policy "Permetre CRUD complet de notícies als admins"
  on public.noticies for all
  to authenticated
  using (true)
  with check (true);

-- noticies_fotos: Lectura pública. Escriptura només per a usuaris autenticats (admins)
create policy "Permetre lectura pública de fotos de notícies"
  on public.noticies_fotos for select
  using (true);

create policy "Permetre CRUD complet de fotos als admins"
  on public.noticies_fotos for all
  to authenticated
  using (true)
  with check (true);

-- membres: Lectura pública si està actiu. Escriptura només per a usuaris autenticats (admins)
create policy "Permetre lectura pública de membres actius"
  on public.membres for select
  using (actiu = true);

create policy "Permetre CRUD complet de membres als admins"
  on public.membres for all
  to authenticated
  using (true)
  with check (true);

-- contactes: Creació pública (inserció). Lectura i modificació només per a usuaris autenticats (admins)
create policy "Permetre inserció pública de contactes"
  on public.contactes for insert
  with check (true);

create policy "Permetre lectura i modificació de contactes als admins"
  on public.contactes for all
  to authenticated
  using (true)
  with check (true);

-- 5. Creació del bucket de Storage 'media' (si no existeix)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Polítiques per al Storage Bucket 'media'
create policy "Permetre lectura pública de fitxers de media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Permetre pujada de fitxers de media als admins"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Permetre modificació i esborrat als admins"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "Permetre esborrat de fitxers als admins"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
