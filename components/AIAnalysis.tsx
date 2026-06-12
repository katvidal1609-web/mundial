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
    <section className="bg-pitch-mid py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <p className="text-[11px] font-bold text-accent-green uppercase tracking-[0.2em] mb-3">
          ANÁLISIS IA
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-on-dark mb-2">
          Lo que está pasando hoy
        </h2>
        <p className="text-on-dark/50 text-base mb-10">
          Generado por Claude (Anthropic) · actualizado una vez por día
        </p>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/5 rounded-2xl p-6 space-y-3 animate-pulse">
            <div className="h-5 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white/5 rounded-2xl p-8 text-center">
            <p className="text-on-dark/60 text-sm">{error}</p>
          </div>
        )}

        {/* Content State */}
        {!loading && content && (
          <div>
            {/* Main Headline Card */}
            <div className="bg-white/8 rounded-2xl p-6 mb-6 border border-white/10">
              <h3 className="text-xl sm:text-2xl font-black text-on-dark mb-3">
                {content.headline}
              </h3>
              <p className="text-on-dark/75 text-base leading-relaxed">
                {content.summary}
              </p>
            </div>

            {/* Highlights Grid */}
            {content.highlights?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {content.highlights.map((h, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <div className="text-3xl mb-3">{h.icon}</div>
                    <div className="text-sm font-bold text-on-dark mb-1">{h.title}</div>
                    <div className="text-on-dark/65 text-xs leading-relaxed">{h.body}</div>
                  </div>
                ))}
              </div>
            )}

            {/* LATAM Focus Block */}
            {content.latamFocus && (
              <div className="bg-accent-green/10 border border-accent-green/30 rounded-2xl p-5">
                <p className="text-[11px] font-bold text-accent-green uppercase tracking-wider mb-2">
                  🌎 FOCO LATAM
                </p>
                <p className="text-on-dark/80 text-sm leading-relaxed">
                  {content.latamFocus}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
