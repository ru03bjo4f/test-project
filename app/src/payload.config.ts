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
import { lexicalZhTw } from './i18n/lexical-zhtw'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  collections: [Posts, Pages, Categories, Tags, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
