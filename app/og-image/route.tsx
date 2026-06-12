import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const revalidate = 3600

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f1a08',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(45deg, #1a2e0f 0px, #1a2e0f 1px, transparent 1px, transparent 40px)',
            opacity: 0.4,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 80 }}>⚽</div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-1px',
            }}
          >
            Mundial 2026
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: '#639922',
            }}
          >
            LATAM Hub
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#9ca3af',
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            Resultados en vivo · Predicciones · Simulador de bracket · Datos curiosos
          </div>

          {/* Flags */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: 16,
              fontSize: 40,
            }}
          >
            <span>🇦🇷</span>
            <span>🇧🇷</span>
            <span>🇨🇴</span>
            <span>🇺🇾</span>
            <span>🇪🇨</span>
            <span>🇵🇾</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#639922',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
