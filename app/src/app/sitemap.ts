import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { SITE_URL } from '@/lib/site'
import { publishedPostsWhere } from '@/lib/posts'

/** 動態 sitemap.xml — 列出首頁、可見文章/頁面與分類/標籤彙整頁 (SEO)。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })

  const [posts, pages, categories, tags] = await Promise.all([
    payload.find({ collection: 'posts', where: publishedPostsWhere(), limit: 1000, depth: 0 }),
    payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({ collection: 'categories', limit: 1000, depth: 0 }),
    payload.find({ collection: 'tags', limit: 1000, depth: 0 }),
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
    ...categories.docs.map((c) => ({
      url: `${SITE_URL}/categories/${encodeURIComponent(c.slug ?? '')}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...tags.docs.map((t) => ({
      url: `${SITE_URL}/tags/${encodeURIComponent(t.slug ?? '')}`,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ]
}
