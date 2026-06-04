import TaxonomyArchive from '../../_components/TaxonomyArchive'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

/** 分類彙整頁 — 列出該分類下的所有可見文章。 */
export default async function CategoryArchivePage({ params }: Args) {
  const { slug } = await params
  return <TaxonomyArchive taxonomy="categories" slug={slug} />
}
