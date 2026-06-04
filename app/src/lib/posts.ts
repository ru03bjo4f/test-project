import type { Where } from 'payload'

/**
 * 前台「可見文章」的查詢條件 (對應 WordPress 的發佈邏輯):
 *   1. 狀態為已發佈
 *   2. 發佈時間 <= 現在 (排程發佈: 未來時間的文章先隱藏, 到時間才出現)
 *      — 未設發佈時間者視為立即發佈, 仍顯示。
 *
 * 回傳條件「陣列」, 方便與其他條件 (如分類) 用 and 組合。
 */
export const publishedConditions = (): Where[] => [
  { _status: { equals: 'published' } },
  {
    or: [
      { publishedAt: { less_than_equal: new Date().toISOString() } },
      { publishedAt: { exists: false } },
    ],
  },
]

/** 包成單一 where 物件, 給只需要「可見文章」的查詢使用。 */
export const publishedPostsWhere = (): Where => ({ and: publishedConditions() })
