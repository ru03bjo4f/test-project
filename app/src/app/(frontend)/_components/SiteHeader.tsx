import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

/**
 * 網站頁首 — 品牌 + 導覽列。
 * 導覽自動列出已發佈的「頁面」(對應 WP 的選單)。
 */
export default async function SiteHeader() {
  const payload = await getPayload({ config: await config })
  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    sort: 'title',
    depth: 0,
    limit: 6,
  })

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand">
          我的網站
        </Link>
        <nav className="site-nav">
          <Link href="/">首頁</Link>
          {pages.map((page) => (
            <Link key={page.id} href={`/pages/${page.slug}`}>
              {page.title}
            </Link>
          ))}
          <Link href="/plugins">外掛</Link>
          <a href="/admin" className="site-nav__admin">
            後台管理
          </a>
        </nav>
      </div>
    </header>
  )
}
