'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <div>
            <div className="font-bold text-sm leading-tight text-gray-900 dark:text-white">
              Mundial 2026
            </div>
            <div className="text-xs text-[#639922] font-semibold leading-tight">
              LATAM Hub
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          En vivo
        </div>
      </div>
    </header>
  )
}
