/**
 * Lexical 富文本編輯器的繁體中文翻譯。
 *
 * 官方 @payloadcms/richtext-lexical 的功能標籤 (標題/清單/引用…) 只提供
 * 簡體 zh, 沒有繁體 zhTw, 導致編輯器選單顯示原始鍵值 (lexical:xxx:label)。
 * 在此補上繁體翻譯, 透過 payload.config 的 i18n.translations 合併進 zhTw。
 *
 * 鍵結構對應顯示鍵: lexical:<group>:<key> → { lexical: { <group>: { <key> } } }
 */
export const lexicalZhTw = {
  general: {
    placeholder: "開始輸入，或按 '/' 使用指令…",
    slashMenuBasicGroupLabel: '基本',
    slashMenuListGroupLabel: '清單',
    toolbarItemsActive: '{{count}} 個作用中',
  },
  align: {
    alignCenterLabel: '置中對齊',
    alignJustifyLabel: '左右對齊',
    alignLeftLabel: '靠左對齊',
    alignRightLabel: '靠右對齊',
  },
  blockquote: { label: '引用區塊' },
  blocks: {
    label: '區塊',
    inlineBlocks: {
      label: '行內區塊',
      create: '建立 {{label}}',
      edit: '編輯 {{label}}',
      remove: '移除 {{label}}',
    },
  },
  heading: { label: '標題 {{headingLevel}}' },
  horizontalRule: { label: '水平分隔線' },
  indent: { decreaseLabel: '減少縮排', increaseLabel: '增加縮排' },
  link: { label: '連結', loadingWithEllipsis: '載入中…' },
  checklist: { label: '核取清單' },
  orderedList: { label: '有序清單' },
  unorderedList: { label: '項目清單' },
  paragraph: { label: '段落', label2: '一般文字' },
  relationship: { label: '關聯' },
  textState: { defaultStyle: '預設樣式' },
  upload: { label: '上傳' },
}
