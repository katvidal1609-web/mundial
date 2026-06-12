import type { Fixture, Match, TeamStanding } from './types'
import { LATAM_TEAMS } from './flags'

const OPENFOOTBALL_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

export async function fetchFixture(): Promise<Fixture> {
  try {
    const res = await fetch(OPENFOOTBALL_URL, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    // Fallback to local snapshot
    const snapshot = await import('../data/fixture-snapshot.json')
    return snapshot.default as Fixture
  }
}

export function getPlayedMatches(matches: Match[]): Match[] {
  return matches.filter((m) => m.score?.ft !== undefined)
}

export function getPendingMatches(matches: Match[]): Match[] {
  return matches.filter((m) => !m.score?.ft)
}

export function getGroupMatches(matches: Match[], group: string): Match[] {
  return matches.filter((m) => m.group === `Group ${group}`)
}

export function getLatamMatches(matches: Match[]): Match[] {
  return matches.filter(
    (m) =>
      LATAM_TEAMS.includes(m.team1) ||
      LATAM_TEAMS.includes(m.team2)
  )
}

export function calcStandings(matches: Match[]): Map<string, TeamStanding> {
  const table = new Map<string, TeamStanding>()

  const ensure = (team: string, group: string) => {
    if (!table.has(team)) {
      table.set(team, {
        team,
        flag: '',
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
      })
    }
  }

  for (const m of matches) {
    if (!m.group) continue
    const group = m.group.replace('Group ', '')
    ensure(m.team1, group)
    ensure(m.team2, group)

    if (!m.score?.ft) continue

    const [g1, g2] = m.score.ft
    const t1 = table.get(m.team1)!
    const t2 = table.get(m.team2)!

    t1.played++
    t2.played++
    t1.gf += g1
    t1.ga += g2
    t2.gf += g2
    t2.ga += g1
    t1.gd = t1.gf - t1.ga
    t2.gd = t2.gf - t2.ga

    if (g1 > g2) {
      t1.won++
      t1.points += 3
      t2.lost++
    } else if (g1 < g2) {
      t2.won++
      t2.points += 3
      t1.lost++
    } else {
      t1.drawn++
      t2.drawn++
      t1.points++
      t2.points++
    }
  }

  return table
}

export function getGroupStandings(
  matches: Match[],
  group: string
): TeamStanding[] {
  const groupMatches = getGroupMatches(matches, group)
  const table = calcStandings(groupMatches)
  const teams = Array.from(table.values())

  teams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    return b.gf - a.gf
  })

  teams.forEach((t, i) => {
    t.position = i + 1
    const groupMatchCount = groupMatches.filter(
      (m) => m.team1 === t.team || m.team2 === t.team
    ).length
    const groupMatchesPlayed = groupMatches.filter(
      (m) => m.score?.ft && (m.team1 === t.team || m.team2 === t.team)
    ).length
    const totalGroupGames = groupMatchCount

    if (groupMatchesPlayed === totalGroupGames) {
      t.status = i < 2 ? 'qualified' : 'eliminated'
    } else if (groupMatchesPlayed > 0) {
      t.status = 'playing'
    } else {
      t.status = 'pending'
    }
  })

  return teams
}

export interface TournamentStats {
  topScorer: { name: string; team: string; goals: number } | null
  mostGoalsGroup: { group: string; total: number } | null
  avgGoalsPerMatch: number
  latamAlive: number
  fastestGoal: { name: string; team: string; minute: string; match: string } | null
  totalGoals: number
  matchesPlayed: number
  noDrawStreak: number
}

export function calcStats(matches: Match[]): TournamentStats {
  const played = getPlayedMatches(matches)
  const totalGoals = played.reduce(
    (s, m) => s + (m.score?.ft[0] ?? 0) + (m.score?.ft[1] ?? 0),
    0
  )
  const avgGoalsPerMatch = played.length > 0 ? totalGoals / played.length : 0

  // Top scorer
  const scorerMap = new Map<string, { team: string; goals: number }>()
  for (const m of played) {
    const addGoals = (goals: typeof m.goals1, team: string) => {
      if (!goals) return
      for (const g of goals) {
        const key = g.name
        const prev = scorerMap.get(key) ?? { team, goals: 0 }
        scorerMap.set(key, { team, goals: prev.goals + 1 })
      }
    }
    addGoals(m.goals1, m.team1)
    addGoals(m.goals2, m.team2)
  }
  let topScorer: TournamentStats['topScorer'] = null
  for (const [name, data] of scorerMap) {
    if (!topScorer || data.goals > topScorer.goals) {
      topScorer = { name, team: data.team, goals: data.goals }
    }
  }

  // Most goals group
  const groupGoals = new Map<string, number>()
  for (const m of played) {
    if (!m.group) continue
    const g = m.group.replace('Group ', '')
    const prev = groupGoals.get(g) ?? 0
    groupGoals.set(g, prev + (m.score?.ft[0] ?? 0) + (m.score?.ft[1] ?? 0))
  }
  let mostGoalsGroup: TournamentStats['mostGoalsGroup'] = null
  for (const [group, total] of groupGoals) {
    if (!mostGoalsGroup || total > mostGoalsGroup.total) {
      mostGoalsGroup = { group, total }
    }
  }

  // LATAM alive (not yet eliminated)
  const latamAlive = LATAM_TEAMS.filter((team) => {
    const teamMatches = matches.filter(
      (m) => m.group && (m.team1 === team || m.team2 === team)
    )
    const teamPlayed = teamMatches.filter((m) => m.score?.ft)
    const totalTeamGroupGames = teamMatches.length
    if (teamPlayed.length < totalTeamGroupGames) return true

    // Calculate standing in group
    let pts = 0
    for (const m of teamPlayed) {
      const [g1, g2] = m.score!.ft
      if (m.team1 === team) {
        pts += g1 > g2 ? 3 : g1 === g2 ? 1 : 0
      } else {
        pts += g2 > g1 ? 3 : g1 === g2 ? 1 : 0
      }
    }
    return pts >= 3
  }).length

  // Fastest goal
  let fastestGoal: TournamentStats['fastestGoal'] = null
  for (const m of played) {
    const check = (goals: typeof m.goals1, team: string) => {
      if (!goals) return
      for (const g of goals) {
        const min = parseInt(g.minute, 10)
        const curMin = fastestGoal ? parseInt(fastestGoal.minute, 10) : Infinity
        if (min < curMin) {
          fastestGoal = {
            name: g.name,
            team,
            minute: g.minute,
            match: `${m.team1} vs ${m.team2}`,
          }
        }
      }
    }
    check(m.goals1, m.team1)
    check(m.goals2, m.team2)
  }

  // No-draw streak (from end of played list)
  let noDrawStreak = 0
  for (let i = played.length - 1; i >= 0; i--) {
    const [g1, g2] = played[i].score!.ft
    if (g1 === g2) break
    noDrawStreak++
  }

  return {
    topScorer,
    mostGoalsGroup,
    avgGoalsPerMatch,
    latamAlive,
    fastestGoal,
    totalGoals,
    matchesPlayed: played.length,
    noDrawStreak,
  }
}
