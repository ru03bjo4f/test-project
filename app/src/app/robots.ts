import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

/** robots.txt — 允許前台被索引, 禁止後台/API/編輯器 (SEO + 安全)。 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/builder'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
