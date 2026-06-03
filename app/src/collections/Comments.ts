import type { CollectionConfig } from 'payload'

import { adminOrEditorFieldAccess, anyone, isAdminOrEditor } from '../access/roles'

/** Comments — 文章留言 (對應 WP 的留言系統, 含後台審核)。 */
export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: { singular: '留言', plural: '留言' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'approved', 'createdAt'],
    group: '互動',
  },
  access: {
    create: anyone, // 公開可留言 (預設未核准)
    read: anyone, // 前台只查 approved=true
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      label: '文章',
      required: true,
    },
    { name: 'authorName', type: 'text', label: '暱稱', required: true },
    { name: 'email', type: 'email', label: '電子郵件' },
    { name: 'content', type: 'textarea', label: '留言內容', required: true },
    {
      name: 'approved',
      type: 'checkbox',
      label: '已核准',
      defaultValue: false,
      // 防止訪客自行核准留言: 僅管理員/編輯可設定此欄位
      access: {
        create: adminOrEditorFieldAccess,
        update: adminOrEditorFieldAccess,
      },
      admin: { position: 'sidebar' },
    },
  ],
}
