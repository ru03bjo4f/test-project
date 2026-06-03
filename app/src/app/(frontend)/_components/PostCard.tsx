import Link from 'next/link'

import type { Post } from '@/payload-types'
import {
  formatDate,
  getAuthorName,
  getMediaAlt,
  getMediaURL,
} from '../_lib/format'

/** 首頁文章卡片 (對應 WP 文章列表中的單篇摘要)。 */
export default function PostCard({ post }: { post: Post }) {
  const cover = getMediaURL(post.featuredImage)

  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`} className="post-card__link">
        {cover && (
          <div className="post-card__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={getMediaAlt(post.featuredImage)} loading="lazy" />
          </div>
        )}
        <div className="post-card__body">
          <h2 className="post-card__title">{post.title}</h2>
          {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
          <div className="post-card__meta">
            <span>{getAuthorName(post.author)}</span>
            {post.publishedAt && <span>· {formatDate(post.publishedAt)}</span>}
          </div>
        </div>
      </Link>
    </article>
  )
}
