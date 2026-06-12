'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Match, TeamStanding } from '@/lib/types'
import type { VoteChoice } from '@/lib/supabase'
import { submitVote, getVotes } from '@/lib/supabase'
import { getGroupStandings } from '@/lib/fixture'
import { getFlag, LATAM_TEAMS, LATAM_GROUPS } from '@/lib/flags'
import { t } from '@/lib/translations'
import { getPassPct } from '@/lib/bettingData'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mundial2026_votes'

function getStoredVotes(): Record<string, VoteChoice> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function storeVote(matchId: string, choice: VoteChoice) {
  const v = getStoredVotes()
  v[matchId] = choice
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
}

function matchId(m: Match) {
  return `${m.date}_${m.team1}_${m.team2}`.replace(/\s+/g, '_')
}

function isLatamMatch(m: Match) {
  return LATAM_TEAMS.includes(m.team1) || LATAM_TEAMS.includes(m.team2)
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TeamStanding['status'] }) {
  const map: Record<TeamStanding['status'], { label: string; cls: string }> = {
    playing: {
      label: 'En curso',
      cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    qualified: {
      label: 'Clasificó',
      cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    eliminated: {
      label: 'Eliminado',
      cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    pending: {
      label: 'Por jugar',
      cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
  }
  const { label, cls } = map[status]
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  )
}

// ─── TeamCard (Ranking left column) ──────────────────────────────────────────

type TeamStandingWithGroup = TeamStanding & { groupStanding: TeamStanding[] }

function TeamCard({ s }: { s: TeamStandingWithGroup }) {
  const passPct = getPassPct(s.team, s.position, s.played)
  const showClassificationBadge = s.status === 'pending' || s.status === 'playing'

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl">{s.flag}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-white">{t(s.team)}</span>
              <StatusBadge status={s.status} />
              {showClassificationBadge && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                  {passPct}% clasifica
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Grupo {s.group} · {s.position > 0 ? `${s.position}° del grupo` : 'sin jugar'}
            </div>
          </div>
        </div>
        {/* Points */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-accent-green">{s.points}</div>
          <div className="text-[10px] text-gray-400">pts</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-6 text-center text-xs">
        {[
          { label: 'PJ', value: s.played },
          { label: 'G', value: s.won },
          { label: 'E', value: s.drawn },
          { label: 'P', value: s.lost },
          { label: 'GF', value: s.gf },
          { label: 'GD', value: s.gd > 0 ? `+${s.gd}` : s.gd },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-gray-400 font-medium">{label}</div>
            <div className="font-semibold text-gray-700 dark:text-gray-300">{value}</div>
          </div>
        ))}
      </div>

      {/* Probability bar */}
      {showClassificationBadge && (
        <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-green rounded-full transition-all"
            style={{ width: `${passPct}%` }}
          />
        </div>
      )}

      {/* Expandable group table */}
      <details className="mt-2">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-accent-green list-none flex items-center gap-1">
          <span>▸</span> Ver tabla Grupo {s.group}
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-1 font-medium">Equipo</th>
                <th className="py-1 font-medium w-7">PJ</th>
                <th className="py-1 font-medium w-7">G</th>
                <th className="py-1 font-medium w-7">E</th>
                <th className="py-1 font-medium w-7">P</th>
                <th className="py-1 font-medium w-8">GD</th>
                <th className="py-1 font-medium w-8 text-accent-green">Pts</th>
              </tr>
            </thead>
            <tbody>
              {s.groupStanding.map((row, i) => (
                <tr
                  key={row.team}
                  className={`border-t border-gray-50 dark:border-gray-800 ${
                    row.team === s.team ? 'bg-accent-green/5' : ''
                  }`}
                >
                  <td className="py-1 flex items-center gap-1.5">
                    <span className="text-gray-400">{i + 1}</span>
                    <span>{getFlag(row.team)}</span>
                    <span
                      className={
                        row.team === s.team
                          ? 'font-semibold text-accent-green'
                          : 'text-gray-700 dark:text-gray-300'
                      }
                    >
                      {t(row.team)}
                    </span>
                  </td>
                  <td className="text-center py-1 text-gray-600 dark:text-gray-400">{row.played}</td>
                  <td className="text-center py-1 text-gray-600 dark:text-gray-400">{row.won}</td>
                  <td className="text-center py-1 text-gray-600 dark:text-gray-400">{row.drawn}</td>
                  <td className="text-center py-1 text-gray-600 dark:text-gray-400">{row.lost}</td>
                  <td className="text-center py-1 text-gray-600 dark:text-gray-400">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="text-center py-1 font-bold text-accent-green">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

// ─── VoteState & PredictionCard (Predictions right column) ───────────────────

interface VoteState {
  voted: VoteChoice | null
  counts: { team1: number; draw: number; team2: number; total: number }
  loading: boolean
}

function PredictionCard({ match }: { match: Match }) {
  const mid = matchId(match)
  const isPlayed = !!match.score?.ft

  const [state, setState] = useState<VoteState>({
    voted: null,
    counts: { team1: 0, draw: 0, team2: 0, total: 0 },
    loading: false,
  })

  const loadVotes = useCallback(async () => {
    const counts = await getVotes(mid)
    setState((s) => ({ ...s, counts }))
  }, [mid])

  useEffect(() => {
    const stored = getStoredVotes()
    if (stored[mid]) {
      setState((s) => ({ ...s, voted: stored[mid] }))
      loadVotes()
    }
    if (isPlayed) loadVotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid, isPlayed])

  const vote = async (choice: VoteChoice) => {
    if (state.voted || isPlayed) return
    setState((s) => ({ ...s, loading: true }))
    storeVote(mid, choice)
    await submitVote(mid, choice)
    const counts = await getVotes(mid)
    setState({ voted: choice, counts, loading: false })
  }

  const { counts } = state
  const showResults = !!state.voted || isPlayed

  const popularChoice =
    counts.total > 0
      ? counts.team1 >= counts.draw && counts.team1 >= counts.team2
        ? 'team1'
        : counts.draw >= counts.team1 && counts.draw >= counts.team2
          ? 'draw'
          : 'team2'
      : null

  const pct = (n: number) =>
    counts.total > 0 ? Math.round((n / counts.total) * 100) : 0

  const realResult = match.score?.ft
    ? match.score.ft[0] > match.score.ft[1]
      ? 'team1'
      : match.score.ft[0] < match.score.ft[1]
        ? 'team2'
        : 'draw'
    : null

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      {/* Date / ground header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(match.date)}
          {match.ground && ` · ${match.ground}`}
        </span>
        {isPlayed && match.score?.ft && (
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {match.score.ft[0]}–{match.score.ft[1]}
          </span>
        )}
      </div>

      {/* Teams — 3-col flex */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">{getFlag(match.team1)}</div>
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
            {t(match.team1)}
          </div>
        </div>
        <div className="text-gray-300 dark:text-gray-600 font-bold text-sm">VS</div>
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">{getFlag(match.team2)}</div>
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
            {t(match.team2)}
          </div>
        </div>
      </div>

      {/* Vote buttons or result bars */}
      {!showResults ? (
        <div className="grid grid-cols-3 gap-2">
          {(['team1', 'draw', 'team2'] as VoteChoice[]).map((choice) => (
            <button
              key={choice}
              onClick={() => vote(choice)}
              disabled={state.loading}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl py-2 text-xs font-semibold hover:border-accent-green hover:text-accent-green transition-colors disabled:opacity-50"
            >
              {choice === 'team1'
                ? `Gana ${t(match.team1)}`
                : choice === 'draw'
                  ? 'Empate'
                  : `Gana ${t(match.team2)}`}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {isPlayed && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              La gente dijo{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {popularChoice === 'team1'
                  ? `${pct(counts.team1)}% ganaba ${t(match.team1)}`
                  : popularChoice === 'draw'
                    ? `${pct(counts.draw)}% empate`
                    : `${pct(counts.team2)}% ganaba ${t(match.team2)}`}
              </span>{' '}
              · el resultado fue{' '}
              <span className="font-semibold text-accent-green">
                {match.score!.ft[0]}–{match.score!.ft[1]}
              </span>
            </p>
          )}
          {(['team1', 'draw', 'team2'] as VoteChoice[]).map((choice) => {
            const n = counts[choice]
            const p = pct(n)
            const isVoted = state.voted === choice
            const isCorrect = isPlayed && realResult === choice

            return (
              <div key={choice}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span
                    className={`font-medium ${
                      isVoted ? 'text-accent-green' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isVoted && '✓ '}
                    {choice === 'team1'
                      ? t(match.team1)
                      : choice === 'draw'
                        ? 'Empate'
                        : t(match.team2)}
                    {isCorrect && ' ✅'}
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{p}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isVoted
                        ? 'bg-accent-green'
                        : isCorrect
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            )
          })}
          {counts.total > 0 && (
            <p className="text-right text-[10px] text-gray-400 mt-1">
              {counts.total} voto{counts.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RankingAndPredictions({ matches }: { matches: Match[] }) {
  // Build LATAM standings
  const standings = useMemo<TeamStandingWithGroup[]>(() => {
    const result: TeamStandingWithGroup[] = []

    for (const team of LATAM_TEAMS) {
      const group = LATAM_GROUPS[team]
      const groupTable = getGroupStandings(matches, group)
      const entry = groupTable.find((s) => s.team === team)
      if (entry) {
        result.push({ ...entry, flag: getFlag(team), groupStanding: groupTable })
      } else {
        result.push({
          team,
          flag: getFlag(team),
          group,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          points: 0,
          position: 0,
          status: 'pending',
          groupStanding: groupTable,
        })
      }
    }

    const priority: Record<TeamStanding['status'], number> = {
      qualified: 0,
      playing: 1,
      pending: 2,
      eliminated: 3,
    }
    result.sort((a, b) => {
      if (priority[a.status] !== priority[b.status])
        return priority[a.status] - priority[b.status]
      return b.points - a.points || b.gd - a.gd
    })

    return result
  }, [matches])

  // Filter LATAM matches
  const latamPending = useMemo(
    () => matches.filter((m) => isLatamMatch(m) && !m.score?.ft && m.group),
    [matches],
  )
  const latamPlayed = useMemo(
    () => matches.filter((m) => isLatamMatch(m) && !!m.score?.ft && m.group),
    [matches],
  )

  return (
    <section className="bg-white dark:bg-gray-950 py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10">
          <p className="text-[11px] font-bold text-accent-green uppercase tracking-[0.2em] mb-2">
            LATAM EN EL MUNDIAL
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
            6 selecciones en la pelea
          </h2>
          <p className="text-gray-500 text-base">
            Tabla de posiciones · Predicciones · datos en vivo
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT — Ranking */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              🌎 Tabla LATAM
            </h3>
            <div className="space-y-3">
              {standings.map((s) => (
                <TeamCard key={s.team} s={s} />
              ))}
            </div>
          </div>

          {/* RIGHT — Predictions */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              🔮 Predicciones
            </h3>

            {latamPending.length === 0 && latamPlayed.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay partidos LATAM disponibles todavía.
              </div>
            ) : (
              <div className="space-y-5">
                {latamPending.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      PRÓXIMOS PARTIDOS LATAM
                    </h4>
                    <div className="space-y-3">
                      {latamPending.map((m) => (
                        <PredictionCard key={matchId(m)} match={m} />
                      ))}
                    </div>
                  </section>
                )}

                {latamPlayed.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      RESULTADOS JUGADOS
                    </h4>
                    <div className="space-y-3">
                      {latamPlayed
                        .slice()
                        .reverse()
                        .map((m) => (
                          <PredictionCard key={matchId(m)} match={m} />
                        ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
