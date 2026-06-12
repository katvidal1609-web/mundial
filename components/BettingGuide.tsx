'use client'

import { useState, useEffect } from 'react'
import type { Match } from '@/lib/types'
import { getFlag, LATAM_TEAMS } from '@/lib/flags'
import { t } from '@/lib/translations'
import { getVotes } from '@/lib/supabase'
import { FIFA_RANKINGS, getH2H } from '@/lib/bettingData'

function matchKey(m: Match) {
  return `${m.date}_${m.team1}_${m.team2}`.replace(/\s+/g, '_')
}

function MatchBettingCard({ match }: { match: Match }) {
  const [votes, setVotes] = useState<{
    team1: number; draw: number; team2: number; total: number
  } | null>(null)

  useEffect(() => {
    getVotes(matchKey(match)).then(setVotes)
  }, [match])

  const r1 = FIFA_RANKINGS[match.team1]
  const r2 = FIFA_RANKINGS[match.team2]
  const h2h = getH2H(match.team1, match.team2)

  const favorite =
    r1 !== undefined && r2 !== undefined
      ? r1 < r2 ? match.team1 : r2 < r1 ? match.team2 : null
      : null

  const pct = (n: number) =>
    votes && votes.total > 0 ? Math.round((n / votes.total) * 100) : 0

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('es-PE', {
      weekday: 'short', day: 'numeric', month: 'short',
    })

  return (
    <div className="card space-y-4">
      {/* Teams header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xl">{getFlag(match.team1)}</span>
          <span className="font-bold text-sm text-gray-900 dark:text-white">{t(match.team1)}</span>
        </div>
        <div className="text-xs text-gray-400 shrink-0 px-2">
          vs · {formatDate(match.date)}
        </div>
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <span className="font-bold text-sm text-gray-900 dark:text-white">{t(match.team2)}</span>
          <span className="text-xl">{getFlag(match.team2)}</span>
        </div>
      </div>

      {/* FIFA ranking */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Ranking FIFA
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-center">
            <div
              className={`text-2xl font-black tabular-nums ${
                favorite === match.team1 ? 'text-[#639922]' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {r1 !== undefined ? `#${r1}` : '—'}
            </div>
            <div className="text-[11px] text-gray-500">{t(match.team1)}</div>
          </div>
          <div className="flex-1 text-center text-xs">
            {favorite ? (
              <span className="inline-block bg-[#639922]/10 text-[#639922] font-semibold px-2 py-1 rounded-full text-[11px]">
                {t(favorite)} favorito
              </span>
            ) : (
              <span className="text-gray-400 text-[11px]">Parejo</span>
            )}
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-black tabular-nums ${
                favorite === match.team2 ? 'text-[#639922]' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {r2 !== undefined ? `#${r2}` : '—'}
            </div>
            <div className="text-[11px] text-gray-500">{t(match.team2)}</div>
          </div>
        </div>
      </div>

      {/* H2H */}
      {h2h && (
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1.5">
            Historial H2H
          </div>
          <p className="leading-relaxed mb-1.5">{h2h.summary}</p>
          <div className="flex items-center gap-2 font-semibold">
            <span>{t(h2h.team1)}: {h2h.t1Wins}V</span>
            <span className="text-gray-400">·</span>
            <span>{h2h.draws}E</span>
            <span className="text-gray-400">·</span>
            <span>{t(h2h.team2)}: {h2h.t2Wins}V</span>
          </div>
        </div>
      )}

      {/* Community votes */}
      {votes && votes.total > 0 ? (
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            La gente dice ({votes.total} voto{votes.total !== 1 ? 's' : ''})
          </div>
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
            <div
              className="bg-[#639922] transition-all"
              style={{ width: `${pct(votes.team1)}%` }}
            />
            <div
              className="bg-gray-300 dark:bg-gray-600 transition-all"
              style={{ width: `${pct(votes.draw)}%` }}
            />
            <div
              className="bg-blue-400 transition-all"
              style={{ width: `${pct(votes.team2)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
            <span className="text-[#639922] font-semibold">{pct(votes.team1)}% {t(match.team1)}</span>
            <span>{pct(votes.draw)}% Empate</span>
            <span className="text-blue-500 font-semibold">{pct(votes.team2)}% {t(match.team2)}</span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-gray-400 text-center">
          Todavía no hay votos — ¡votá en la sección de predicciones!
        </p>
      )}
    </div>
  )
}

export default function BettingGuide({ matches }: { matches: Match[] }) {
  const upcoming = matches
    .filter(
      (m) =>
        !m.score?.ft &&
        m.group &&
        (LATAM_TEAMS.includes(m.team1) || LATAM_TEAMS.includes(m.team2)),
    )
    .slice(0, 6)

  if (upcoming.length === 0) return null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          🎯 Para apostar informado
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Próximos partidos LATAM · ranking FIFA + historial + votos
        </p>
      </div>

      <div className="space-y-3">
        {upcoming.map((m) => (
          <MatchBettingCard key={matchKey(m)} match={m} />
        ))}
      </div>
    </div>
  )
}
