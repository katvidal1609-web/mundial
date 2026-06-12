'use client'

import { useState, useEffect } from 'react'

interface Highlight {
  icon: string
  title: string
  body: string
}

interface AIContent {
  headline: string
  summary: string
  highlights: Highlight[]
  latamFocus: string
  date: string
}

export default function AIAnalysis() {
  const [content, setContent] = useState<AIContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/ai-analysis')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setContent(data)
      })
      .catch(() => setError('No se pudo cargar el análisis'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          🤖 Análisis del día
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Generado por IA · actualizado una vez por día
        </p>
      </div>

      {loading && (
        <div className="card space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      )}

      {!loading && error && (
        <div className="card text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          {error}
        </div>
      )}

      {!loading && content && (
        <div className="space-y-3 animate-slide-up">
          <div className="card bg-[#639922]/5 border-[#639922]/20">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-snug">
              {content.headline}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.summary}
            </p>
          </div>

          {content.highlights?.map((h, i) => (
            <div key={i} className="card flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{h.icon}</span>
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                  {h.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {h.body}
                </div>
              </div>
            </div>
          ))}

          {content.latamFocus && (
            <div className="card border-l-4 border-l-[#639922] rounded-l-none">
              <div className="text-[11px] font-bold text-[#639922] uppercase tracking-wider mb-1.5">
                🌎 Foco LATAM
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {content.latamFocus}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
