import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../data/fixture-snapshot.json')

const URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

async function run() {
  console.log('Fetching fixture from openfootball...')
  const res = await fetch(URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  writeFileSync(OUT, JSON.stringify(data, null, 2))
  console.log(`Saved ${data.matches.length} matches to ${OUT}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
