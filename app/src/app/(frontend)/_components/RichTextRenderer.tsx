import { RichText } from '@payloadcms/richtext-lexical/react'

/**
 * 將 Payload 的 Lexical 富文本內容渲染為 HTML。
 * 對應 WordPress 把文章內容輸出到佈景主題的功能。
 */
export default function RichTextRenderer({
  data,
  className,
}: {
  data: unknown
  className?: string
}) {
  if (!data) return null
  // RichText 接受 Lexical 的 SerializedEditorState
  return <RichText data={data as never} className={className} />
}
