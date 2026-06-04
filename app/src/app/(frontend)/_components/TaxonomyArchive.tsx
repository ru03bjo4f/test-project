import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { publishedConditions } from '@/lib/posts'
import PostCard from './PostCard'

const LABELS = { categories: '分類', tags: '標籤' } as const

/**
 * 分類/標籤彙整頁 (對應 WP 的 taxonomy archive)。
 * categories 與 tags 共用此元件, 維持單一實作來源。
 */
export default async function TaxonomyArchive({
  taxonomy,
  slug,
}: {
  taxonomy: 'categories' | 'tags'
  slug: string
}) {
  const decoded = decodeURIComponent(slug)
  const payload = await getPayload({ config: await config })

  const { docs: terms } = await payload.find({
    collection: taxonomy,
    where: { slug: { equals: decoded } },
    limit: 1,
    depth: 0,
  })
  const term = terms[0]
  if (!term) notFound()

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { and: [...publishedConditions(), { [taxonomy]: { in: [term.id] } }] },
    sort: '-publishedAt',
    depth: 1,
    limit: 24,
  })

  const label = LABELS[taxonomy]

  return (
    <div className="container">
      <section className="hero">
        <p className="archive__kicker">{label}</p>
        <h1 className="hero__title">{term.name}</h1>
        <p className="hero__subtitle">共 {posts.length} 篇文章</p>
      </section>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">此{label}目前沒有文章</p>
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
