'use client'

import { useMemo } from 'react'
import type { Match } from '@/lib/types'
import { calcStats } from '@/lib/fixture'
import { getFlag } from '@/lib/flags'
import { t, tGroup } from '@/lib/translations'

const FIXED_FACTS = [
  {
    icon: '🌐',
    title: 'Formato histórico',
    body: 'Por primera vez en la historia, el Mundial tiene 48 selecciones y 12 grupos. Antes siempre fueron 32 equipos y 8 grupos.',
  },
  {
    icon: '🇧🇷',
    title: 'Brasil, el único invicto',
    body: 'Brasil es el único país que ha participado en TODOS los mundiales: 22 de 22. Ninguna otra selección lo logró.',
  },
  {
    icon: '🏟️',
    title: 'Tres países, una Copa',
    body: 'EE.UU., México y Canadá organizan juntos por primera vez. Son 16 sedes distribuidas en todo el continente.',
  },
  {
    icon: '🔄',
    title: 'La ronda de 32 es nueva',
    body: 'El formato de 48 equipos introdujo una "ronda de 32" donde los terceros de grupo también clasifican a las eliminatorias.',
  },
  {
    icon: '🏆',
    title: 'MetLife Stadium, la catedral',
    body: 'La final se juega el 19 de julio en MetLife Stadium (Nueva Jersey), el estadio más grande de la NFL con capacidad para 82.500 personas.',
  },
  {
    icon: '⏱️',
    title: 'VAR en todos los partidos',
    body: 'Por segundo Mundial consecutivo, el VAR está activo en los 104 partidos. En Qatar 2022 se validaron 29 decisiones.',
  },
]

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="card flex items-center gap-3">
      <div className="text-3xl shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function CuriousFacts({ matches }: { matches: Match[] }) {
  const stats = useMemo(() => calcStats(matches), [matches])

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          💡 Datos curiosos
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Stats calculadas en vivo · actualizadas cada minuto
        </p>
      </div>

      {/* Live stats */}
      <section>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          En números (en vivo)
        </h3>
        <div className="space-y-2">
          <StatCard
            icon="⚽"
            label="Goles en el torneo"
            value={stats.totalGoals}
            sub={`${stats.matchesPlayed} partidos jugados`}
          />

          <StatCard
            icon="📊"
            label="Promedio de goles por partido"
            value={stats.avgGoalsPerMatch.toFixed(2)}
            sub="Meta histórica: >2.5 goles/partido"
          />

          {stats.topScorer && (
            <StatCard
              icon={getFlag(stats.topScorer.team)}
              label="Goleador del torneo"
              value={`${stats.topScorer.name} — ${stats.topScorer.goals} gol${stats.topScorer.goals !== 1 ? 'es' : ''}`}
              sub={t(stats.topScorer.team)}
            />
          )}

          {stats.mostGoalsGroup && (
            <StatCard
              icon="🔥"
              label="Grupo más goleador"
              value={`${tGroup(`Group ${stats.mostGoalsGroup.group}`)} — ${stats.mostGoalsGroup.total} goles`}
              sub="El más entretenido hasta ahora"
            />
          )}

          <StatCard
            icon="🌎"
            label="Selecciones LATAM que siguen vivas"
            value={`${stats.latamAlive} de 6`}
            sub="Argentina · Brasil · Colombia · Uruguay · Ecuador · Paraguay"
          />

          {stats.fastestGoal && (
            <StatCard
              icon="⚡"
              label="Gol más rápido del torneo"
              value={`Min. ${stats.fastestGoal.minute} — ${stats.fastestGoal.name}`}
              sub={`${getFlag(stats.fastestGoal.team)} ${t(stats.fastestGoal.team)} · ${stats.fastestGoal.match}`}
            />
          )}

          {stats.noDrawStreak > 1 && (
            <StatCard
              icon="🚫"
              label="Racha de partidos sin empate"
              value={`${stats.noDrawStreak} partidos seguidos`}
              sub="Contando desde el último partido"
            />
          )}

          {stats.matchesPlayed === 0 && (
            <div className="card text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
              Aún no hay partidos jugados. ¡Volvé cuando empiece el torneo!
            </div>
          )}
        </div>
      </section>

      {/* Fixed editorial facts */}
      <section>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Sabías que…
        </h3>
        <div className="space-y-2">
          {FIXED_FACTS.map((f) => (
            <div key={f.title} className="card">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                    {f.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {f.body}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
