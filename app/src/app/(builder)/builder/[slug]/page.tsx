import type { Data } from '@measured/puck'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import PuckEditor from './PuckEditor'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

const emptyData = { content: [], root: {} } as Data

/** 視覺化編輯器頁面 — 載入指定頁面的版面資料供拖拉編輯。 */
export default async function BuilderPage({ params }: Args) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: decodedSlug } },
    depth: 0,
    limit: 1,
  })
  const page = docs[0]
  if (!page) notFound()

  const data = (page.layout as Data | null | undefined) ?? emptyData

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid #e5e7eb',
          fontFamily: 'system-ui',
        }}
      >
        <strong>視覺化編輯：{page.title}</strong>
        <a href={`/pages/${slug}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
          查看前台頁面 →
        </a>
      </div>
      <PuckEditor pageId={page.id} initialData={data} />
    </div>
  )
}
