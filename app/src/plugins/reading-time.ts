import type { Post } from '@/payload-types'

import { addFilter, type Plugin } from './core'

/** 從 Lexical 內容遞迴取出純文字。 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (node.root) return extractText(node.root)
  if (Array.isArray(node.children)) return node.children.map(extractText).join('')
  return ''
}

/**
 * 示範外掛 (filter): 在文章中繼資料加上預估閱讀時間。
 * 對應 WP 常見的「閱讀時間」外掛。
 */
export const readingTime: Plugin = {
  name: '閱讀時間',
  description: '依內文字數計算預估閱讀時間，附加到文章的作者/日期資訊後。',
  register() {
    addFilter('post.meta', (items: string[], post: Post) => {
      const chars = extractText(post.content).length
      const minutes = Math.max(1, Math.round(chars / 400)) // 約每分鐘 400 字
      return [...items, `🕐 約 ${minutes} 分鐘閱讀`]
    })
  },
}
