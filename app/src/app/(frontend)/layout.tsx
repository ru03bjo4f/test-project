import type { Metadata } from 'next'
import React from 'react'

import { getSiteSettings } from '@/lib/site'
import './styles.css'
import SiteFooter from './_components/SiteFooter'
import SiteHeader from './_components/SiteHeader'

/** 網站中繼資料 — 標題/描述來自網站設定 (SEO)。 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: {
      default: settings.siteName,
      template: `%s · ${settings.siteName}`,
    },
    description: settings.siteDescription || '使用自建內容管理系統打造的網站',
  }
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
