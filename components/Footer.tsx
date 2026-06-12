'use client'

export default function Footer() {
  const yapeLink = process.env.NEXT_PUBLIC_YAPE_LINK ?? process.env.YAPE_LINK ?? ''

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-6 px-4 text-center text-xs text-gray-400 dark:text-gray-600">
      <p className="mb-1">
        Datos:{' '}
        <a
          href="https://github.com/openfootball/worldcup.json"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#639922]"
        >
          openfootball
        </a>{' '}
        · Hecho con 💚 para LATAM
      </p>
      <p className="mb-3">Mundial 2026 · 11 jun – 19 jul · EE.UU. / México / Canadá</p>
      {yapeLink && (
        <a
          href={yapeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#639922]/30 text-[#639922] hover:bg-[#639922]/10 transition-colors"
        >
          💜 Apóyanos con Yape
        </a>
      )}
    </footer>
  )
}
