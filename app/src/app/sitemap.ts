import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { SITE_URL } from '@/lib/site'

/** 動態 sitemap.xml — 列出首頁與所有已發佈的文章、頁面 (SEO)。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })

  const [posts, pages] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
  ])

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...posts.docs.map((p) => ({
      url: `${SITE_URL}/posts/${encodeURIComponent(p.slug ?? '')}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...pages.docs.map((p) => ({
      url: `${SITE_URL}/pages/${encodeURIComponent(p.slug ?? '')}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
