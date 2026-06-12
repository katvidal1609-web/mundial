'use client'

import { useState } from 'react'

const YAPE_NUMBER = '970300434'

export default function YapeFooter() {
  const [copied, setCopied] = useState(false)

  const copyYape = async () => {
    try {
      await navigator.clipboard.writeText(YAPE_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: number is visible on screen
    }
  }

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Support block */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              Si te sirvió esta página,{' '}
              <span className="text-accent-green">invitame un café ☕</span>
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Hecho con 💚 por un hincha más de LATAM
            </p>

            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-wide mb-4">
              📱 {YAPE_NUMBER}
            </p>

            <button
              onClick={copyYape}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all hover:scale-105 ${
                copied
                  ? 'bg-green-500'
                  : 'bg-[#6c3cbe] hover:bg-[#5c2cae]'
              }`}
            >
              {copied ? '¡Copiado! ✓' : '💜 Apoya con un Yape'}
            </button>
          </div>

          {/* RIGHT — QR block */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              ESCANEÁ PARA YAPEAR
            </p>
            <img
              src="/yape-qr.png"
              alt="QR Yape"
              className="w-full max-w-[220px] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
            />
            <p className="text-xs text-gray-400">
              Abrí Yape → Escanear QR
            </p>
          </div>

        </div>

        {/* Footer bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-600">
          <p>
            Datos:{' '}
            <a
              href="https://github.com/openfootball/worldcup.json"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent-green"
            >
              openfootball
            </a>
            {' '}· Análisis: Claude (Anthropic)
          </p>
          <p>Mundial 2026 · 11 jun – 19 jul · EE.UU. / México / Canadá</p>
        </div>

      </div>
    </footer>
  )
}
