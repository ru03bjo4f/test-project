import React from 'react'

import './styles.css'
import SiteFooter from './_components/SiteFooter'
import SiteHeader from './_components/SiteHeader'

export const metadata = {
  title: {
    default: '我的網站',
    template: '%s · 我的網站',
  },
  description: '使用自建內容管理系統打造的網站',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-Hant">
      <body>
        <SiteHeader />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
