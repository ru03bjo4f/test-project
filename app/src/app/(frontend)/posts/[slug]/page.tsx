import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { applyFilters, doAction } from '@/plugins'
import MediaImage from '../../_components/MediaImage'
import RichTextRenderer from '../../_components/RichTextRenderer'
import {
  formatDate,
  getAuthorName,
  getCategoryNames,
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
  const categories = getCategoryNames(post.categories)

  // 擴充點 (action): 觸發文章瀏覽事件, 供統計類外掛監聽
  doAction('post.viewed', post)

  // 擴充點 (filter): 讓外掛 (如閱讀時間) 加工文章中繼資料項目
  const metaItems = applyFilters<string[]>(
    'post.meta',
    [getAuthorName(post.author), ...(post.publishedAt ? [formatDate(post.publishedAt)] : [])],
    post,
  )

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

      <footer className="article__footer">
        <a href="/" className="back-link">
          ← 回到首頁
        </a>
      </footer>
    </article>
  )
}
