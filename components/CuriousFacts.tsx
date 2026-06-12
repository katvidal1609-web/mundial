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

export default function CuriousFacts({ matches }: { matches: Match[] }) {
  const stats = useMemo(() => calcStats(matches), [matches])

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-12">
            <p className="text-[11px] font-bold text-accent-green uppercase tracking-[0.2em] mb-2">
              DATOS DEL TORNEO
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
              Datos que no sabías
            </h2>
            <p className="text-gray-500 text-base">
              Stats calculadas en vivo · actualizadas con cada partido
            </p>
          </div>

          {/* Live stats section */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              En números (vivo)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">

              {/* Total goals */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="text-2xl mb-3">⚽</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                  {stats.totalGoals}
                </div>
                <div className="text-xs text-gray-500 leading-snug">Goles en el torneo</div>
                <div className="text-[11px] text-gray-400 mt-1">{stats.matchesPlayed} partidos jugados</div>
              </div>

              {/* Avg goals per match */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="text-2xl mb-3">📊</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                  {stats.avgGoalsPerMatch.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 leading-snug">Promedio goles/partido</div>
                <div className="text-[11px] text-gray-400 mt-1">Meta: &gt;2.5</div>
              </div>

              {/* Top scorer */}
              {stats.topScorer && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                  <div className="text-2xl mb-3">{getFlag(stats.topScorer.team)}</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                    {stats.topScorer.name}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug">
                    {stats.topScorer.goals} gol{stats.topScorer.goals !== 1 ? 'es' : ''} · Goleador del torneo
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">{t(stats.topScorer.team)}</div>
                </div>
              )}

              {/* Most goals group */}
              {stats.mostGoalsGroup && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                  <div className="text-2xl mb-3">🔥</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                    {tGroup(`Group ${stats.mostGoalsGroup.group}`)}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug">Grupo más goleador</div>
                  <div className="text-[11px] text-gray-400 mt-1">{stats.mostGoalsGroup.total} goles totales</div>
                </div>
              )}

              {/* LATAM alive */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="text-2xl mb-3">🌎</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                  {stats.latamAlive}
                </div>
                <div className="text-xs text-gray-500 leading-snug">Selecciones LATAM vivas</div>
                <div className="text-[11px] text-gray-400 mt-1">de 6 · ARG · BRA · COL · URU · ECU · PAR</div>
              </div>

              {/* Fastest goal */}
              {stats.fastestGoal && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                  <div className="text-2xl mb-3">⚡</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                    Min. {stats.fastestGoal.minute}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug">
                    Gol más rápido · {stats.fastestGoal.name}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {getFlag(stats.fastestGoal.team)} {t(stats.fastestGoal.team)}
                  </div>
                </div>
              )}

              {/* No-draw streak */}
              {stats.noDrawStreak > 1 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                  <div className="text-2xl mb-3">🚫</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
                    {stats.noDrawStreak}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug">Partidos seguidos sin empate</div>
                  <div className="text-[11px] text-gray-400 mt-1">Contando desde el último partido</div>
                </div>
              )}

            </div>
          </div>

          {/* Editorial facts section */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 mt-4">
              Sabías que…
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIXED_FACTS.map((f) => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">{f.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{f.body}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
