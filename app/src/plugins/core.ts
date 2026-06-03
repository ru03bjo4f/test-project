/**
 * 外掛 Hook 引擎 — 復刻 WordPress 的 actions / filters 機制。
 *
 *  Action (動作): 在特定時機觸發, 執行副作用 (對應 WP do_action / add_action)。
 *  Filter (過濾器): 讓外掛逐一「加工」一個值並回傳 (對應 WP apply_filters / add_filter)。
 *
 * 這是核心唯一真實來源; 外掛透過 addAction/addFilter 註冊,
 * 核心程式碼在擴充點呼叫 doAction/applyFilters, 即可被外掛擴充而不需改動核心。
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => any

interface Registered {
  cb: AnyCallback
  priority: number
}

/** 外掛清單項目的描述 (供「外掛管理」頁顯示)。 */
export interface Plugin {
  name: string
  description: string
  register: () => void
}

// 模組層級單例 — Node 會快取模組, 因此整個 server 程序共用同一份註冊表。
const actions = new Map<string, Registered[]>()
const filters = new Map<string, Registered[]>()

const insert = (
  map: Map<string, Registered[]>,
  name: string,
  cb: AnyCallback,
  priority: number,
) => {
  const list = map.get(name) ?? []
  list.push({ cb, priority })
  // priority 數字小者先執行 (與 WP 相同)
  list.sort((a, b) => a.priority - b.priority)
  map.set(name, list)
}

/** 註冊一個 action 回呼 (對應 WP add_action)。 */
export function addAction(name: string, cb: AnyCallback, priority = 10): void {
  insert(actions, name, cb, priority)
}

/** 觸發 action, 依序執行所有回呼 (對應 WP do_action)。 */
export function doAction(name: string, ...args: unknown[]): void {
  for (const { cb } of actions.get(name) ?? []) {
    cb(...args)
  }
}

/** 註冊一個 filter 回呼 (對應 WP add_filter)。 */
export function addFilter(name: string, cb: AnyCallback, priority = 10): void {
  insert(filters, name, cb, priority)
}

/**
 * 套用 filter — 把 value 依序交給每個回呼加工後回傳 (對應 WP apply_filters)。
 * 每個回呼簽章為 (value, ...args) => value。
 */
export function applyFilters<T>(name: string, value: T, ...args: unknown[]): T {
  let result = value
  for (const { cb } of filters.get(name) ?? []) {
    result = cb(result, ...args) as T
  }
  return result
}

/** 列出已註冊的 hook 名稱 (供除錯/外掛管理頁)。 */
export function listHooks(): { actions: string[]; filters: string[] } {
  return { actions: [...actions.keys()], filters: [...filters.keys()] }
}
