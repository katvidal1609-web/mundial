import { fetchFixture } from '@/lib/fixture'
import Hero from '@/components/Hero'
import RankingAndPredictions from '@/components/RankingAndPredictions'
import AIAnalysis from '@/components/AIAnalysis'
import CuriousFacts from '@/components/CuriousFacts'
import BracketSimulator from '@/components/BracketSimulator'
import YapeFooter from '@/components/YapeFooter'

export const revalidate = 60

export default async function Home() {
  const fixture = await fetchFixture()
  const { matches } = fixture

  return (
    <div className="min-h-screen">
      <Hero matches={matches} />
      <RankingAndPredictions matches={matches} />
      <AIAnalysis />
      <CuriousFacts matches={matches} />
      <BracketSimulator matches={matches} />
      <YapeFooter />
    </div>
  )
}
