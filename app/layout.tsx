import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundial2026latam.vercel.app'

export const metadata: Metadata = {
  title: 'Mundial 2026 en vivo — Resultados, predicciones y datos para LATAM',
  description:
    'Seguí el Mundial 2026 con los ojos de LATAM: resultados en vivo, tabla de posiciones, predicciones y datos curiosos de Argentina, Brasil, Colombia, Uruguay, Ecuador y Paraguay.',
  keywords: [
    'Mundial 2026',
    'Copa del Mundo 2026',
    'fixture Mundial 2026',
    'resultados Mundial 2026',
    'Argentina Mundial',
    'Brasil Mundial',
    'Colombia Mundial',
    'Uruguay Mundial',
    'Ecuador Mundial',
    'Paraguay Mundial',
    'LATAM fútbol',
  ],
  openGraph: {
    title: 'Mundial 2026 · LATAM Hub',
    description: 'Resultados, predicciones y datos para hinchada latinoamericana',
    url: SITE_URL,
    siteName: 'Mundial 2026 LATAM Hub',
    images: [
      {
        url: `${SITE_URL}/og-image`,
        width: 1200,
        height: 630,
        alt: 'Mundial 2026 LATAM Hub',
      },
    ],
    locale: 'es_419',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundial 2026 · LATAM Hub',
    description: 'Resultados, predicciones y datos para la hinchada latinoamericana',
    images: [`${SITE_URL}/og-image`],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
