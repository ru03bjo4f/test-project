import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access/roles'

/** Submissions — 聯絡表單送出紀錄 (對應 WP 的 Contact Form 7 提交)。 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: '表單送出', plural: '表單送出' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    group: '互動',
  },
  access: {
    create: anyone, // 公開可送出表單
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: '姓名', required: true },
    { name: 'email', type: 'email', label: '電子郵件', required: true },
    { name: 'message', type: 'textarea', label: '訊息', required: true },
  ],
}
