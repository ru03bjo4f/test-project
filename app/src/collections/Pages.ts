import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'
import { isAdminOrEditor, publishedOrPrivileged } from '../access/roles'

/** Pages — 對應 WordPress 的頁面 (wp_posts, post_type=page)，支援階層。 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: '頁面', plural: '頁面' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'updatedAt'],
    group: '內容',
  },
  access: {
    read: publishedOrPrivileged,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, label: '標題' },
    slugField('title'),
    { name: 'content', type: 'richText', label: '內文 (純文字模式)' },
    {
      name: 'layout',
      type: 'json',
      label: '視覺化版面',
      admin: {
        description:
          '由視覺化編輯器產生的拖拉版面資料 (對應 Elementor/Gutenberg)。請至 /builder/<slug> 以拖拉方式編輯; 有版面時前台優先顯示版面而非純文字內文。',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      label: '父頁面',
      admin: { position: 'sidebar', description: '對應 WP 的階層頁面 (parent page)。' },
    },
  ],
}
