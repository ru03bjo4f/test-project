import Image from 'next/image'

import type { Media } from '@/payload-types'

/**
 * 統一的媒體圖片元件 — 以 next/image 自動壓縮、轉 WebP/AVIF、延遲載入。
 * 單一真實來源, 供前台所有 Payload 媒體圖片使用。
 *  fill=true : 填滿容器 (容器需 position: relative)，用於固定比例的卡片。
 *  fill=false: 依媒體原始寬高自適應 (responsive)。
 */
export default function MediaImage({
  media,
  fill = false,
  sizes,
  className,
  priority = false,
}: {
  media?: (number | null) | Media
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
}) {
  if (!media || typeof media === 'number' || !media.url) return null

  const alt = media.alt ?? ''

  if (fill) {
    return (
      <Image
        src={media.url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: 'cover' }}
      />
    )
  }

  return (
    <Image
      src={media.url}
      alt={alt}
      width={media.width ?? 1200}
      height={media.height ?? 675}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
