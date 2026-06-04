import { activePlugins, listHooks } from '@/plugins'

export const dynamic = 'force-dynamic'

export const metadata = { title: '外掛管理' }

/** 外掛管理頁 — 展示已啟用的外掛與註冊的擴充點 (對應 WP 的外掛清單)。 */
export default function PluginsPage() {
  const hooks = listHooks()

  return (
    <div className="container--narrow">
      <header className="article__header">
        <h1 className="article__title">外掛管理</h1>
        <p style={{ color: '#6b7280' }}>
          復刻 WordPress 的 hook 系統 — 外掛透過 action / filter 擴充功能，完全不需修改核心程式碼。
        </p>
      </header>

      <div className="plugin-list">
        {activePlugins.map((plugin) => (
          <div key={plugin.name} className="plugin-card">
            <div className="plugin-card__head">
              <h2 className="plugin-card__name">{plugin.name}</h2>
              <span className="tag">啟用中</span>
            </div>
            <p className="plugin-card__desc">{plugin.description}</p>
          </div>
        ))}
      </div>

      <div className="hook-summary">
        <p className="hook-summary__title">已註冊的擴充點 (Hooks)</p>
        <p>
          <strong>Filters：</strong>
          {hooks.filters.length ? hooks.filters.join('、') : '—'}
        </p>
        <p>
          <strong>Actions：</strong>
          {hooks.actions.length ? hooks.actions.join('、') : '—'}
        </p>
      </div>
    </div>
  )
}
