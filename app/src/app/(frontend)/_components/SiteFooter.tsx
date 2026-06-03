import type { ReactNode } from 'react'

import { getSiteSettings } from '@/lib/site'
import { applyFilters } from '@/plugins'

/** 網站頁尾。文字來自設定, 並開放外掛擴充 (filter)。 */
export default async function SiteFooter() {
  const settings = await getSiteSettings()
  const base = settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName}`
  const text = applyFilters('footer.text', base)
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
