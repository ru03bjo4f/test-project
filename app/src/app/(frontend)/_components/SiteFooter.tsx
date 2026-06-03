import type { ReactNode } from 'react'

import { applyFilters } from '@/plugins'

/** 網站頁尾。文字與小工具皆為外掛可擴充的擴充點 (filter)。 */
export default function SiteFooter() {
  const text = applyFilters('footer.text', `© ${new Date().getFullYear()} 我的網站`)
  const widgets = applyFilters<ReactNode[]>('footer.widgets', [])

  return (
    <footer className="site-footer">
      <div className="container">
        <p>{text}</p>
        {widgets.length > 0 && <p style={{ marginTop: 8 }}>{widgets}</p>}
      </div>
    </footer>
  )
}
