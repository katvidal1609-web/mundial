import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const MAX_DAILY = 50

function today() {
  return new Date().toISOString().slice(0, 10)
}

function getSupabase() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()
  if (!url || !key) return null
  return createClient(url, key)
}

async function fetchFixture() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json',
      { next: { revalidate: 300 } },
    )
    if (!res.ok) throw new Error()
    return res.json()
  } catch {
    return null
  }
}

export async function GET() {
  const date = today()
  const sb = getSupabase()

  // Serve from cache if available
  if (sb) {
    const { data } = await sb
      .from('ai_cache')
      .select('content')
      .eq('date', date)
      .maybeSingle()
    if (data?.content) {
      return NextResponse.json(data.content)
    }
  }

  const apiKey = (process.env.ANTHROPIC_API_KEY ?? '').trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Análisis no disponible (ANTHROPIC_API_KEY no configurada)' },
      { status: 503 },
    )
  }

  // Rate-limit check
  if (sb) {
    const { data: req } = await sb
      .from('ai_requests')
      .select('count')
      .eq('date', date)
      .maybeSingle()
    if ((req?.count ?? 0) >= MAX_DAILY) {
      return NextResponse.json(
        { error: 'Límite de análisis diario alcanzado. Volvé mañana.' },
        { status: 429 },
      )
    }
  }

  // Build fixture context
  const fixture = await fetchFixture()
  const allMatches: any[] = fixture?.matches ?? []
  const todayMatches = allMatches.filter((m) => m.date === date)
  const recentPlayed = allMatches.filter((m) => m.score?.ft).slice(-8)

  const lines = [
    `Fecha: ${date}`,
    'Torneo: FIFA World Cup 2026 (11 jun – 19 jul, EE.UU./México/Canadá)',
    'Equipos LATAM: Argentina (J), Brasil (C), Colombia (K), Uruguay (H), Ecuador (E), Paraguay (D)',
  ]
  if (todayMatches.length) {
    lines.push(`\nPartidos programados hoy (${date}):`)
    for (const m of todayMatches) {
      const score = m.score?.ft ? `${m.score.ft[0]}-${m.score.ft[1]}` : 'por jugar'
      lines.push(`  ${m.team1} vs ${m.team2}: ${score}`)
    }
  }
  if (recentPlayed.length) {
    lines.push('\nÚltimos resultados:')
    for (const m of recentPlayed) {
      lines.push(`  ${m.team1} ${m.score.ft[0]}-${m.score.ft[1]} ${m.team2}`)
    }
  }

  const client = new Anthropic({ apiKey })
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 900,
    messages: [
      {
        role: 'user',
        content: `Sos un analista deportivo cubriendo el Mundial 2026 para una audiencia latinoamericana.
Analizá los datos disponibles y generá un análisis del día en español rioplatense.

Datos:
${lines.join('\n')}

Respondé ÚNICAMENTE con JSON válido, sin texto extra antes ni después:
{
  "headline": "Título llamativo (máx 60 caracteres)",
  "summary": "2-3 oraciones resumiendo lo más importante del día",
  "highlights": [
    { "icon": "emoji", "title": "Título corto", "body": "1-2 oraciones de análisis" },
    { "icon": "emoji", "title": "Título corto", "body": "1-2 oraciones de análisis" },
    { "icon": "emoji", "title": "Título corto", "body": "1-2 oraciones de análisis" }
  ],
  "latamFocus": "Párrafo sobre el estado y perspectivas de las selecciones LATAM en el torneo",
  "date": "${date}"
}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

  let parsed: object
  try {
    // Strip markdown code fences if present
    const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    parsed = JSON.parse(jsonText)
  } catch {
    return NextResponse.json(
      { error: 'El análisis no pudo procesarse correctamente.' },
      { status: 500 },
    )
  }

  // Persist to cache
  if (sb) {
    await sb
      .from('ai_cache')
      .upsert({ date, content: parsed, generated_at: new Date().toISOString() })

    const { data: req } = await sb
      .from('ai_requests')
      .select('count')
      .eq('date', date)
      .maybeSingle()
    await sb
      .from('ai_requests')
      .upsert({ date, count: (req?.count ?? 0) + 1 })
  }

  return NextResponse.json(parsed)
}
