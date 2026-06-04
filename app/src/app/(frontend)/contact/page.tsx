import ContactForm from '../_components/ContactForm'

export const metadata = { title: '聯絡我們' }

/** 聯絡我們頁。 */
export default function ContactPage() {
  return (
    <div className="container--narrow">
      <header className="article__header">
        <h1 className="article__title">聯絡我們</h1>
        <p style={{ color: '#6b7280' }}>有任何問題或合作邀約，歡迎透過下方表單與我們聯繫。</p>
      </header>
      <ContactForm />
    </div>
  )
}
