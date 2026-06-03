'use client'

import { Puck, type Data } from '@measured/puck'
import '@measured/puck/puck.css'
import { useEffect, useState } from 'react'

import { config } from '@/puck/config'

/**
 * 視覺化拖拉編輯器 (對應 Elementor/Gutenberg 的編輯畫面)。
 * 按下「發佈」會把版面以 PATCH 寫回對應的頁面。
 * 透過 cookie 驗證 — 需先登入後台 (/admin)。
 */
export default function PuckEditor({
  pageId,
  initialData,
}: {
  pageId: number
  initialData: Data
}) {
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // 僅在瀏覽器端掛載 (Puck 用到拖拉/瀏覽器 API, 避免 SSR)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return <div style={{ padding: 40 }}>載入編輯器中…</div>
  }

  const save = async (data: Data) => {
    setMessage('儲存中…')
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ layout: data }),
      })
      if (res.ok) {
        setMessage('已儲存 ✓')
      } else if (res.status === 401 || res.status === 403) {
        setMessage('儲存失敗：請先登入後台 /admin 再回來編輯')
      } else {
        setMessage(`儲存失敗 (HTTP ${res.status})`)
      }
    } catch {
      setMessage('儲存失敗：網路錯誤')
    }
  }

  return (
    <div>
      {message && (
        <div
          style={{
            padding: '8px 16px',
            background: '#eff6ff',
            color: '#1e3a8a',
            fontSize: 14,
            fontFamily: 'system-ui',
          }}
        >
          {message}
        </div>
      )}
      <Puck config={config} data={initialData} onPublish={save} />
    </div>
  )
}
