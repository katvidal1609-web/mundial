'use client'

import { useState } from 'react'
import type { Fixture } from '@/lib/types'
import type { TabId } from '@/lib/types'
import LatamRanking from './LatamRanking'
import Predictions from './Predictions'
import BracketSimulator from './BracketSimulator'
import CuriousFacts from './CuriousFacts'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'ranking', label: 'Ranking', icon: '🏆' },
  { id: 'predicciones', label: 'Predecí', icon: '🔮' },
  { id: 'simulador', label: 'Bracket', icon: '📊' },
  { id: 'curiosidades', label: 'Stats', icon: '💡' },
]

export default function TabsShell({ fixture }: { fixture: Fixture }) {
  const [active, setActive] = useState<TabId>('ranking')

  return (
    <div>
      {/* Tab nav */}
      <nav className="sticky top-[57px] z-30 bg-white dark:bg-gray-950 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 min-w-[80px] py-3 text-xs font-medium flex flex-col items-center gap-0.5 transition-colors ${
                active === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Tab content */}
      <div className="mt-5 animate-fade-in" key={active}>
        {active === 'ranking' && <LatamRanking matches={fixture.matches} />}
        {active === 'predicciones' && <Predictions matches={fixture.matches} />}
        {active === 'simulador' && <BracketSimulator matches={fixture.matches} />}
        {active === 'curiosidades' && <CuriousFacts matches={fixture.matches} />}
      </div>
    </div>
  )
}
