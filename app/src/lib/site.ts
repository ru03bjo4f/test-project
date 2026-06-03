import { getPayload } from 'payload'

import config from '@/payload.config'
import type { SiteSetting } from '@/payload-types'

/** 讀取全站設定 (對應 WP 的一般設定)。 */
export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getPayload({ config: await config })
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

/** 網站對外網址 (用於 sitemap / SEO 絕對連結)。 */
export const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
