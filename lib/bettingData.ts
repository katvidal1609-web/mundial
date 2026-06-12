// FIFA Rankings (June 2026, approximate)
export const FIFA_RANKINGS: Record<string, number> = {
  Argentina: 1,
  France: 2,
  Brazil: 3,
  Spain: 4,
  Germany: 5,
  Portugal: 6,
  England: 7,
  Netherlands: 8,
  Italy: 9,
  Morocco: 10,
  Colombia: 11,
  Mexico: 16,
  Uruguay: 13,
  Japan: 17,
  'United States': 14,
  Belgium: 15,
  Canada: 38,
  Croatia: 10,
  Denmark: 21,
  Switzerland: 19,
  Poland: 23,
  Senegal: 20,
  Serbia: 35,
  Ecuador: 44,
  Paraguay: 51,
  'Saudi Arabia': 54,
  'South Korea': 23,
  Australia: 24,
  Iran: 25,
  Tunisia: 30,
  Nigeria: 33,
  Cameroon: 43,
  Ghana: 60,
  'Ivory Coast': 57,
  'South Africa': 62,
  Algeria: 36,
  Egypt: 34,
  'DR Congo': 68,
  Turkey: 29,
  Romania: 46,
  Ukraine: 22,
  Hungary: 26,
  Sweden: 32,
  Austria: 28,
  Slovakia: 48,
  Slovenia: 55,
  'Czech Republic': 37,
  Czechia: 37,
  Georgia: 75,
  Albania: 67,
  Scotland: 39,
  Wales: 47,
  Greece: 51,
  Israel: 64,
  Iraq: 72,
  Qatar: 70,
  Uzbekistan: 69,
  Indonesia: 130,
  Philippines: 145,
  Vietnam: 116,
  'New Zealand': 95,
  Panama: 49,
  Honduras: 78,
  'Costa Rica': 41,
  Jamaica: 56,
  'Trinidad and Tobago': 89,
  Venezuela: 58,
  Chile: 42,
  Bolivia: 85,
  Cuba: 175,
}

// LATAM star players (static data)
export const LATAM_STARS: Record<
  string,
  { name: string; position: string; stat: string; club: string; number: number }
> = {
  Argentina: {
    name: 'Lionel Messi',
    position: 'Delantero',
    stat: 'Campeón del Mundo 2022 · 109 goles internacionales · 6º Mundial',
    club: 'Inter Miami',
    number: 10,
  },
  Brazil: {
    name: 'Vinicius Jr.',
    position: 'Delantero',
    stat: 'Balón de Oro 2024 · 24 goles en club 2024/25 · Real Madrid',
    club: 'Real Madrid',
    number: 7,
  },
  Colombia: {
    name: 'Luis Díaz',
    position: 'Delantero',
    stat: 'Copa América 2024 Finalista · 18 goles con Liverpool en 2024/25',
    club: 'Liverpool',
    number: 7,
  },
  Uruguay: {
    name: 'Darwin Núñez',
    position: 'Delantero',
    stat: '17 goles Premier League · Liverpool FC · 29 goles internacionales',
    club: 'Liverpool',
    number: 19,
  },
  Ecuador: {
    name: 'Enner Valencia',
    position: 'Delantero',
    stat: 'Goleador histórico de Ecuador · 37 goles en 79 partidos',
    club: 'Internacional',
    number: 13,
  },
  Paraguay: {
    name: 'Miguel Almirón',
    position: 'Mediocampista',
    stat: '21 goles en Premier League con Newcastle · 40+ caps',
    club: 'Newcastle United',
    number: 10,
  },
}

// H2H history (static) — key is alphabetically sorted teams joined by "_"
const H2H_FACTS: Record<
  string,
  { summary: string; t1Wins: number; draws: number; t2Wins: number }
> = {
  Argentina_France: {
    summary: 'Argentina campeón en Qatar 2022 (Final, penales). El duelo más épico de los últimos años.',
    t1Wins: 7, draws: 2, t2Wins: 5,
  },
  Argentina_Germany: {
    summary: 'Argentina campeón en Alemania 1986 y Estados Unidos 1994. Historial igualado en mundiales.',
    t1Wins: 8, draws: 5, t2Wins: 10,
  },
  Argentina_Spain: {
    summary: 'Sin enfrentamientos recientes. Argentina llega como campeón defensor.',
    t1Wins: 9, draws: 5, t2Wins: 8,
  },
  Argentina_Netherlands: {
    summary: 'Argentina ganó en penales en cuartos de Qatar 2022. Historial parejo.',
    t1Wins: 10, draws: 7, t2Wins: 9,
  },
  Brazil_France: {
    summary: 'Francia eliminó a Brasil en cuartos del Mundial 2006 (1-0 Zidane).',
    t1Wins: 7, draws: 4, t2Wins: 7,
  },
  Brazil_Germany: {
    summary: 'Alemania goleó 7-1 a Brasil en la semifinal del Mundial Brasil 2014.',
    t1Wins: 13, draws: 5, t2Wins: 17,
  },
  Brazil_Spain: {
    summary: 'Brasil goleó 3-0 a España en la final de la Confederaciones 2013.',
    t1Wins: 11, draws: 8, t2Wins: 6,
  },
  Argentina_Brazil: {
    summary: 'El Superclásico de las Américas. Argentina campeón Copa América 2021 ante Brasil.',
    t1Wins: 38, draws: 25, t2Wins: 43,
  },
  Colombia_England: {
    summary: 'Inglaterra eliminó a Colombia en octavos del Mundial Rusia 2018 (penales).',
    t1Wins: 2, draws: 3, t2Wins: 5,
  },
  Ecuador_Netherlands: {
    summary: 'Ecuador y Países Bajos empataron en el Mundial Qatar 2022 (1-1).',
    t1Wins: 1, draws: 2, t2Wins: 4,
  },
  Uruguay_Portugal: {
    summary: 'Portugal derrotó a Uruguay en fase de grupos Rusia 2018 (2-1, gol Pepe y CR7).',
    t1Wins: 1, draws: 0, t2Wins: 2,
  },
  Argentina_Mexico: {
    summary: 'Argentina ganó 2-0 a México en Qatar 2022 (fase de grupos, golazo Messi).',
    t1Wins: 15, draws: 8, t2Wins: 7,
  },
  Brazil_Mexico: {
    summary: 'Brasil eliminó a México en octavos en 2002 y 2014. Brasil favorito histórico.',
    t1Wins: 8, draws: 2, t2Wins: 1,
  },
  'Colombia_United States': {
    summary: 'Colombia finalista de Copa América 2024, eliminó a Estados Unidos en semis.',
    t1Wins: 4, draws: 3, t2Wins: 5,
  },
}

export function getH2H(
  team1: string,
  team2: string,
): { summary: string; t1Wins: number; draws: number; t2Wins: number; team1: string; team2: string } | null {
  const sorted = [team1, team2].sort()
  const key = sorted.join('_')
  const data = H2H_FACTS[key]
  if (!data) return null
  // Return with correct orientation
  if (sorted[0] === team1) {
    return { ...data, team1, team2 }
  } else {
    return { summary: data.summary, t1Wins: data.t2Wins, draws: data.draws, t2Wins: data.t1Wins, team1, team2 }
  }
}

// Pre-tournament classification probabilities (FIFA ranking based)
const BASE_PASS_PCT: Record<string, number> = {
  Argentina: 92,
  Brazil: 89,
  Colombia: 75,
  Uruguay: 72,
  Ecuador: 55,
  Paraguay: 48,
}

export function getPassPct(
  team: string,
  position: number,
  played: number,
): number {
  const base = BASE_PASS_PCT[team] ?? 50
  if (played === 0) return base
  if (position === 1) return Math.min(96, base + 10)
  if (position === 2) return Math.min(90, base + 4)
  if (position === 3) return 30
  return 8
}
