import type { Category, Media, Tag, User } from '@/payload-types'

/** 將日期格式化為繁體中文 (對應 WP 的發佈日期顯示)。 */
export const formatDate = (value?: string | null): string => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** 從關聯的 Media 取出圖片網址 (depth 不足時為純 id, 回傳 null)。 */
export const getMediaURL = (media?: (number | null) | Media): string | null => {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

/** 取出圖片替代文字。 */
export const getMediaAlt = (media?: (number | null) | Media): string => {
  if (!media || typeof media === 'number') return ''
  return media.alt ?? ''
}

/** 取出作者顯示名稱, 無則顯示「匿名」。 */
export const getAuthorName = (author?: (number | null) | User): string => {
  if (!author || typeof author === 'number') return '匿名'
  return author.name || author.email || '匿名'
}

/** 取出分類名稱陣列 (略過尚未展開的純 id)。 */
export const getCategoryNames = (
  categories?: (number | Category)[] | null,
): string[] => {
  if (!categories) return []
  return categories
    .filter((c): c is Category => typeof c !== 'number')
    .map((c) => c.name)
}

export type TermLink = { name: string; slug: string }

/**
 * 從關聯的分類/標籤取出 { 名稱, slug } 供連結到彙整頁。
 * 略過尚未展開的純 id, 以及沒有 slug 的項目。
 */
export const getTermLinks = (
  terms?: (number | Category | Tag)[] | null,
): TermLink[] => {
  if (!terms) return []
  return terms
    .filter((t): t is Category | Tag => typeof t !== 'number')
    .map((t) => ({ name: t.name, slug: t.slug ?? '' }))
    .filter((t) => t.slug !== '')
}
