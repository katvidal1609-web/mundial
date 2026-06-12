const TEAMS: Record<string, string> = {
  // LATAM
  Brazil: 'Brasil',
  Mexico: 'México',
  // North America
  'United States': 'Estados Unidos',
  USA: 'EE.UU.',
  Canada: 'Canadá',
  // Europe
  Spain: 'España',
  France: 'Francia',
  Germany: 'Alemania',
  England: 'Inglaterra',
  Netherlands: 'Países Bajos',
  Italy: 'Italia',
  Belgium: 'Bélgica',
  Croatia: 'Croacia',
  Switzerland: 'Suiza',
  Poland: 'Polonia',
  Ukraine: 'Ucrania',
  Denmark: 'Dinamarca',
  Sweden: 'Suecia',
  Austria: 'Austria',
  Turkey: 'Turquía',
  Romania: 'Rumania',
  Hungary: 'Hungría',
  Slovakia: 'Eslovaquia',
  'Czech Republic': 'República Checa',
  Czechia: 'República Checa',
  Slovenia: 'Eslovenia',
  Albania: 'Albania',
  Georgia: 'Georgia',
  Scotland: 'Escocia',
  Wales: 'Gales',
  'Northern Ireland': 'Irlanda del Norte',
  Greece: 'Grecia',
  Serbia: 'Serbia',
  // Africa
  Morocco: 'Marruecos',
  Senegal: 'Senegal',
  Tunisia: 'Túnez',
  Nigeria: 'Nigeria',
  'Ivory Coast': 'Costa de Marfil',
  Cameroon: 'Camerún',
  'South Africa': 'Sudáfrica',
  Egypt: 'Egipto',
  Algeria: 'Argelia',
  Ghana: 'Ghana',
  'DR Congo': 'Rep. Dem. del Congo',
  'Cape Verde': 'Cabo Verde',
  Libya: 'Libia',
  Guinea: 'Guinea',
  Mozambique: 'Mozambique',
  Tanzania: 'Tanzania',
  Angola: 'Angola',
  Benin: 'Benín',
  // Asia
  Japan: 'Japón',
  'South Korea': 'Corea del Sur',
  Australia: 'Australia',
  'Saudi Arabia': 'Arabia Saudita',
  Iran: 'Irán',
  Iraq: 'Irak',
  Jordan: 'Jordania',
  Qatar: 'Catar',
  Uzbekistan: 'Uzbekistán',
  Indonesia: 'Indonesia',
  Philippines: 'Filipinas',
  Thailand: 'Tailandia',
  Vietnam: 'Vietnam',
  Kuwait: 'Kuwait',
  Bahrain: 'Baréin',
  Oman: 'Omán',
  UAE: 'Emiratos Árabes',
  Israel: 'Israel',
  'New Zealand': 'Nueva Zelanda',
  // CONCACAF
  Panama: 'Panamá',
  Honduras: 'Honduras',
  'Costa Rica': 'Costa Rica',
  Cuba: 'Cuba',
  Jamaica: 'Jamaica',
  'Trinidad and Tobago': 'Trinidad y Tobago',
  Curacao: 'Curazao',
  'Curaçao': 'Curazao',
  // South America (others)
  Venezuela: 'Venezuela',
  Chile: 'Chile',
  Bolivia: 'Bolivia',
}

const ROUNDS: Record<string, string> = {
  'Matchday 1': 'Fecha 1',
  'Matchday 2': 'Fecha 2',
  'Matchday 3': 'Fecha 3',
  'Round of 32': 'Ronda de 32',
  'Round of 16': 'Octavos de final',
  'Quarter-final': 'Cuartos de final',
  'Semi-final': 'Semifinal',
  Final: 'Final',
  'Third-place play-off': 'Tercer puesto',
  'Third place play-off': 'Tercer puesto',
}

export function t(name: string): string {
  return TEAMS[name] ?? name
}

export function tRound(round: string): string {
  return ROUNDS[round] ?? round
}

export function tGroup(group: string): string {
  return group.replace('Group ', 'Grupo ')
}
