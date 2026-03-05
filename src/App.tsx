import { useEffect, useState } from 'react'
import { getWebApp, getUserData } from './telegram'

type Recipient = {
  id: number
  username?: string
  fullName: string
}

type BasicUser = {
  id: number
  username?: string
  first_name?: string
  last_name?: string
}

// URL orqali kelgan user ma'lumotlarini o'qish (?user_id=...&username=...&first_name=...&last_name=...)
function getUserFromQuery(): BasicUser | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const idStr = params.get('user_id')
  if (!idStr) return null
  const id = Number(idStr)
  if (!Number.isFinite(id)) return null

  const username = params.get('username') || undefined
  const first_name = params.get('first_name') || undefined
  const last_name = params.get('last_name') || undefined

  return { id, username, first_name, last_name }
}

function buildRecipient(user: BasicUser): Recipient {
  const fullName =
    [user.first_name, user.last_name].filter((x) => x && x.trim().length > 0).join(' ') || 'User'
  return {
    id: user.id,
    username: user.username,
    fullName,
  }
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

    const initUser = getUserData()
    const queryUser = getUserFromQuery()
    const effectiveUser: BasicUser | null = initUser ?? queryUser

    setDebug({
      isAvailable: !!wa,
      initDataLength: (wa?.initData ?? '').length,
      initDataPreview: (wa?.initData ?? '').slice(0, 80) || "(bo'sh)",
      userFromInitData: initUser
        ? { id: initUser.id, username: initUser.username, first_name: initUser.first_name }
        : null,
      userFromQuery: queryUser,
    })

    if (effectiveUser) {
      setUsernameInput(effectiveUser.username ? `@${effectiveUser.username}` : '')
      setRecipient(buildRecipient(effectiveUser))
    }
  }, [])

  const handleMyself = () => {
    const initUser = getUserData()
    const queryUser = getUserFromQuery()
    const effectiveUser: BasicUser | null = initUser ?? queryUser

    if (!effectiveUser) {
      alert(
        "Telegram ma'lumotlari topilmadi. Mini App'ni Telegram ichidan (bot tugmasi) oching yoki username ni qo'lda kiriting."
      )
      return
    }

    setUsernameInput(effectiveUser.username ? `@${effectiveUser.username}` : '')
    setRecipient(buildRecipient(effectiveUser))
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
