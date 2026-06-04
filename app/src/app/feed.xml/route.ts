import { getPayload } from 'payload'

import config from '@/payload.config'
import { SITE_URL, getSiteSettings } from '@/lib/site'
import { publishedPostsWhere } from '@/lib/posts'

const escapeXml = (s: string): string =>
  s.replace(
    /[<>&'"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!,
  )

/** RSS 訂閱來源 (/feed.xml) — 最新已發佈文章。 */
export async function GET() {
  const payload = await getPayload({ config: await config })
  const settings = await getSiteSettings()
  const { docs } = await payload.find({
    collection: 'posts',
    where: publishedPostsWhere(),
    sort: '-publishedAt',
    limit: 20,
    depth: 0,
  })

  const items = docs
    .map((p) => {
      const url = `${SITE_URL}/posts/${encodeURIComponent(p.slug ?? '')}`
      const date = new Date(p.publishedAt ?? p.createdAt).toUTCString()
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(p.excerpt ?? '')}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(settings.siteName)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(settings.siteDescription ?? '')}</description>
    <language>zh-TW</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
