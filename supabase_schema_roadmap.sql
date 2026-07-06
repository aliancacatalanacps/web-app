-- ==========================================
-- ROADMAP FASES 2 A 5 (Aliança Catalana Platja d'Aro)
-- Executa aquestes consultes a mesura que activis cada nova fase.
-- Aquest script és completament idempotent (es pot executar múltiples vegades).
-- ==========================================

-- === FASE 2: BUTLLETÍ, TRANSPARÈNCIA I DADES DEL MUNICIPI ===

-- Subscriptors del butlletí mensual
create table if not exists public.butlleti_subscriptors (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  actiu boolean default true,
  created_at timestamptz default now()
);

-- Línies de transparència econòmica
create table if not exists public.transparencia_economica (
  id uuid primary key default gen_random_uuid(),
  concepte text not null,
  import numeric not null,
  data date not null default current_date,
  descripcio text,
  document_url text, -- enllaç de justificació en format PDF a Storage
  created_at timestamptz default now()
);

-- Indicadors de dades de Platja d'Aro en obert
create table if not exists public.dades_municipi (
  id uuid primary key default gen_random_uuid(),
  nom_indicador text not null,
  valor text not null,
  unitat text,
  font text not null, -- font oficial del municipi citada
  data_actualitzacio date not null default current_date,
  created_at timestamptz default now()
);

-- Habilitar RLS per a Fase 2
alter table public.butlleti_subscriptors enable row level security;
alter table public.transparencia_economica enable row level security;
alter table public.dades_municipi enable row level security;

-- Polítiques RLS Fase 2
drop policy if exists "Permetre inserció pública de butlletins" on public.butlleti_subscriptors;
create policy "Permetre inserció pública de butlletins"
  on public.butlleti_subscriptors for insert
  with check (true);

drop policy if exists "Permetre CRUD de butlletins als admins" on public.butlleti_subscriptors;
create policy "Permetre CRUD de butlletins als admins"
  on public.butlleti_subscriptors for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Permetre lectura pública de transparència" on public.transparencia_economica;
create policy "Permetre lectura pública de transparència"
  on public.transparencia_economica for select
  using (true);

drop policy if exists "Permetre CRUD de transparència als admins" on public.transparencia_economica;
create policy "Permetre CRUD de transparència als admins"
  on public.transparencia_economica for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Permetre lectura pública de dades municipals" on public.dades_municipi;
create policy "Permetre lectura pública de dades municipals"
  on public.dades_municipi for select
  using (true);

drop policy if exists "Permetre CRUD de dades municipals als admins" on public.dades_municipi;
create policy "Permetre CRUD de dades municipals als admins"
  on public.dades_municipi for all
  to authenticated
  using (true)
  with check (true);


-- === FASE 3: MOCIONS VINCULADES A PLENS ===

-- Mocions vinculades a plens (entrades de tipus = noticia)
create table if not exists public.mocions (
  id uuid primary key default gen_random_uuid(),
  noticia_id uuid references public.noticies(id) on delete cascade,
  titol text not null,
  resultat text check (resultat in ('aprovada', 'rebutjada', 'retirada')),
  vots_favor int default 0,
  vots_contra int default 0,
  abstencions int default 0,
  created_at timestamptz default now()
);

-- Habilitar RLS per a Fase 3
alter table public.mocions enable row level security;

-- Polítiques RLS Fase 3
drop policy if exists "Permetre lectura pública de mocions" on public.mocions;
create policy "Permetre lectura pública de mocions"
  on public.mocions for select
  using (true);

drop policy if exists "Permetre CRUD de mocions als admins" on public.mocions;
create policy "Permetre CRUD de mocions als admins"
  on public.mocions for all
  to authenticated
  using (true)
  with check (true);


-- === FASE 4: PREGUNTA AL REGIDOR I COMPROMISOS ===

-- Preguntes ciutadanes (formulari de bústia pública controlat per l'equip)
create table if not exists public.preguntes_ciutadanes (
  id uuid primary key default gen_random_uuid(),
  nom text,
  pregunta text not null,
  resposta text,
  respost boolean default false,
  publicat boolean default false, -- moderació de publicació
  created_at timestamptz default now()
);

-- Compromisos electorals/locals
create table if not exists public.compromisos (
  id uuid primary key default gen_random_uuid(),
  titol text not null,
  descripcio text,
  estat text check (estat in ('pendent', 'en_curs', 'complert', 'rebutjat')),
  data_actualitzacio date not null default current_date,
  created_at timestamptz default now()
);

-- Habilitar RLS per a Fase 4
alter table public.preguntes_ciutadanes enable row level security;
alter table public.compromisos enable row level security;

-- Polítiques RLS Fase 4
drop policy if exists "Permetre inserció pública de preguntes" on public.preguntes_ciutadanes;
create policy "Permetre inserció pública de preguntes"
  on public.preguntes_ciutadanes for insert
  with check (true);

drop policy if exists "Permetre lectura pública de preguntes contestades i publicades" on public.preguntes_ciutadanes;
create policy "Permetre lectura pública de preguntes contestades i publicades"
  on public.preguntes_ciutadanes for select
  using (publicat = true);

drop policy if exists "Permetre CRUD de preguntes als admins" on public.preguntes_ciutadanes;
create policy "Permetre CRUD de preguntes als admins"
  on public.preguntes_ciutadanes for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Permetre lectura pública de compromisos" on public.compromisos;
create policy "Permetre lectura pública de compromisos"
  on public.compromisos for select
  using (true);

drop policy if exists "Permetre CRUD de compromisos als admins" on public.compromisos;
create policy "Permetre CRUD de compromisos als admins"
  on public.compromisos for all
  to authenticated
  using (true)
  with check (true);


-- === FASE 5: DIRECTORI DE COMERÇ LOCAL ===

-- Directori de comerç local
create table if not exists public.comerc_local (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  categoria text,
  adreca text,
  telefon text,
  web text,
  aprovat boolean default false, -- moderació prèvia
  created_at timestamptz default now()
);

-- Habilitar RLS per a Fase 5
alter table public.comerc_local enable row level security;

-- Polítiques RLS Fase 5
drop policy if exists "Permetre lectura pública de comerços aprovats" on public.comerc_local;
create policy "Permetre lectura pública de comerços aprovats"
  on public.comerc_local for select
  using (aprovat = true);

drop policy if exists "Permetre inserció de sol·licitud pública de comerç" on public.comerc_local;
create policy "Permetre inserció de sol·licitud pública de comerç"
  on public.comerc_local for insert
  with check (true);

drop policy if exists "Permetre CRUD de comerços als admins" on public.comerc_local;
create policy "Permetre CRUD de comerços als admins"
  on public.comerc_local for all
  to authenticated
  using (true)
  with check (true);
