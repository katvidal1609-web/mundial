'use client'

import { useState, useMemo } from 'react'
import type { Match } from '@/lib/types'
import { getGroupStandings } from '@/lib/fixture'
import { getFlag } from '@/lib/flags'
import { t } from '@/lib/translations'

const abbr = (name: string, max = 18) =>
  name.length > max ? name.slice(0, max - 1) + '…' : name

// Knockout match definition (indices 73–104 in fixture, 0-based: 72–103)
interface KnockoutSlot {
  matchNum: number  // 73–104
  round: string
  date: string
  venue: string
  slot1: string  // "1A", "W73", etc.
  slot2: string
  team1?: string
  team2?: string
  winner?: string
}

// Build initial bracket slots from fixture knockout matches
const R32_DEFS: { num: number; slot1: string; slot2: string; venue: string; date: string }[] = [
  { num: 73, slot1: '2A', slot2: '2B', venue: 'Los Angeles', date: '28 Jun' },
  { num: 74, slot1: '1E', slot2: '3°', venue: 'Boston', date: '29 Jun' },
  { num: 75, slot1: '1F', slot2: '2C', venue: 'Monterrey', date: '29 Jun' },
  { num: 76, slot1: '1C', slot2: '2F', venue: 'Houston', date: '29 Jun' },
  { num: 77, slot1: '1I', slot2: '3°', venue: 'New York/NJ', date: '30 Jun' },
  { num: 78, slot1: '2E', slot2: '2I', venue: 'Dallas', date: '30 Jun' },
  { num: 79, slot1: '1A', slot2: '3°', venue: 'Ciudad de México', date: '30 Jun' },
  { num: 80, slot1: '1L', slot2: '3°', venue: 'Atlanta', date: '1 Jul' },
  { num: 81, slot1: '1D', slot2: '3°', venue: 'San Francisco', date: '1 Jul' },
  { num: 82, slot1: '1G', slot2: '3°', venue: 'Seattle', date: '1 Jul' },
  { num: 83, slot1: '2K', slot2: '2L', venue: 'Toronto', date: '2 Jul' },
  { num: 84, slot1: '1H', slot2: '2J', venue: 'Los Angeles', date: '2 Jul' },
  { num: 85, slot1: '1B', slot2: '3°', venue: 'Vancouver', date: '2 Jul' },
  { num: 86, slot1: '1J', slot2: '2H', venue: 'Miami', date: '3 Jul' },
  { num: 87, slot1: '1K', slot2: '3°', venue: 'Kansas City', date: '3 Jul' },
  { num: 88, slot1: '2D', slot2: '2G', venue: 'Dallas', date: '3 Jul' },
]

const R16_PAIRS = [
  [74, 77], [73, 75], [76, 78], [79, 80],
  [83, 84], [81, 82], [86, 88], [85, 87],
]

const QF_PAIRS = [
  [89, 90], [93, 94], [91, 92], [95, 96],
]

const SF_PAIRS = [
  [97, 98], [99, 100],
]

function resolveGroupSlot(slot: string, standings: Map<string, { position: number; team: string }[]>): string {
  // slot like "1A", "2B", "3°"
  if (slot === '3°') return '3° mejor'
  const pos = parseInt(slot[0])
  const group = slot[1]
  const groupTable = standings.get(group)
  if (!groupTable || groupTable.length < pos) return slot
  return groupTable[pos - 1]?.team ?? slot
}

export default function BracketSimulator({ matches }: { matches: Match[] }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundial2026latam.vercel.app'

  // Build group standings map
  const groupStandings = useMemo(() => {
    const map = new Map<string, { position: number; team: string }[]>()
    const groups = ['A','B','C','D','E','F','G','H','I','J','K','L']
    for (const g of groups) {
      const table = getGroupStandings(matches, g)
      map.set(g, table.map((t, i) => ({ position: i + 1, team: t.team })))
    }
    return map
  }, [matches])

  // Resolve R32 slots from current standings (projected)
  const r32Initial = useMemo(() => {
    return R32_DEFS.map((d) => ({
      ...d,
      team1: resolveGroupSlot(d.slot1, groupStandings),
      team2: resolveGroupSlot(d.slot2, groupStandings),
      winner: undefined as string | undefined,
    }))
  }, [groupStandings])

  // Bracket state: matchNum → winner team
  const [winners, setWinners] = useState<Record<number, string>>({})

  const getWinner = (matchNum: number): string | undefined => winners[matchNum]

  const setWinner = (matchNum: number, team: string) => {
    setWinners((prev) => {
      const next = { ...prev, [matchNum]: team }
      // Clear downstream winners when changed
      const clearDownstream = (mn: number) => {
        const r16idx = R16_PAIRS.findIndex((p) => p.includes(mn))
        if (r16idx >= 0) {
          const r16num = 89 + r16idx
          if (next[r16num]) {
            delete next[r16num]
            clearDownstream(r16num)
          }
        }
        const qfidx = QF_PAIRS.findIndex((p) => p.includes(mn))
        if (qfidx >= 0) {
          const qfnum = 97 + qfidx
          if (next[qfnum]) {
            delete next[qfnum]
            clearDownstream(qfnum)
          }
        }
        const sfidx = SF_PAIRS.findIndex((p) => p.includes(mn))
        if (sfidx >= 0) {
          const sfnum = 101 + sfidx
          if (next[sfnum]) {
            delete next[sfnum]
          }
        }
        if (mn === 101 || mn === 102) delete next[104]
      }
      clearDownstream(matchNum)
      return next
    })
  }

  // Get team for a round slot (winner of matchNum)
  const getTeamFromMatch = (matchNum: number): string | undefined => {
    return winners[matchNum]
  }

  // R32 teams
  const r32 = r32Initial

  // R16 matches (89–96)
  const r16 = R16_PAIRS.map(([a, b], i) => ({
    num: 89 + i,
    team1: getWinner(a),
    team2: getWinner(b),
    src1: a,
    src2: b,
  }))

  // QF matches (97–100)
  const qf = QF_PAIRS.map(([a, b], i) => ({
    num: 97 + i,
    team1: getWinner(a),
    team2: getWinner(b),
    src1: a,
    src2: b,
  }))

  // SF matches (101–102)
  const sf = SF_PAIRS.map(([a, b], i) => ({
    num: 101 + i,
    team1: getWinner(a),
    team2: getWinner(b),
    src1: a,
    src2: b,
  }))

  // Final (104)
  const finalMatch = {
    num: 104,
    team1: getWinner(101),
    team2: getWinner(102),
  }

  const champion = getWinner(104)
  const [copied, setCopied] = useState(false)

  const shareChampion = async () => {
    if (!champion) return
    const text = `Mi campeón del Mundial 2026 es ${getFlag(champion)} ${t(champion)} — armá tu llave en ${SITE_URL}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const MatchSlot = ({
    matchNum,
    team1,
    team2,
    small = false,
    label,
  }: {
    matchNum: number
    team1?: string
    team2?: string
    small?: boolean
    label?: string
  }) => {
    const w = getWinner(matchNum)
    const ready = !!(team1 && team2)

    return (
      <div className={`${small ? 'min-w-[150px] p-2' : 'min-w-[160px] p-3'} bg-white/5 border border-white/10 rounded-xl`}>
        {label && (
          <div className="text-[10px] text-on-dark/40 font-medium mb-1.5 uppercase tracking-wide">{label}</div>
        )}
        {[
          { key: 'team1', team: team1 },
          { key: 'team2', team: team2 },
        ].map(({ key, team }) => {
          const isWinner = w === team
          return (
            <button
              key={key}
              onClick={() => team && ready && setWinner(matchNum, team)}
              disabled={!ready}
              className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all text-left
                ${isWinner
                  ? 'bg-accent-green text-pitch-dark font-bold'
                  : team && ready
                    ? 'hover:bg-white/10 text-on-dark cursor-pointer'
                    : 'opacity-30 cursor-default text-on-dark/50'
                }`}
            >
              {team ? (
                <>
                  <span className={small ? 'text-base' : 'text-xl'}>{getFlag(team)}</span>
                  <span className={small ? 'text-[11px]' : 'text-xs'}>
                    {small ? abbr(t(team), 14) : t(team)}
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-on-dark/30 italic">Por definir</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-pitch-dark w-full">
      <div className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="mb-8">
            <p className="text-[11px] font-bold text-accent-green uppercase tracking-[0.2em] mb-2">
              SIMULADOR INTERACTIVO
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-on-dark mb-2">
              🏆 Simulador de Llave
            </h2>
            <p className="text-on-dark/50 text-sm">
              Tocá un equipo para avanzarlo · proyectado desde standings actuales
            </p>
          </div>

          {/* Champion Banner */}
          {champion && (
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-2xl p-6 text-center mb-6">
              <div className="text-5xl mb-2">{getFlag(champion)}</div>
              <div className="text-2xl font-black text-accent-green">
                {t(champion)} — Campeón 🏆
              </div>
              <button
                onClick={shareChampion}
                className="mt-3 px-5 py-2 rounded-full bg-accent-green text-pitch-dark text-sm font-bold hover:bg-accent-green/80 transition-colors"
              >
                {copied ? '¡Copiado! 🎉' : '📋 Copiar y compartir'}
              </button>
            </div>
          )}

          {/* Bracket: horizontally scrollable */}
          <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 pb-6">
            <div className="flex gap-4 min-w-max px-4 sm:px-6 lg:px-8">

              {/* R32 */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-3">
                  Ronda de 32
                </div>
                {r32.map((m) => (
                  <MatchSlot
                    key={m.num}
                    matchNum={m.num}
                    team1={m.team1}
                    team2={m.team2}
                    small
                  />
                ))}
              </div>

              {/* R16 */}
              <div className="space-y-2 mt-[calc(theme(spacing.2)+theme(spacing.6))]">
                <div className="text-[10px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-3">
                  Octavos
                </div>
                {r16.map((m) => (
                  <div key={m.num} className="mt-[calc(theme(spacing.2))]">
                    <MatchSlot
                      matchNum={m.num}
                      team1={m.team1}
                      team2={m.team2}
                      small
                    />
                  </div>
                ))}
              </div>

              {/* QF */}
              <div className="space-y-2 mt-[calc(theme(spacing.2)+theme(spacing.12))]">
                <div className="text-[10px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-3">
                  Cuartos
                </div>
                {qf.map((m) => (
                  <div key={m.num} className="mt-4">
                    <MatchSlot
                      matchNum={m.num}
                      team1={m.team1}
                      team2={m.team2}
                      small
                    />
                  </div>
                ))}
              </div>

              {/* SF */}
              <div className="space-y-2 mt-[calc(theme(spacing.2)+theme(spacing.24))]">
                <div className="text-[10px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-3">
                  Semis
                </div>
                {sf.map((m) => (
                  <div key={m.num} className="mt-8">
                    <MatchSlot
                      matchNum={m.num}
                      team1={m.team1}
                      team2={m.team2}
                    />
                  </div>
                ))}
              </div>

              {/* Final */}
              <div className="mt-[calc(theme(spacing.2)+theme(spacing.36))]">
                <div className="text-[10px] font-bold text-accent-green uppercase tracking-widest text-center mb-3">
                  Final 🏆
                </div>
                <MatchSlot
                  matchNum={104}
                  team1={finalMatch.team1}
                  team2={finalMatch.team2}
                  label="19 Jul · MetLife"
                />
              </div>

            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setWinners({})}
            className="mx-auto block mt-8 px-6 py-2.5 text-sm font-semibold text-on-dark/50 border border-white/10 rounded-xl hover:text-accent-green hover:border-accent-green/50 transition-colors"
          >
            Reiniciar simulador
          </button>

        </div>
      </div>
    </div>
  )
}
