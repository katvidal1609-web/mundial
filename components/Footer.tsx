'use client'

import { useState } from 'react'

const YAPE_NUMBER = '970300434'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const copyYape = async () => {
    try {
      await navigator.clipboard.writeText(YAPE_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: show the number anyway
    }
  }

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 pt-8 pb-10 px-4">
      {/* Support section */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <p className="text-base text-gray-600 dark:text-gray-300 mb-1">
          Si te sirvió esta página, invitame un café ☕
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
          Hecho con 💚 por un hincha más de LATAM
        </p>
        <div className="inline-flex flex-col items-center gap-3">
          <img
            src="/yape-qr.png"
            alt="QR Yape"
            className="w-full max-w-[200px] rounded-2xl shadow-md"
          />
          <div className="text-2xl font-black text-gray-900 dark:text-white tracking-wide">
            📱 {YAPE_NUMBER}
          </div>
          <button
            onClick={copyYape}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              copied
                ? 'bg-green-500 text-white scale-95'
                : 'bg-[#6c3cbe] hover:bg-[#5c2cae] text-white hover:scale-105'
            }`}
          >
            {copied ? '¡Copiado! ✓' : '💜 Apoya con un Yape'}
          </button>
          {copied && (
            <p className="text-xs text-green-600 dark:text-green-400 animate-fade-in">
              Número copiado al portapapeles
            </p>
          )}
        </div>
      </div>

      {/* Standard footer info */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-600 space-y-1">
        <p>
          Datos:{' '}
          <a
            href="https://github.com/openfootball/worldcup.json"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#639922]"
          >
            openfootball
          </a>{' '}
          · Análisis por Claude (Anthropic)
        </p>
        <p>Mundial 2026 · 11 jun – 19 jul · EE.UU. / México / Canadá</p>
      </div>
    </footer>
  )
}
