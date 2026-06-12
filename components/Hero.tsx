import type { Match } from '@/lib/types'
import { t } from '@/lib/translations'
import { getFlag } from '@/lib/flags'

function MatchRow({ match }: { match: Match }) {
  const isPlayed = !!match.score?.ft
  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-lg">{getFlag(match.team1)}</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {t(match.team1)}
        </span>
      </div>
      <div className="shrink-0 px-2 text-center min-w-[56px]">
        {isPlayed ? (
          <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
            {match.score!.ft[0]}–{match.score!.ft[1]}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-[#639922] bg-[#639922]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {match.time ?? 'Por jugar'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate text-right">
          {t(match.team2)}
        </span>
        <span className="text-lg">{getFlag(match.team2)}</span>
      </div>
    </div>
  )
}

export default function Hero({ matches }: { matches: Match[] }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayMatches = matches.filter((m) => m.date === today)

  const dateLabel = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <section className="py-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            Mundial 2026 🏆
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {dateLabel}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#639922] bg-[#639922]/10 px-3 py-1.5 rounded-full shrink-0 mt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#639922] animate-pulse" />
          En vivo
        </div>
      </div>

      {todayMatches.length > 0 ? (
        <div className="card">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Partidos de hoy
          </h2>
          <div>
            {todayMatches.map((m) => (
              <MatchRow key={`${m.date}_${m.team1}_${m.team2}`} match={m} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay partidos programados para hoy.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            11 jun – 19 jul 2026 · EE.UU. / México / Canadá
          </p>
        </div>
      )}
    </section>
  )
}
