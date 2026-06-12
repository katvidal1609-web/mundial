# Mundial 2026 · LATAM Hub

Página de datos del Mundial 2026 orientada al público hispanohablante de Perú y LATAM. Resultados en vivo, predicciones, simulador de bracket y datos curiosos.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Deploy a Vercel (paso a paso)

### 1. Clonar y preparar

```bash
git init
git add .
git commit -m "chore: initial commit"
```

Subí el repo a GitHub (o GitLab/Bitbucket).

### 2. Crear proyecto en Vercel

- Andá a [vercel.com](https://vercel.com) → **New Project**
- Importá tu repo
- Framework preset: **Next.js** (se detecta automáticamente)
- Root directory: `.` (raíz)

### 3. Variables de entorno en Vercel

En el dashboard de Vercel → Settings → Environment Variables, agregar:

| Variable | Valor | Requerida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://XXXXX.supabase.co` | Para predicciones |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Para predicciones |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.vercel.app` | Para OG image/links |
| `NEXT_PUBLIC_YAPE_LINK` | `https://yape.com.pe/yape/TU_USUARIO` | Opcional |
| `ANTHROPIC_API_KEY` | Clave de API de Anthropic | Para sección "Análisis del día" |
| `WC2026_API_KEY` | Tu key de wc2026api.com | Opcional |

### 4. Deploy

Vercel hace el deploy automáticamente al hacer push. El primer deploy puede tardar ~2 minutos.

---

## Supabase — configurar votos (Paso 3 del sistema)

### Crear la tabla

En el **SQL Editor** de tu proyecto Supabase, ejecutar:

```sql
-- Tabla de votos
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  match_id text not null,
  choice text not null check (choice in ('team1', 'draw', 'team2')),
  created_at timestamptz default now() not null
);

-- Índice para queries rápidas por match
create index votes_match_id_idx on votes (match_id);

-- Row Level Security
alter table votes enable row level security;

-- Política: cualquiera puede insertar (un voto)
create policy "allow anon insert"
  on votes for insert
  to anon
  with check (true);

-- Política: cualquiera puede leer votos (para mostrar porcentajes)
create policy "allow anon select"
  on votes for select
  to anon
  using (true);
```

### Tablas adicionales para IA

```sql
-- Cache de análisis IA (generado una vez por día)
create table if not exists ai_cache (
  date text primary key,
  content jsonb not null,
  generated_at timestamptz default now() not null
);

alter table ai_cache enable row level security;

create policy "allow anon select"
  on ai_cache for select to anon using (true);

create policy "allow anon insert"
  on ai_cache for insert to anon with check (true);

create policy "allow anon update"
  on ai_cache for update to anon using (true);

-- Contador de generaciones por día (rate limit: max 50/día)
create table if not exists ai_requests (
  date text primary key,
  count int not null default 0
);

alter table ai_requests enable row level security;

create policy "allow anon select"
  on ai_requests for select to anon using (true);

create policy "allow anon insert"
  on ai_requests for insert to anon with check (true);

create policy "allow anon update"
  on ai_requests for update to anon using (true);
```

### Obtener las keys

1. Ve a **Settings → API** en tu proyecto Supabase
2. Copia la **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copia la **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar env
cp .env.example .env.local
# Editar .env.local con tus keys

# 3. Generar snapshot de datos (opcional, ya viene incluido)
node scripts/generate-snapshot.mjs

# 4. Correr en modo dev
npm run dev
# Abrir http://localhost:3000
```

---

## Arquitectura

```
app/
  page.tsx              → Home con ISR (revalidate: 60s)
  layout.tsx            → SEO, OG metadata
  og-image/route.tsx    → OG image dinámica (Edge)
  api/
    fixture/route.ts    → Proxy de openfootball con cache
    votes/route.ts      → GET/POST votos a Supabase

components/
  TabsShell.tsx         → Navegación entre las 4 tabs
  LatamRanking.tsx      → Tabla LATAM con grupos expandibles
  Predictions.tsx       → Cards de votación por partido
  BracketSimulator.tsx  → Bracket interactivo hasta la final
  CuriousFacts.tsx      → Stats en vivo + facts editoriales

lib/
  fixture.ts            → Fetch, parseo y cálculo de standings
  supabase.ts           → Cliente Supabase + helpers de votos
  flags.ts              → Emojis de banderas + constantes LATAM
  types.ts              → TypeScript interfaces

data/
  fixture-snapshot.json → Fallback local (104 partidos)
```

## Fuente de datos

- **Principal:** [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) — dominio público, sin API key, actualizado por la comunidad
- **Fallback:** snapshot local generado en build time (`node scripts/generate-snapshot.mjs`)
- Revalidación ISR cada 60 segundos

## Actualizar el snapshot

```bash
node scripts/generate-snapshot.mjs
```

Recomendado correrlo antes de cada deploy importante para tener un fallback fresco.
