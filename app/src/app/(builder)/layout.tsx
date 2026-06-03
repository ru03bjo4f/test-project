import React from 'react'

export const metadata = {
  title: '視覺化編輯器',
}

/**
 * 視覺化編輯器專用版面 (獨立 root layout)，
 * 不套用前台的頁首/頁尾，讓 Puck 編輯器全頁顯示。
 */
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
