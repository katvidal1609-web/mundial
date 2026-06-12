export interface Goal {
  name: string
  minute: string
}

export interface Score {
  ft: [number, number]
  ht?: [number, number]
}

export interface Match {
  round: string
  date: string
  time: string
  team1: string
  team2: string
  score?: Score
  goals1?: Goal[]
  goals2?: Goal[]
  group?: string
  ground?: string
}

export interface Fixture {
  name: string
  matches: Match[]
}

export interface TeamStanding {
  team: string
  flag: string
  group: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
  position: number
  status: 'playing' | 'qualified' | 'eliminated' | 'pending'
}

export type TabId = 'ranking' | 'predicciones' | 'simulador' | 'curiosidades'

export interface VoteCount {
  team1: number
  draw: number
  team2: number
  total: number
}

export interface BracketSlot {
  id: string
  label: string
  team?: string
  isProjected?: boolean
}
