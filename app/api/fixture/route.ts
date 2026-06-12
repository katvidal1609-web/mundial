import { NextResponse } from 'next/server'

const OPENFOOTBALL_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

export const revalidate = 60

export async function GET() {
  try {
    const res = await fetch(OPENFOOTBALL_URL, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (err) {
    const snapshot = await import('../../../data/fixture-snapshot.json')
    return NextResponse.json(snapshot.default, {
      headers: { 'X-Data-Source': 'snapshot' },
    })
  }
}
