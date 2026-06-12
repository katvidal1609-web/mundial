'use client'

import { useMemo } from 'react'
import type { Match, TeamStanding } from '@/lib/types'
import { getGroupStandings } from '@/lib/fixture'
import { getFlag, LATAM_TEAMS, LATAM_GROUPS } from '@/lib/flags'
import { t } from '@/lib/translations'

function StatusBadge({ status }: { status: TeamStanding['status'] }) {
  const map = {
    playing: { label: 'En curso', cls: 'badge-playing' },
    qualified: { label: 'Clasificó', cls: 'badge-qualified' },
    eliminated: { label: 'Eliminado', cls: 'badge-eliminated' },
    pending: { label: 'Por jugar', cls: 'badge-pending' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  )
}

export default function LatamRanking({ matches }: { matches: Match[] }) {
  const standings = useMemo(() => {
    const result: (TeamStanding & { groupStanding: TeamStanding[] })[] = []

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

    const priority = { qualified: 0, playing: 1, pending: 2, eliminated: 3 }
    result.sort((a, b) => {
      if (priority[a.status] !== priority[b.status])
        return priority[a.status] - priority[b.status]
      return b.points - a.points || b.gd - a.gd
    })

    return result
  }, [matches])

  return (
    <div className="space-y-4 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          🌎 LATAM en el Mundial
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          6 selecciones clasificadas · datos en vivo
        </p>
      </div>

      <div className="space-y-3">
        {standings.map((s) => (
          <div key={s.team} className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-3xl">{s.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {t(s.team)}
                    </span>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Grupo {s.group} · {s.position > 0 ? `${s.position}° del grupo` : 'sin jugar'}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-[#639922]">{s.points}</div>
                <div className="text-[10px] text-gray-400">pts</div>
              </div>
            </div>

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

            <details className="mt-2">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-[#639922] select-none list-none flex items-center gap-1">
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
                      <th className="py-1 font-medium w-8 text-[#639922]">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.groupStanding.map((row, i) => (
                      <tr
                        key={row.team}
                        className={`border-t border-gray-50 dark:border-gray-800 ${
                          row.team === s.team ? 'bg-[#639922]/5' : ''
                        }`}
                      >
                        <td className="py-1 flex items-center gap-1.5">
                          <span className="text-gray-400">{i + 1}</span>
                          <span>{getFlag(row.team)}</span>
                          <span
                            className={
                              row.team === s.team
                                ? 'font-semibold text-[#639922]'
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
                        <td className="text-center py-1 font-bold text-[#639922]">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
