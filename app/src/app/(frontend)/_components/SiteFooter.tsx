/** 網站頁尾。 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} 我的網站 · 由自建內容管理系統驅動</p>
      </div>
    </footer>
  )
}
