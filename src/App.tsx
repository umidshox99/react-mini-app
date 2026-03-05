import { useEffect, useState } from 'react'
import { getWebApp, getUserData } from './telegram'

type Recipient = {
  id: number
  username?: string
  fullName: string
}

export default function App() {
  const [recipient, setRecipient] = useState<Recipient | null>(null)
  const [usernameInput, setUsernameInput] = useState('')
  const [debug, setDebug] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const wa = getWebApp()
    if (wa) {
      wa.ready()
      wa.expand()
      wa.disableVerticalSwipes?.()
    }

    const user = getUserData()
    setDebug({
      isAvailable: !!wa,
      initDataLength: (wa?.initData ?? '').length,
      initDataPreview: (wa?.initData ?? '').slice(0, 80) || '(bo\'sh)',
      user: user ? { id: user.id, username: user.username, first_name: user.first_name } : null,
    })

    if (user) {
      setUsernameInput(user.username ? `@${user.username}` : '')
      setRecipient({
        id: user.id,
        username: user.username,
        fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User',
      })
    }
  }, [])

  const handleMyself = () => {
    const user = getUserData()
    if (!user) {
      alert(
        "Telegram ma'lumotlari topilmadi. Mini App'ni Telegram ichidan (bot tugmasi) oching yoki username ni qo'lda kiriting."
      )
      return
    }
    setUsernameInput(user.username ? `@${user.username}` : '')
    setRecipient({
      id: user.id,
      username: user.username,
      fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User',
    })
  }

  return (
    <div style={{ minHeight: '100vh', padding: 16 }}>
      <h1 style={{ fontSize: 20, marginBottom: 20 }}>Toʻlov (React test)</h1>

      {/* Kimga yuboramiz? */}
      <div
        style={{
          padding: 16,
          borderRadius: 16,
          background: '#1a1a2e',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: recipient ? 12 : 0 }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Kimga yuboramiz?</span>
          <div
            style={{
              flex: '1 1 140px',
              minWidth: 120,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 14,
              paddingRight: 4,
              borderRadius: 22,
              background: '#0f0f1e',
              border: '1px solid rgba(255,255,255,0.1)',
              height: 44,
            }}
          >
            <span style={{ marginRight: 8, opacity: 0.6 }}>🔍</span>
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Telegram @username kiriting..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#fff',
                fontSize: 14,
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleMyself}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontWeight: 600,
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            Oʻzimga olamiz
          </button>
        </div>

        {recipient && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 12,
              border: '2px solid rgba(34,197,94,0.4)',
              background: 'rgba(22,163,74,0.1)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{recipient.fullName}</div>
              {recipient.username && (
                <div style={{ fontSize: 14, opacity: 0.85 }}>@{recipient.username}</div>
              )}
              <div style={{ fontSize: 12, opacity: 0.65 }}>ID: {recipient.id}</div>
            </div>
            <span style={{ color: '#22c55e' }}>✓</span>
          </div>
        )}
      </div>

      {/* Debug */}
      <details style={{ marginTop: 24, fontSize: 12, opacity: 0.8 }}>
        <summary style={{ cursor: 'pointer' }}>Telegram debug</summary>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: 8 }}>
          {JSON.stringify(debug, null, 2)}
        </pre>
      </details>
    </div>
  )
}
