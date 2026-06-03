import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import RichTextRenderer from '../../_components/RichTextRenderer'
import {
  formatDate,
  getAuthorName,
  getCategoryNames,
  getMediaAlt,
  getMediaURL,
} from '../../_lib/format'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  // slug 可能是 percent-encoded (中文網址), 先解碼再查詢
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: decodedSlug }, _status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: '找不到文章' }
  return { title: post.title, description: post.excerpt ?? undefined }
}

/** 文章內頁 (對應 WP 的單篇文章模板 single.php)。 */
export default async function PostPage({ params }: Args) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const cover = getMediaURL(post.featuredImage)
  const categories = getCategoryNames(post.categories)

  return (
    <article className="article container--narrow">
      <header className="article__header">
        {categories.length > 0 && (
          <div className="article__categories">
            {categories.map((name) => (
              <span key={name} className="tag">
                {name}
              </span>
            ))}
          </div>
        )}
        <h1 className="article__title">{post.title}</h1>
        <div className="article__meta">
          <span>{getAuthorName(post.author)}</span>
          {post.publishedAt && <span>· {formatDate(post.publishedAt)}</span>}
        </div>
      </header>

      {cover && (
        <figure className="article__cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={getMediaAlt(post.featuredImage)} />
        </figure>
      )}

      <div className="article__content prose">
        <RichTextRenderer data={post.content} />
      </div>

      <footer className="article__footer">
        <a href="/" className="back-link">
          ← 回到首頁
        </a>
      </footer>
    </article>
  )
}
