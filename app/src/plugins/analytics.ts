import type { Post } from '@/payload-types'

import { addAction, type Plugin } from './core'

/**
 * 示範外掛 (action): 每次文章被瀏覽時於伺服器記錄一筆。
 * 展示 action 用於副作用 (記錄/統計/通知), 對應 WP 的 do_action。
 */
export const analytics: Plugin = {
  name: '瀏覽統計',
  description: '監聽文章瀏覽事件 (post.viewed)，於伺服器主控台記錄一筆瀏覽紀錄。',
  register() {
    addAction('post.viewed', (post: Post) => {
      console.log(`[analytics] 瀏覽文章: ${post.title} (id=${post.id})`)
    })
  },
}
