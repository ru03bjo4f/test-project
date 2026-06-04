import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { getSiteSettings } from '@/lib/site'
import { getMediaAlt, getMediaURL } from '../_lib/format'

/**
 * 網站頁首 — 站名/Logo + 導覽列。
 * 站名與選單來自網站設定; 選單未設定時自動列出已發佈頁面 (對應 WP 選單)。
 */
export default async function SiteHeader() {
  const settings = await getSiteSettings()

  // 選單: 優先用設定的主選單, 否則自動列出已發佈頁面
  let menu: { label: string; href: string }[]
  if (settings.mainMenu && settings.mainMenu.length > 0) {
    menu = settings.mainMenu.map((m) => ({ label: m.label, href: m.url }))
  } else {
    const payload = await getPayload({ config: await config })
    const { docs: pages } = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      sort: 'title',
      depth: 0,
      limit: 6,
    })
    menu = pages.map((p) => ({ label: p.title, href: `/pages/${p.slug}` }))
  }

  const logo = getMediaURL(settings.logo)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={getMediaAlt(settings.logo)} style={{ height: 32 }} />
          ) : (
            settings.siteName
          )}
        </Link>
        <nav className="site-nav">
          <Link href="/">首頁</Link>
          {menu.map((item, index) => (
            <Link key={index} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact">聯絡</Link>
          <Link href="/plugins">外掛</Link>
          <form action="/search" className="search-form" role="search">
            <input type="search" name="q" placeholder="搜尋…" aria-label="搜尋" />
          </form>
          <a href="/admin" className="site-nav__admin">
            後台管理
          </a>
        </nav>
      </div>
    </header>
  )
}
