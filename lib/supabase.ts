import { createClient } from '@supabase/supabase-js'

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()

export const supabase = url && key ? createClient(url, key) : null

export type VoteChoice = 'team1' | 'draw' | 'team2'

export async function submitVote(matchId: string, choice: VoteChoice) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('votes').insert({
    match_id: matchId,
    choice,
  })
  return { error }
}

export async function getVotes(matchId: string) {
  if (!supabase) return { team1: 0, draw: 0, team2: 0, total: 0 }
  const { data } = await supabase
    .from('votes')
    .select('choice')
    .eq('match_id', matchId)

  const counts = { team1: 0, draw: 0, team2: 0 }
  for (const row of data ?? []) {
    if (row.choice in counts) counts[row.choice as VoteChoice]++
  }
  const total = counts.team1 + counts.draw + counts.team2
  return { ...counts, total }
}
