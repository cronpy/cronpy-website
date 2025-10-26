import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

/* --- i18n --- */
const TRANSLATIONS = {
  en: {
    team_title: 'Team Members',
    strengths_title: 'Our Strengths',
    contact_title: 'Contact',
    contact_text: 'You can contact us via email. Click the button below to open your mail app.',
    strength_1_title: 'Technical Excellence',
    strength_1_text: 'We adopt new technologies quickly and build robust systems.',
    strength_2_title: 'Agile Response',
    strength_2_text: 'Our compact team enables fast and flexible development.',
    strength_3_title: 'Security Mindset',
    strength_3_text: 'We prioritize security in every stage of our process.',
  },
  ja: {
    team_title: 'メンバー紹介',
    strengths_title: 'チームの強み',
    contact_title: '問い合わせ',
    contact_text: 'ご相談がありましたら、下記のボタンまたはメールアドレスまでお問い合わせください。',
    strength_1_title: '高い技術力',
    strength_1_text: '最新の技術を素早く取り入れ、堅牢なシステムを構築します。',
    strength_2_title: '迅速な対応',
    strength_2_text: '小規模ながらもフットワーク軽く、柔軟な開発が可能です。',
    strength_3_title: 'セキュリティ意識',
    strength_3_text: 'セキュリティを第一に考えた設計とレビューを徹底しています。',
  }
}
const I18nContext = createContext(null)
const useI18n = () => useContext(I18nContext)

/* --- 共通UI --- */
function LangToggle() {
  const { lang, setLang } = useI18n()
  const label = lang === 'ja' ? '🇯🇵 日本語' : '🇺🇸 English'
  return (
    <button id="lang-toggle" onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}>{label}</button>
  )
}
function HeaderBar() { return <header><h1>Team Cronpy</h1></header> }

/* --- Team --- */
function MemberCard({ m, index }) {
  return (
    <article className="card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="avatar">
        <img
          src={`https://github.com/${encodeURIComponent(m.username)}.png?size=200`}
          alt={`${m.name} さんのアバター`} loading="lazy"
        />
      </div>
      <div className="meta">
        <h3 className="name">{m.name}</h3>
        <div className="role">{m.role || ''}</div>
        <div className="links">
          <a className="btn" href={`https://github.com/${encodeURIComponent(m.username)}`} target="_blank" rel="noopener noreferrer">
            🐙 @{m.username}
          </a>
        </div>
      </div>
    </article>
  )
}
function TeamSection({ members }) {
  const { t } = useI18n()
  return (
    <section id="team">
      <h2>{t('team_title')}</h2>
      <div className="grid">
        {members.map((m, i) => <MemberCard key={m.username} m={m} index={i} />)}
      </div>
    </section>
  )
}

/* --- Strengths --- */
function StrengthItem({ title, text }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting && el.classList.add('visible')), { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (<div ref={ref} className="strength-item"><h3>{title}</h3><p>{text}</p></div>)
}
function StrengthsSection() {
  const { t } = useI18n()
  return (
    <section id="strengths">
      <h2>{t('strengths_title')}</h2>
      <StrengthItem title={t('strength_1_title')} text={t('strength_1_text')} />
      <StrengthItem title={t('strength_2_title')} text={t('strength_2_text')} />
      <StrengthItem title={t('strength_3_title')} text={t('strength_3_text')} />
    </section>
  )
}

/* --- Contact --- */
function ContactSection({ email }) {
  const { t } = useI18n()
  const subject = encodeURIComponent('お問い合わせ - Team Cronpy')
  const mailto = `mailto:${email}?subject=${subject}`
  return (
    <section id="contact">
      <h2>{t('contact_title')}</h2>
      <p>{t('contact_text')}</p>
      <div className="contact">
        <a id="mailto-btn" className="btn" href={mailto}>📧 メールで問い合わせ</a>
        <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
          または直接: <a id="email-plain" className="email" href={`mailto:${email}`}>{email}</a>
        </span>
      </div>
    </section>
  )
}

/* --- Footer --- */
function SiteFooter() {
  const year = new Date().getFullYear()
  return (<footer><div>© <span>{year}</span> Team Cronpy</div></footer>)
}

/* --- App --- */
const DEFAULT_MEMBERS = [
  { username: 'nmcliant', name: 'nmcliant', role: '' },
  { username: 'AxelCipher20', name: 'AxelCipher', role: '' }
]

export default function App() {
  const [members] = useState(DEFAULT_MEMBERS)
  const [email]   = useState('ppp@anglernook.com')
  const [lang, setLang] = useState('ja')
  const t = (k) => TRANSLATIONS[lang][k] || k

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const ctx = useMemo(() => ({ lang, setLang, t }), [lang])

  return (
    <I18nContext.Provider value={ctx}>
      <LangToggle />
      <div className="wrap">
        <HeaderBar />
        <main>
          <TeamSection members={members} />
          <StrengthsSection />
          <ContactSection email={email} />
        </main>
      </div>
      <SiteFooter />
    </I18nContext.Provider>
  )
}