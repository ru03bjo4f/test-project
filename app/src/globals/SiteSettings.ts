import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access/roles'

/** 網站設定 — 全站單一設定 (對應 WordPress 的「一般設定」)。 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '網站設定',
  admin: { group: '系統' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: '網站名稱',
      required: true,
      defaultValue: '我的網站',
    },
    { name: 'siteDescription', type: 'textarea', label: '網站描述 (用於 SEO)' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: '網站 Logo',
      admin: { description: '若設定, 頁首會以 Logo 取代純文字站名。' },
    },
    { name: 'footerText', type: 'text', label: '頁尾文字' },
    {
      name: 'mainMenu',
      type: 'array',
      label: '主選單',
      admin: {
        description: '自訂導覽選單; 留空則自動列出已發佈的頁面 (對應 WP 的選單)。',
      },
      fields: [
        { name: 'label', type: 'text', label: '名稱', required: true },
        { name: 'url', type: 'text', label: '連結', required: true },
      ],
    },
  ],
}
