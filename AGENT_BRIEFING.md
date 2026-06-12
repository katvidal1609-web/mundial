# AGENT BRIEFING — Mundial 2026 LATAM Hub Redesign

## Project
Next.js 14 App Router · TypeScript · Tailwind CSS
Path: `/Users/katvidali/MUNDIAL WEBSITE`

## Design Tokens (Tailwind classes)
| Token | Class | Hex |
|---|---|---|
| Dark pitch | `bg-pitch-dark` | #0a1f0a |
| Mid pitch | `bg-pitch-mid` | #152b15 |
| Accent green | `text-accent-green` / `bg-accent-green` | #22c55e |
| Accent green light | `bg-accent-green-light` | #dcfce7 |
| Text on dark | `text-on-dark` | #f0fdf4 |

**Section pattern:** alternating dark / light / dark / light / dark / light
1. Hero → `bg-pitch-dark` (dark)
2. RankingAndPredictions → `bg-white dark:bg-gray-950` (light)
3. AIAnalysis → `bg-pitch-mid` (dark)
4. CuriousFacts → `bg-white dark:bg-gray-950` (light)
5. BracketSimulator → `bg-pitch-dark` (dark)
6. YapeFooter → `bg-white dark:bg-gray-950` (light)

## Section → File Ownership
- `components/Hero.tsx` — full-width dark hero + navbar
- `components/RankingAndPredictions.tsx` — NEW — two-col ranking+voting
- `components/AIAnalysis.tsx` — AI section (dark bg)
- `components/CuriousFacts.tsx` — stats grid (light bg)
- `components/BracketSimulator.tsx` — bracket (dark bg)
- `components/YapeFooter.tsx` — NEW — support/footer (light bg)

## Key Lib Imports (DO NOT modify lib/ files)
```typescript
import type { Match } from '@/lib/types'
import { fetchFixture, getGroupStandings, calcStats, getPlayedMatches, getPendingMatches, getLatamMatches } from '@/lib/fixture'
import { getFlag, LATAM_TEAMS, LATAM_GROUPS } from '@/lib/flags'
import { t, tGroup } from '@/lib/translations'
import { supabase, submitVote, getVotes } from '@/lib/supabase'
import type { VoteChoice } from '@/lib/supabase'
import { getPassPct, LATAM_STARS, FIFA_RANKINGS } from '@/lib/bettingData'
```

## Match Interface
```typescript
interface Match {
  round: string; date: string; time: string
  team1: string; team2: string
  score?: { ft: [number, number]; ht?: [number, number] }
  goals1?: { name: string; minute: string }[]
  goals2?: { name: string; minute: string }[]
  group?: string; ground?: string
}
```

## Layout Rules
- Inner containers: `max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8`
- Each section is full-width — manages its own padding
- Desktop-first: `grid-cols-2` / `grid-cols-3`, stack on mobile with `sm:` or `lg:` prefix
- Min viewport: 375px

## Strict Rules
1. NO inline styles — Tailwind classes only
2. NO modifying lib/, data/, api/ files
3. NO running npm commands (orchestrator runs build)
4. Props interface MUST match exactly what page.tsx passes
5. TypeScript: no `any` unless unavoidable — prefer `unknown` and narrow
6. 'use client' only on components with useState/useEffect/event handlers
