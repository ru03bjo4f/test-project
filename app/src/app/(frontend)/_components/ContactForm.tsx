'use client'

import { useState } from 'react'

/** 聯絡表單 (對應 Contact Form 7) — 送出後存進 submissions 集合。 */
export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('ok')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return <p className="form-success">感謝您的訊息，我們已收到！</p>
  }

  return (
    <form onSubmit={onSubmit} className="cms-form">
      <label>
        姓名
        <input name="name" required />
      </label>
      <label>
        電子郵件
        <input type="email" name="email" required />
      </label>
      <label>
        訊息
        <textarea name="message" rows={5} required />
      </label>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? '送出中…' : '送出'}
      </button>
      {status === 'error' && <p className="form-error">送出失敗，請稍後再試。</p>}
    </form>
  )
}
