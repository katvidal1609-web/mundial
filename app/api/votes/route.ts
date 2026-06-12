import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(req: NextRequest) {
  const matchId = req.nextUrl.searchParams.get('match_id')
  if (!matchId) {
    return NextResponse.json({ error: 'match_id required' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ team1: 0, draw: 0, team2: 0, total: 0 })
  }

  const { data } = await supabase
    .from('votes')
    .select('choice')
    .eq('match_id', matchId)

  const counts = { team1: 0, draw: 0, team2: 0 }
  for (const row of data ?? []) {
    if (row.choice === 'team1') counts.team1++
    else if (row.choice === 'draw') counts.draw++
    else if (row.choice === 'team2') counts.team2++
  }

  return NextResponse.json({
    ...counts,
    total: counts.team1 + counts.draw + counts.team2,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.match_id || !body?.choice) {
    return NextResponse.json({ error: 'match_id and choice required' }, { status: 400 })
  }

  const validChoices = ['team1', 'draw', 'team2']
  if (!validChoices.includes(body.choice)) {
    return NextResponse.json({ error: 'invalid choice' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: true, note: 'supabase not configured' })
  }

  const { error } = await supabase.from('votes').insert({
    match_id: body.match_id,
    choice: body.choice,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
