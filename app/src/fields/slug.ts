import type { Field } from 'payload'

/**
 * 將文字轉為網址友善的 slug (對應 WP 的 permalink/別名)。
 * 使用 Unicode 比對 (\p{L}\p{N}) 以保留中文字元 —
 * 若用 \w 會把中文全部移除導致 slug 變空字串。
 */
const formatSlug = (val: string): string =>
  val
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // 空白轉連字號
    .replace(/[^\p{L}\p{N}-]+/gu, '') // 移除標點符號, 保留各語系文字與數字
    .replace(/-+/g, '-') // 合併連續連字號
    .replace(/^-|-$/g, '') // 去除頭尾連字號

/**
 * 可重用的 slug 欄位 — 單一真實來源，供所有集合共用。
 * 留空時自動由指定欄位 (預設 title) 產生。
 */
export const slugField = (trackingField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: '網址別名；留空會自動由標題產生 (對應 WP permalink)。',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return formatSlug(value)
        const fallback = data?.[trackingField]
        if (typeof fallback === 'string' && fallback.length > 0) return formatSlug(fallback)
        return value
      },
    ],
  },
})
