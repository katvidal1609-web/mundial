'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Match } from '@/lib/types'
import type { VoteChoice } from '@/lib/supabase'
import { submitVote, getVotes } from '@/lib/supabase'
import { getFlag, LATAM_TEAMS } from '@/lib/flags'
import { t } from '@/lib/translations'

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

  useEffect(() => {
    const stored = getStoredVotes()
    if (stored[mid]) {
      setState((s) => ({ ...s, voted: stored[mid] }))
      loadVotes()
    }
    if (isPlayed) loadVotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid, isPlayed])

  const loadVotes = useCallback(async () => {
    const counts = await getVotes(mid)
    setState((s) => ({ ...s, counts }))
  }, [mid])

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
    <div className="card">
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

      {!showResults ? (
        <div className="grid grid-cols-3 gap-2">
          {(['team1', 'draw', 'team2'] as VoteChoice[]).map((choice) => (
            <button
              key={choice}
              onClick={() => vote(choice)}
              disabled={state.loading}
              className="py-2 px-1 rounded-xl text-xs font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-[#639922] hover:text-[#639922] dark:hover:border-[#639922] transition-colors disabled:opacity-50"
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
              <span className="font-semibold text-[#639922]">
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
                      isVoted ? 'text-[#639922]' : 'text-gray-600 dark:text-gray-400'
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
                    className="h-full rounded-full bar-fill transition-all"
                    style={
                      {
                        '--target-width': `${p}%`,
                        width: `${p}%`,
                        backgroundColor: isVoted ? '#639922' : isCorrect ? '#22c55e' : '#d1d5db',
                      } as React.CSSProperties
                    }
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

export default function Predictions({ matches }: { matches: Match[] }) {
  const latamPending = matches.filter((m) => isLatamMatch(m) && !m.score?.ft && m.group)
  const latamPlayed = matches.filter((m) => isLatamMatch(m) && !!m.score?.ft && m.group)

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          🔮 ¿Quién gana?
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Votá antes del partido · un voto por match
        </p>
      </div>

      {latamPending.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Próximos partidos LATAM
          </h3>
          <div className="space-y-3">
            {latamPending.map((m) => (
              <PredictionCard key={matchId(m)} match={m} />
            ))}
          </div>
        </section>
      )}

      {latamPlayed.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Resultados jugados
          </h3>
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

      {latamPending.length === 0 && latamPlayed.length === 0 && (
        <div className="card text-center text-gray-500 dark:text-gray-400 py-8">
          No hay partidos LATAM disponibles todavía.
        </div>
      )}
    </div>
  )
}
