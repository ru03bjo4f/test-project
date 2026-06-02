import type { CollectionConfig } from 'payload'

import { adminFieldAccess, isAdmin, isAdminOrSelf } from '../access/roles'

/** Users — 對應 WordPress 的使用者與角色 (wp_users + roles)。 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '使用者', plural: '使用者' },
  admin: {
    useAsTitle: 'email',
    group: '系統',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    // Email 與密碼由 auth 自動提供
    { name: 'name', type: 'text', label: '顯示名稱' },
    {
      name: 'role',
      type: 'select',
      label: '角色',
      required: true,
      defaultValue: 'subscriber',
      // 已建立後僅管理員可變更角色 (避免提權)。建立第一位使用者時請選「管理員」。
      access: { update: adminFieldAccess },
      options: [
        { label: '管理員 (Administrator)', value: 'admin' },
        { label: '編輯 (Editor)', value: 'editor' },
        { label: '作者 (Author)', value: 'author' },
        { label: '訂閱者 (Subscriber)', value: 'subscriber' },
      ],
    },
  ],
}
