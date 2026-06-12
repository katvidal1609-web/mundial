import { fetchFixture } from '@/lib/fixture'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import LatamRanking from '@/components/LatamRanking'
import Predictions from '@/components/Predictions'
import CuriousFacts from '@/components/CuriousFacts'
import BracketSimulator from '@/components/BracketSimulator'
import AIAnalysis from '@/components/AIAnalysis'

export const revalidate = 60

export default async function Home() {
  const fixture = await fetchFixture()
  const { matches } = fixture

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-16">
        <Hero matches={matches} />

        <PageSection>
          <LatamRanking matches={matches} />
        </PageSection>

        <PageSection>
          <Predictions matches={matches} />
        </PageSection>

        <PageSection>
          <CuriousFacts matches={matches} />
        </PageSection>

        <PageSection>
          <BracketSimulator matches={matches} />
        </PageSection>

        <PageSection>
          <AIAnalysis />
        </PageSection>
      </main>
      <Footer />
    </div>
  )
}

function PageSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
      {children}
    </section>
  )
}
