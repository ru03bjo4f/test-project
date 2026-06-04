import TaxonomyArchive from '../../_components/TaxonomyArchive'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

/** 標籤彙整頁 — 列出該標籤下的所有可見文章。 */
export default async function TagArchivePage({ params }: Args) {
  const { slug } = await params
  return <TaxonomyArchive taxonomy="tags" slug={slug} />
}
