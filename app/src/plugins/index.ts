import { analytics } from './analytics'
import type { Plugin } from './core'
import { footerCredit } from './footer-credit'
import { readingTime } from './reading-time'
import { seoDefaults } from './seo-defaults'

/**
 * 已啟用的外掛清單 (單一真實來源)。
 * 要「停用」外掛: 從此陣列移除; 要「安裝」新外掛: 寫好後加進此陣列。
 * 對應 WordPress 的外掛啟用/停用。
 */
export const activePlugins: Plugin[] = [readingTime, footerCredit, seoDefaults, analytics]

let registered = false

/** 註冊所有啟用中的外掛 (idempotent; 模組快取確保整個程序只跑一次)。 */
export function registerPlugins(): void {
  if (registered) return
  for (const plugin of activePlugins) plugin.register()
  registered = true
}

// 載入此模組即自動註冊外掛
registerPlugins()

export * from './core'
