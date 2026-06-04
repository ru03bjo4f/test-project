import type { Config } from '@measured/puck'

/**
 * 視覺化編輯器的「區塊」設定 (對應 Gutenberg 區塊 / Elementor 元件)。
 * 單一真實來源: 同時供編輯器 (Puck) 與前台渲染 (Render) 使用。
 * 每個區塊 = 可拖拉的元件 + 右側可編輯的欄位 + 渲染輸出。
 */
type Props = {
  Hero: { title: string; subtitle: string; align: 'left' | 'center'; bg: string }
  Heading: { text: string; level: 'h2' | 'h3' }
  Text: { text: string }
  Image: { url: string; alt: string }
  Button: { label: string; href: string; variant: 'primary' | 'outline' }
  Spacer: { size: number }
}

export const config: Config<Props> = {
  components: {
    Hero: {
      label: '主視覺 Hero',
      fields: {
        title: { type: 'text', label: '主標題' },
        subtitle: { type: 'textarea', label: '副標題' },
        align: {
          type: 'radio',
          label: '對齊',
          options: [
            { label: '置中', value: 'center' },
            { label: '靠左', value: 'left' },
          ],
        },
        bg: { type: 'text', label: '背景色 (CSS 色碼)' },
      },
      defaultProps: {
        title: '主標題',
        subtitle: '在這裡輸入副標題說明文字',
        align: 'center',
        bg: '#eff6ff',
      },
      render: ({ title, subtitle, align, bg }) => (
        <section
          style={{
            background: bg,
            padding: '72px 24px',
            textAlign: align,
            borderRadius: 12,
          }}
        >
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 12px' }}>{title}</h1>
          <p style={{ fontSize: 18, color: '#6b7280', margin: 0 }}>{subtitle}</p>
        </section>
      ),
    },

    Heading: {
      label: '標題',
      fields: {
        text: { type: 'text', label: '文字' },
        level: {
          type: 'select',
          label: '層級',
          options: [
            { label: 'H2 (大)', value: 'h2' },
            { label: 'H3 (中)', value: 'h3' },
          ],
        },
      },
      defaultProps: { text: '區段標題', level: 'h2' },
      render: ({ text, level }) => {
        const Tag = level
        return <Tag style={{ margin: '28px 0 12px', fontWeight: 700 }}>{text}</Tag>
      },
    },

    Text: {
      label: '文字段落',
      fields: { text: { type: 'textarea', label: '內容' } },
      defaultProps: { text: '在這裡輸入段落文字。' },
      render: ({ text }) => (
        <p style={{ fontSize: 18, lineHeight: 1.85, margin: '16px 0', whiteSpace: 'pre-wrap' }}>
          {text}
        </p>
      ),
    },

    Image: {
      label: '圖片',
      fields: {
        url: { type: 'text', label: '圖片網址' },
        alt: { type: 'text', label: '替代文字' },
      },
      defaultProps: { url: '', alt: '' },
      render: ({ url, alt }) =>
        url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt} style={{ width: '100%', borderRadius: 12, margin: '16px 0' }} />
        ) : (
          <div
            style={{
              padding: 48,
              background: '#f3f4f6',
              textAlign: 'center',
              color: '#6b7280',
              borderRadius: 12,
              margin: '16px 0',
            }}
          >
            請在右側設定圖片網址
          </div>
        ),
    },

    Button: {
      label: '按鈕',
      fields: {
        label: { type: 'text', label: '文字' },
        href: { type: 'text', label: '連結網址' },
        variant: {
          type: 'radio',
          label: '樣式',
          options: [
            { label: '實心', value: 'primary' },
            { label: '外框', value: 'outline' },
          ],
        },
      },
      defaultProps: { label: '了解更多', href: '#', variant: 'primary' },
      render: ({ label, href, variant }) => (
        <a
          href={href}
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            borderRadius: 999,
            textDecoration: 'none',
            margin: '12px 0',
            fontWeight: 500,
            ...(variant === 'primary'
              ? { background: '#2563eb', color: '#fff' }
              : { border: '1px solid #2563eb', color: '#2563eb' }),
          }}
        >
          {label}
        </a>
      ),
    },

    Spacer: {
      label: '間距',
      fields: { size: { type: 'number', label: '高度 (px)' } },
      defaultProps: { size: 32 },
      render: ({ size }) => <div style={{ height: size }} />,
    },
  },
}
