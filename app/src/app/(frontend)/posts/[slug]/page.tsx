import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { publishedConditions } from '@/lib/posts'
import { applyFilters, doAction } from '@/plugins'
import CommentForm from '../../_components/CommentForm'
import MediaImage from '../../_components/MediaImage'
import RichTextRenderer from '../../_components/RichTextRenderer'
import {
  formatDate,
  getAuthorName,
  getMediaURL,
  getTermLinks,
} from '../../_lib/format'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  // slug 可能是 percent-encoded (中文網址), 先解碼再查詢
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: decodedSlug } }, ...publishedConditions()] },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: '找不到文章' }
  // 擴充點: 讓 SEO 外掛補強中繼資料 (Open Graph 等)
  const base: Metadata = { title: post.title, description: post.excerpt ?? undefined }
  return applyFilters('post.seo', base, post)
}

/** 文章內頁 (對應 WP 的單篇文章模板 single.php)。 */
export default async function PostPage({ params }: Args) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const cover = getMediaURL(post.featuredImage)
  const categories = getTermLinks(post.categories)
  const tags = getTermLinks(post.tags)

  // 擴充點 (action): 觸發文章瀏覽事件, 供統計類外掛監聽
  doAction('post.viewed', post)

  // 擴充點 (filter): 讓外掛 (如閱讀時間) 加工文章中繼資料項目
  const metaItems = applyFilters<string[]>(
    'post.meta',
    [getAuthorName(post.author), ...(post.publishedAt ? [formatDate(post.publishedAt)] : [])],
    post,
  )

  // 取得本文已核准的留言
  const payload = await getPayload({ config: await config })
  const { docs: comments } = await payload.find({
    collection: 'comments',
    where: { and: [{ post: { equals: post.id } }, { approved: { equals: true } }] },
    sort: '-createdAt',
    depth: 0,
    limit: 100,
  })

  return (
    <article className="article container--narrow">
      <header className="article__header">
        {categories.length > 0 && (
          <div className="article__categories">
            {categories.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="tag">
                {c.name}
              </Link>
            ))}
          </div>
        )}
        <h1 className="article__title">{post.title}</h1>
        <div className="article__meta">
          {metaItems.map((item, index) => (
            <span key={index}>
              {index > 0 && '· '}
              {item}
            </span>
          ))}
        </div>
      </header>

      {cover && (
        <figure className="article__cover">
          <MediaImage
            media={post.featuredImage}
            sizes="(max-width: 720px) 100vw, 720px"
            priority
          />
        </figure>
      )}

      <div className="article__content prose">
        <RichTextRenderer data={post.content} />
      </div>

      {tags.length > 0 && (
        <div className="article__tags">
          {tags.map((t) => (
            <Link key={t.slug} href={`/tags/${t.slug}`} className="tag tag--soft">
              #{t.name}
            </Link>
          ))}
        </div>
      )}

      <section className="comments">
        <h2 className="comments__title">留言 ({comments.length})</h2>
        {comments.length === 0 ? (
          <p style={{ color: '#6b7280' }}>還沒有留言，成為第一個留言的人吧！</p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c.id} className="comment">
                <div className="comment__head">
                  <strong>{c.authorName}</strong>
                  <span>{formatDate(c.createdAt)}</span>
                </div>
                <p className="comment__body">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
        <h3 className="comments__form-title">發表留言</h3>
        <CommentForm postId={post.id} />
      </section>

      <footer className="article__footer">
        <a href="/" className="back-link">
          ← 回到首頁
        </a>
      </footer>
    </article>
  )
}
