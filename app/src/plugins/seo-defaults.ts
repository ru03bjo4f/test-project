import type { Metadata } from 'next'

import type { Post } from '@/payload-types'

import { addFilter, type Plugin } from './core'

/**
 * 示範外掛 (filter): 為文章自動補上 Open Graph 等 SEO 中繼資料。
 * 對應 WP 的 Yoast SEO 之類外掛。
 */
export const seoDefaults: Plugin = {
  name: 'SEO 強化',
  description: '為文章頁自動產生 Open Graph 中繼資料，提升社群分享與搜尋顯示效果。',
  register() {
    addFilter('post.seo', (meta: Metadata, post: Post): Metadata => ({
      ...meta,
      openGraph: {
        title: post.title,
        description: meta.description ?? undefined,
        type: 'article',
      },
    }))
  },
}
