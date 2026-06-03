import { getPayload } from 'payload'

import config from '@/payload.config'
import PostCard from './_components/PostCard'

export const dynamic = 'force-dynamic'

/** 首頁 — 列出已發佈的文章 (對應 WP 的部落格首頁)。 */
export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 12,
  })

  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero__title">最新文章</h1>
        <p className="hero__subtitle">由自建內容管理系統驅動的網站</p>
      </section>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">目前還沒有已發佈的文章</p>
          <p className="empty-state__hint">
            前往 <a href="/admin">後台管理</a> 新增文章，並將狀態設為「已發佈」即可在此顯示。
          </p>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
