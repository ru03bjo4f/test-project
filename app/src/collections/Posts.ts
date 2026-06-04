import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'
import {
  isLoggedIn,
  isAdminOrEditorOrOwner,
  publishedOrPrivileged,
} from '../access/roles'

/** Posts — 對應 WordPress 的文章 (wp_posts, post_type=post)。 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: '文章', plural: '文章' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', '_status', 'publishedAt'],
    group: '內容',
  },
  access: {
    read: publishedOrPrivileged,
    create: isLoggedIn,
    update: isAdminOrEditorOrOwner('author'),
    delete: isAdminOrEditorOrOwner('author'),
  },
  versions: { drafts: true }, // 草稿/發佈 + 修訂版本 (對應 WP revisions)
  fields: [
    { name: 'title', type: 'text', required: true, label: '標題' },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      label: '摘要',
      admin: { description: '對應 WP 的摘要 (excerpt)。' },
    },
    { name: 'content', type: 'richText', label: '內文' },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: '精選圖片',
      admin: { description: '對應 WP 的 featured image。' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: '分類',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: '標籤',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: '作者',
      admin: { position: 'sidebar' },
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: '發佈時間',
      admin: { position: 'sidebar' },
    },
  ],
}
