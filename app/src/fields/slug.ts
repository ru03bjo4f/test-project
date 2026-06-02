import type { Field } from 'payload'

/** 將文字轉為網址友善的 slug (對應 WP 的 permalink/別名)。 */
const formatSlug = (val: string): string =>
  val
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

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
