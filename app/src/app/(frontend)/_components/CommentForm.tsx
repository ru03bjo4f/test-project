'use client'

import { useState } from 'react'

/** 留言表單 — 送出後建立未核准留言, 待後台審核。 */
export default function CommentForm({ postId }: { postId: number }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus('sending')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: postId,
          authorName: fd.get('authorName'),
          email: fd.get('email'),
          content: fd.get('content'),
        }),
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
    return <p className="form-success">留言已送出，待管理員審核後顯示。</p>
  }

  return (
    <form onSubmit={onSubmit} className="cms-form">
      <label>
        暱稱
        <input name="authorName" required />
      </label>
      <label>
        電子郵件 (選填，不公開)
        <input type="email" name="email" />
      </label>
      <label>
        留言
        <textarea name="content" rows={4} required />
      </label>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? '送出中…' : '送出留言'}
      </button>
      {status === 'error' && <p className="form-error">送出失敗，請稍後再試。</p>}
    </form>
  )
}
