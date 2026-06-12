import { LATAM_STARS } from '@/lib/bettingData'
import { getFlag } from '@/lib/flags'
import { t } from '@/lib/translations'

export default function PlayersToWatch() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          ⭐ Jugadores a seguir
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Las estrellas LATAM que pueden definir el torneo
        </p>
      </div>

      <div className="space-y-2">
        {Object.entries(LATAM_STARS).map(([team, player]) => (
          <div key={team} className="card flex items-center gap-3">
            <span className="text-3xl shrink-0">{getFlag(team)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {player.name}
                </span>
                <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-medium">
                  #{player.number} · {player.position}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                {player.stat}
              </div>
            </div>
            <div className="text-xs font-semibold text-[#639922] shrink-0 text-right min-w-[56px]">
              {t(team)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
