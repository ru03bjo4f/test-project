import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { zhTw } from '@payloadcms/translations/languages/zhTw'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Comments } from './collections/Comments'
import { Submissions } from './collections/Submissions'
import { SiteSettings } from './globals/SiteSettings'
import { lexicalZhTw } from './i18n/lexical-zhtw'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// 依 DATABASE_URL 自動選擇資料庫:
//   postgres://... → PostgreSQL (正式/容器環境)
//   其他 (file:...) → SQLite     (本機快速開發, 免外部資料庫)
const databaseURL = process.env.DATABASE_URL || 'file:./app.db'
// push=true 會在啟動時自動同步 schema (開發方便, 但正式環境有風險);
// 正式環境設 PAYLOAD_DB_PUSH=false, 改用 migration (npm run migrate) 管理 schema。
const dbPush = process.env.PAYLOAD_DB_PUSH !== 'false'
const db = databaseURL.startsWith('postgres')
  ? postgresAdapter({ pool: { connectionString: databaseURL }, push: dbPush })
  : sqliteAdapter({ client: { url: databaseURL }, push: dbPush })

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '· 內容管理系統',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // 後台介面語言: 繁體中文;
  // 補上 Lexical 編輯器缺少的繁體翻譯 (官方僅提供簡體)。
  i18n: {
    supportedLanguages: { zhTw },
    fallbackLanguage: 'zhTw',
    translations: {
      zhTw: { lexical: lexicalZhTw },
    },
  },
  collections: [Posts, Pages, Categories, Tags, Media, Comments, Submissions, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  plugins: [],
})
