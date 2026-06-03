import type { ReactNode } from 'react'

import { addFilter, type Plugin } from './core'

/**
 * 示範外掛 (filter): 修改頁尾文字, 並注入頁尾小工具。
 * 展示外掛如何「過濾文字」與「注入 UI」(對應 WP 的 widget)。
 */
export const footerCredit: Plugin = {
  name: '頁尾署名',
  description: '在頁尾附加署名文字，並注入「外掛 / 後台」快速連結小工具。',
  register() {
    addFilter('footer.text', (text: string) => `${text} · 由自建 CMS + 外掛系統驅動`)

    addFilter('footer.widgets', (widgets: ReactNode[]) => [
      ...widgets,
      <span key="credit-links" style={{ display: 'inline-flex', gap: 12 }}>
        <a href="/plugins">外掛</a>
        <a href="/admin">後台管理</a>
      </span>,
    ])
  },
}
