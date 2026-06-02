import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'
import { anyone, isAdminOrEditor, isLoggedIn } from '../access/roles'

/** Tags — 對應 WordPress 的標籤 (扁平式 taxonomy)。 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: '標籤', plural: '標籤' },
  admin: { useAsTitle: 'name', group: '分類與標籤' },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '名稱' },
    slugField('name'),
  ],
}
