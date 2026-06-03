'use client'

import { Render, type Data } from '@measured/puck'

import { config } from '@/puck/config'

/** 前台渲染視覺化版面 (對應 WP 把 Elementor/Gutenberg 版面輸出為網頁)。 */
export default function PuckRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />
}
