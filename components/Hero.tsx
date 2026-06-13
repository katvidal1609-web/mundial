import type { Match } from '@/lib/types'
import { t } from '@/lib/translations'
import { getFlag } from '@/lib/flags'

// Parses "18:00 UTC-7" or "20:00 UTC-6" manually and converts to Lima (UTC-5).
// Formula: limaMin = (h*60+m) - offset*60 - 5*60, then wrap mod 1440.
function toLimaTime(timeStr: string): string {
  if (!timeStr) return ''
  const m = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*UTC([+-]\d+))?/)
  if (!m) return timeStr
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const offset = m[3] !== undefined ? parseInt(m[3], 10) : -5
  const totalMin = h * 60 + min - offset * 60 - 5 * 60
  const norm = ((totalMin % 1440) + 1440) % 1440
  const lh = Math.floor(norm / 60)
  const lm = norm % 60
  return `${String(lh).padStart(2, '0')}:${String(lm).padStart(2, '0')} Lima`
}

function PlayedCard({ match }: { match: Match }) {
  const [g1, g2] = match.score!.ft
  const winner = g1 > g2 ? match.team1 : g2 > g1 ? match.team2 : null

  const scoreColorLeft =
    winner === match.team1
      ? 'text-accent-green'
      : winner === null
      ? 'text-on-dark'
      : 'text-on-dark/60'

  const scoreColorRight =
    winner === match.team2
      ? 'text-accent-green'
      : winner === null
      ? 'text-on-dark'
      : 'text-on-dark/60'

  return (
    <div className="shrink-0 w-72 sm:w-auto bg-white/5 border border-white/10 rounded-2xl p-4">
      {/* Top row: round + ground */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-on-dark/40 uppercase tracking-wide">
          {match.round}
        </span>
        {match.ground && (
          <span className="text-[10px] text-on-dark/40 truncate max-w-[120px]">
            {match.ground}
          </span>
        )}
      </div>

      {/* Middle: team1 — score — team2 */}
      <div className="flex items-center justify-between gap-2">
        {/* Team 1 */}
        <div className="flex-1 flex flex-col items-center gap-1 text-center">
          <span className="text-3xl">{getFlag(match.team1)}</span>
          <span
            className={`text-xs font-semibold leading-tight ${
              winner === match.team1 ? 'text-on-dark' : 'text-on-dark/60'
            }`}
          >
            {t(match.team1)}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-4xl font-black tabular-nums leading-none ${scoreColorLeft}`}>
            {g1}
          </span>
          <span className="text-4xl font-black tabular-nums leading-none text-on-dark/40">
            –
          </span>
          <span className={`text-4xl font-black tabular-nums leading-none ${scoreColorRight}`}>
            {g2}
          </span>
        </div>

        {/* Team 2 */}
        <div className="flex-1 flex flex-col items-center gap-1 text-center">
          <span className="text-3xl">{getFlag(match.team2)}</span>
          <span
            className={`text-xs font-semibold leading-tight ${
              winner === match.team2 ? 'text-on-dark' : 'text-on-dark/60'
            }`}
          >
            {t(match.team2)}
          </span>
        </div>
      </div>

      {/* Bottom: Final tag */}
      <div className="text-[10px] text-on-dark/40 text-center mt-2 uppercase tracking-wide">
        Final
      </div>
    </div>
  )
}

function UpcomingCard({ match }: { match: Match }) {
  const limaTime = toLimaTime(match.time)

  return (
    <div className="shrink-0 w-72 sm:w-auto bg-white/5 border border-white/10 rounded-2xl p-4">
      {/* Top row: round + ground */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-on-dark/40 uppercase tracking-wide">
          {match.round}
        </span>
        {match.ground && (
          <span className="text-[10px] text-on-dark/40 truncate max-w-[120px]">
            {match.ground}
          </span>
        )}
      </div>

      {/* Middle: team1 — time — team2 */}
      <div className="flex items-center justify-between gap-2">
        {/* Team 1 */}
        <div className="flex-1 flex flex-col items-center gap-1 text-center">
          <span className="text-3xl">{getFlag(match.team1)}</span>
          <span className="text-xs font-semibold leading-tight text-on-dark">
            {t(match.team1)}
          </span>
        </div>

        {/* Time pill */}
        <div className="flex flex-col items-center shrink-0">
          <span className="bg-accent-green/20 text-accent-green font-bold px-2 py-1 rounded-lg text-sm">
            {limaTime || 'Por jugar'}
          </span>
          <span className="text-[9px] text-on-dark/40 mt-0.5">Lima</span>
        </div>

        {/* Team 2 */}
        <div className="flex-1 flex flex-col items-center gap-1 text-center">
          <span className="text-3xl">{getFlag(match.team2)}</span>
          <span className="text-xs font-semibold leading-tight text-on-dark">
            {t(match.team2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Hero({ matches }: { matches: Match[] }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayPlayed = matches.filter((m) => m.date === today && m.score?.ft)
  const todayPending = matches.filter((m) => m.date === today && !m.score?.ft)

  const noMatchesToday = todayPlayed.length === 0 && todayPending.length === 0

  // Fallback data when no matches today
  const recentPlayed = noMatchesToday
    ? matches.filter((m) => m.score?.ft).slice(-3)
    : []
  const nextUpcoming = noMatchesToday
    ? matches.filter((m) => !m.score?.ft).slice(0, 3)
    : []

  // Determine what to show and which label to use
  const showPlayed = todayPlayed.length > 0 ? todayPlayed : recentPlayed
  const showUpcoming = todayPending.length > 0 ? todayPending : nextUpcoming

  const playedLabel =
    todayPlayed.length > 0
      ? 'RESULTADOS DE HOY'
      : 'ÚLTIMOS RESULTADOS'

  const upcomingLabel =
    todayPending.length > 0
      ? 'PARTIDOS DE HOY'
      : 'PRÓXIMOS PARTIDOS'

  // Top label: "PARTIDOS DE HOY" if there are today matches, else "ÚLTIMOS RESULTADOS"
  const sectionLabel =
    todayPlayed.length > 0 || todayPending.length > 0
      ? 'PARTIDOS DE HOY'
      : 'ÚLTIMOS RESULTADOS'

  return (
    <section className="bg-pitch-dark">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-pitch-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Left: logo */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl" aria-hidden="true">⚽</span>
            <span className="font-bold text-on-dark text-lg">Mundial 2026</span>
            <span className="text-accent-green font-semibold text-sm ml-1">LATAM Hub</span>
          </div>

          {/* Right: EN VIVO badge */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-accent-green bg-accent-green/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" aria-hidden="true" />
            EN VIVO
          </div>
        </div>
      </nav>

      {/* ── HERO BODY ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Center text block */}
        <div className="text-center">
          <p className="text-xs font-bold text-accent-green uppercase tracking-[0.2em] mb-4">
            FIFA WORLD CUP 2026
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-on-dark leading-none">
            El Mundial 2026
            <br />
            <span className="text-accent-green">en tu idioma</span>
          </h1>
          <p className="text-on-dark/60 text-lg mt-4 max-w-xl mx-auto">
            Resultados, predicciones e IA para toda LATAM · 11 jun – 19 jul
          </p>
        </div>

        {/* ── SCOREBOARD CARDS ── */}
        <div className="mt-12">
          {/* Single-section case: only played OR only upcoming (no mixed today) */}
          {noMatchesToday ? (
            <>
              {/* Últimos resultados */}
              {showPlayed.length > 0 && (
                <div className="mb-8">
                  <p className="text-[11px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-4">
                    {playedLabel}
                  </p>
                  <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
                    {showPlayed.map((m) => (
                      <PlayedCard key={`${m.date}_${m.team1}_${m.team2}`} match={m} />
                    ))}
                  </div>
                </div>
              )}

              {/* Próximos partidos */}
              {showUpcoming.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-4">
                    {upcomingLabel}
                  </p>
                  <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
                    {showUpcoming.map((m) => (
                      <UpcomingCard key={`${m.date}_${m.team1}_${m.team2}`} match={m} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Today played + today pending, each with its own label */}
              {todayPlayed.length > 0 && (
                <div className="mb-8">
                  <p className="text-[11px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-4">
                    RESULTADOS DE HOY
                  </p>
                  <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
                    {todayPlayed.map((m) => (
                      <PlayedCard key={`${m.date}_${m.team1}_${m.team2}`} match={m} />
                    ))}
                  </div>
                </div>
              )}

              {todayPending.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-on-dark/40 uppercase tracking-widest text-center mb-4">
                    PARTIDOS DE HOY
                  </p>
                  <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
                    {todayPending.map((m) => (
                      <UpcomingCard key={`${m.date}_${m.team1}_${m.team2}`} match={m} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty fallback */}
          {showPlayed.length === 0 && showUpcoming.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-sm text-on-dark/60">Cargando partidos…</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
