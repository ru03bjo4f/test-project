import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'
import { anyone, isAdminOrEditor } from '../access/roles'

/** Categories — 對應 WordPress 的分類 (階層式 taxonomy)。 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: '分類', plural: '分類' },
  admin: { useAsTitle: 'name', group: '分類與標籤' },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '名稱' },
    slugField('name'),
    { name: 'description', type: 'textarea', label: '描述' },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: '父分類',
      admin: { position: 'sidebar' },
    },
  ],
}
