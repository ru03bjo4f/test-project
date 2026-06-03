import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'
export const metadata = { title: '搜尋' }

type Args = { searchParams: Promise<{ q?: string }> }

/** 全站搜尋 — 依關鍵字搜尋已發佈的文章與頁面。 */
export default async function SearchPage({ searchParams }: Args) {
  const { q } = await searchParams
  const query = (q ?? '').trim()

  let posts: { id: number; title: string; slug?: string | null }[] = []
  let pages: { id: number; title: string; slug?: string | null }[] = []

  if (query) {
    const payload = await getPayload({ config: await config })
    const [pr, pg] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { or: [{ title: { like: query } }, { excerpt: { like: query } }] },
          ],
        },
        limit: 20,
        depth: 0,
      }),
      payload.find({
        collection: 'pages',
        where: { and: [{ _status: { equals: 'published' } }, { title: { like: query } }] },
        limit: 20,
        depth: 0,
      }),
    ])
    posts = pr.docs
    pages = pg.docs
  }

  const total = posts.length + pages.length

  return (
    <div className="container--narrow">
      <header className="article__header">
        <h1 className="article__title">搜尋</h1>
      </header>

      <form action="/search" className="search-form search-form--page">
        <input type="search" name="q" defaultValue={query} placeholder="搜尋文章與頁面…" />
        <button type="submit">搜尋</button>
      </form>

      {query && (
        <p style={{ color: '#6b7280' }}>
          「{query}」找到 {total} 筆結果
        </p>
      )}

      <div className="search-results">
        {posts.map((p) => (
          <Link key={`post-${p.id}`} href={`/posts/${p.slug}`} className="search-result">
            <span className="tag">文章</span>
            <span>{p.title}</span>
          </Link>
        ))}
        {pages.map((p) => (
          <Link key={`page-${p.id}`} href={`/pages/${p.slug}`} className="search-result">
            <span className="tag">頁面</span>
            <span>{p.title}</span>
          </Link>
        ))}
        {query && total === 0 && <p>沒有符合的結果。</p>}
      </div>
    </div>
  )
}
