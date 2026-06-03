import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import RichTextRenderer from '../../_components/RichTextRenderer'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  // slug 可能是 percent-encoded (中文網址), 先解碼再查詢
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: decodedSlug }, _status: { equals: 'published' } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: '找不到頁面' }
  return { title: page.title }
}

/** 一般頁面 (對應 WP 的頁面模板 page.php)。 */
export default async function PageView({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <article className="article container--narrow">
      <header className="article__header">
        <h1 className="article__title">{page.title}</h1>
      </header>
      <div className="article__content prose">
        <RichTextRenderer data={page.content} />
      </div>
    </article>
  )
}
