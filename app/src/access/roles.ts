import type { Access, FieldAccess } from 'payload'

/**
 * 角色定義 — 對應 WordPress 的使用者角色 (Roles)
 *  admin      → Administrator (全權)
 *  editor     → Editor        (管理所有內容)
 *  author     → Author        (管理自己的內容)
 *  subscriber → Subscriber    (僅登入)
 */
export type Role = 'admin' | 'editor' | 'author' | 'subscriber'

const hasRole = (user: { role?: Role } | null | undefined, ...roles: Role[]): boolean =>
  Boolean(user?.role) && roles.includes(user!.role as Role)

/** 公開可讀 */
export const anyone: Access = () => true

/** 已登入即可 */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** 僅管理員 */
export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

/** 管理員或編輯 */
export const isAdminOrEditor: Access = ({ req: { user } }) => hasRole(user, 'admin', 'editor')

/** 管理員或本人 (用於 Users) */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}

/**
 * 管理員/編輯可管理全部；作者只能管理自己擁有的內容。
 * ownerField 指向集合中代表擁有者的關聯欄位 (預設 author)。
 */
export const isAdminOrEditorOrOwner =
  (ownerField = 'author'): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (hasRole(user, 'admin', 'editor')) return true
    if (hasRole(user, 'author')) return { [ownerField]: { equals: user.id } }
    return false
  }

/**
 * 內容讀取：有後台角色者可看全部(含草稿)，其餘訪客只看已發佈。
 * 對應 WP 的 published / draft 可見性。
 */
export const publishedOrPrivileged: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin', 'editor', 'author')) return true
  return { _status: { equals: 'published' } }
}

/** 欄位層級：僅管理員可修改 (例如 role 欄位) */
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')
