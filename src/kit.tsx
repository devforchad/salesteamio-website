import { FormEvent, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './kit.css'
import { ArrowIcon } from './arrow'
import { contactEmail, DEFAULT_FORM_ENDPOINT, sendContact } from './contact'

// Stripe Payment Link for the kit. Empty until Chad creates it in Stripe;
// while empty, the buy buttons scroll to the waitlist form instead.
const KIT_PAYMENT_LINK = import.meta.env.VITE_KIT_PAYMENT_LINK?.trim() || ''

const DEMO_URL = 'https://demo.salesteamio.com/supple-warriors-sms-agent'
const buyHref = KIT_PAYMENT_LINK || '#waitlist'
const buyLabel = KIT_PAYMENT_LINK ? 'Get the kit for $27 ↗' : 'Join the launch list'

const contents = [
  ['00', 'Start here · 7-day plan'],
  ['01', 'The 3 leaks audit'],
  ['02', 'Link-in-bio page template'],
  ['03', 'Lead magnet blueprints'],
  ['04', '5-email welcome sequence'],
  ['05', 'Hook bank · 50 hooks'],
  ['06', 'DM scripts'],
  ['07', 'AI prompt pack · 12 prompts'],
  ['08', 'Tracking sheet'],
]

const forYou = [
  'You sell coaching, a program, a course or a product',
  'Your bio link is a Linktree or “DM me”',
  'You’d rather set it up yourself than pay an agency',
  'You have an hour a day for a week',
]

const notForYou: React.ReactNode[] = [
  'You don’t have an offer yet',
  <>You want someone to do it for you (that’s <a href="/client-engine/">Client Engine</a>)</>,
  'You’re looking for a guaranteed income number',
]

const inside = [
  ['The 3 leaks audit', 'Score your current setup in 10 minutes and see exactly what to fix first.'],
  ['Link-in-bio page template', 'A fast, mobile-first opt-in page you can publish free and connect to your email tool.'],
  ['Lead magnet blueprints', 'Five formats that work for coaches, with outlines you can fill in.'],
  ['5-email welcome sequence', 'Fully written, with brackets to customise and send timing for each email.'],
  ['Hook bank', '50 hooks sorted by type, for reels, stories and captions.'],
  ['DM scripts', 'Openers, follow-ups, objection replies and a keyword DM flow.'],
  ['AI prompt pack', '12 copy-paste prompts to write hooks, emails and page copy in your voice.'],
  ['Tracking sheet', 'The handful of numbers that tell you what’s working.'],
]

const steps = [
  ['DAY 1', 'Audit your setup'],
  ['DAY 2', 'Pick and outline your lead magnet'],
  ['DAY 3', 'Publish your page'],
  ['DAY 4', 'Load your welcome emails'],
  ['DAY 5', 'Plan a week of hooks'],
  ['DAYS 6–7', 'Launch it in your bio and stories'],
]

const faqs: [string, React.ReactNode][] = [
  ['What format is it?', 'A download with simple guides, a ready-to-edit page template and copy-paste scripts. It works on any computer.'],
  ['Do I need any software?', 'Just an email tool you probably already have, like Kit, Mailchimp, Beehiiv or Kajabi. Free plans work.'],
  ['Is there a refund?', 'Yes. If it isn’t useful, email me within 14 days and I’ll refund you.'],
  ['Will this guarantee more sales?', 'No. It gives you the system. Results depend on your offer and how much you post.'],
  ['Can you just build it for me?', <>Yes, that’s <a href="/client-engine/">Client Engine</a>.</>],
]

function BuyButton({ className = 'button primary' }: { className?: string }) {
  return <a className={className} href={buyHref}>{buyLabel}{!KIT_PAYMENT_LINK && <> <span><ArrowIcon dir="up-right" /></span></>}</a>
}

function KitVisual() {
  return <div className="system-visual kit-visual" role="img" aria-label="The kit contains nine parts: a start-here 7-day plan, the 3 leaks audit, a link-in-bio page template, lead magnet blueprints, a 5-email welcome sequence, a bank of 50 hooks, DM scripts, a pack of 12 AI prompts and a tracking sheet">
    <div className="visual-glow"></div>
    <div className="visual-frame">
      <div className="visual-header"><span><i></i> INSIDE THE KIT</span><small>9 parts</small></div>
      <ol className="kit-list">
        {contents.map(([number, title]) => <li key={number}><small>{number}</small><b>{title}</b></li>)}
      </ol>
    </div>
  </div>
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return <div className="ce-head"><h2>{children}</h2></div>
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'mailto'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const submitting = useRef(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButton.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }
  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) { form.reportValidity(); return }
    if (submitting.current) return
    const data = new FormData(form)
    if (data.get('website')) { setFormStatus('success'); return }
    const rawHandle = String(data.get('instagram') ?? '').trim().replace(/^@+/, '')
    const handle = rawHandle ? `@${rawHandle}` : ''
    const message = ['[Kit waitlist]', `Instagram: ${handle || 'none'}`].join('\n')
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim() || DEFAULT_FORM_ENDPOINT
    if (!endpoint) {
      setFormStatus('mailto')
      const subject = encodeURIComponent(`Kit waitlist — ${data.get('name')}`)
      const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${message}`)
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
      return
    }
    submitting.current = true
    setFormStatus('submitting')
    try {
      await sendContact({
        name: data.get('name'),
        email: data.get('email'),
        company: handle,
        message,
        website: data.get('website'),
      }, endpoint)
      setFormStatus('success')
    } catch {
      setFormStatus('error')
    } finally {
      submitting.current = false
    }
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Sales Team IO home"><img src="/assets/logo-33.png" srcSet="/assets/logo-33.png 1x, /assets/logo-66.png 2x, /assets/logo-132.png 4x" width="33" height="33" alt="" /><span>SALES TEAM <b>IO</b></span></a>
      <button ref={menuButton} className="menu-button" aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i></i><i></i></button>
      <nav id="primary-navigation" className={menuOpen ? 'open' : ''} aria-label="Primary navigation">
        <a href="#inside" onClick={closeMenu}>What’s inside</a><a href="#who" onClick={closeMenu}>Who it’s for</a><a href="#faq" onClick={closeMenu}>FAQ</a>
        <a className="nav-cta" href={buyHref} onClick={closeMenu}>{buyLabel}{!KIT_PAYMENT_LINK && <> <span><ArrowIcon dir="up-right" /></span></>}</a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Stop losing the followers <em>your content already won.</em></h1>
          <p className="hero-text">The do-it-yourself version of the system I build for coaches and creators: a link-in-bio page, a welcome email sequence, 50 hooks, DM scripts and AI prompts. Set it up in a week, without hiring anyone.</p>
          <div className="actions"><BuyButton /><a className="button secondary" href="/client-engine/">Want it built for you? <span><ArrowIcon dir="up-right" /></span></a></div>
          <p className="microcopy"><span className="dot"></span> {KIT_PAYMENT_LINK ? 'One-time $27. Instant download.' : 'Launching shortly. Join the list and get it first at $27.'}</p>
        </div>
        <KitVisual />
      </section>

      <section className="section ce-leak" id="who">
        <SectionHead>Built for creators who <em>already sell something.</em></SectionHead>
        <div className="ce-grid kit-fit">
          <article className="ce-card"><h3>For you if</h3><ul className="kit-checks">{forYou.map(item => <li key={item}>{item}</li>)}</ul></article>
          <article className="ce-card"><h3>Not for you if</h3><ul className="kit-checks kit-crosses">{notForYou.map((item, index) => <li key={index}>{item}</li>)}</ul></article>
        </div>
      </section>

      <section className="section ce-includes" id="inside">
        <SectionHead>Everything you need, <em>nothing you don’t.</em></SectionHead>
        <div className="ce-grid ce-grid-4">{inside.map(([title, text], index) => <article className="ce-card" key={title}><small className="kit-num">{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="section ce-process" id="how">
        <SectionHead>Set up in <em>7 days.</em></SectionHead>
        <ol className="process" aria-label="Six steps from audit to launch">{steps.map(([day, title]) => <li key={day}><b>{day}</b><div><h3>{title}</h3></div></li>)}</ol>
      </section>

      <section className="section ce-proof" id="author">
        <SectionHead>Who made <em>this kit.</em></SectionHead>
        <p className="ce-intro kit-author">I’m Chad Pitton. I’ve built sales systems for online coaching and education businesses since 2020, including the CRM and AI setter for Supple Warriors. This kit is the same playbook I use for done-for-you clients, written so you can run it yourself.</p>
        <a className="text-link" href={DEMO_URL} target="_blank" rel="noreferrer">See the AI setter demo ↗</a>
      </section>

      <section className="section ce-faq" id="faq">
        <SectionHead>Questions, <em>answered.</em></SectionHead>
        <div className="ce-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>

      {!KIT_PAYMENT_LINK && <section className="section ce-apply" id="waitlist">
        <div className="ce-apply-copy">
          <SectionHead>Get it <em>first.</em></SectionHead>
          <p className="ce-intro">Join the list and I’ll email you the moment the kit is live.</p>
        </div>
        <div className="ce-apply-response" aria-live="polite" aria-atomic="true">{formStatus === 'success' ? <div className="ce-confirmation"><p><b>You’re on the list.</b> I’ll email you when the kit is live.</p></div> : <form onSubmit={submitForm}>
          <label className="wide">Name<input name="name" required autoComplete="name" /></label>
          <label className="wide">Email<input name="email" type="email" required autoComplete="email" /></label>
          <label className="wide">Instagram handle <span>(optional)</span><input name="instagram" placeholder="@yourhandle" autoComplete="off" /></label>
          <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <button className="button primary" type="submit" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? 'Adding you…' : 'Join the launch list'} <span aria-hidden="true"><ArrowIcon dir="up-right" /></span></button>
          {formStatus === 'error' && <p className="ce-status" role="alert">You weren’t added. Please try again, or email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
          {formStatus === 'mailto' && <p className="ce-status" role="status">Opening your email app with this message ready to send. If nothing opened, email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
        </form>}</div>
      </section>}

      <section className="section kit-final">
        <h2>Your followers are already <em>interested.</em></h2>
        <BuyButton />
      </section>
    </main>
    <footer><a className="brand" href="#top" aria-label="Back to top"><img src="/assets/logo-33.png" srcSet="/assets/logo-33.png 1x, /assets/logo-66.png 2x, /assets/logo-132.png 4x" width="33" height="33" alt="" /><span>SALES TEAM <b>IO</b></span></a><p>CRM · Automation · AI Enablement · Revenue Operations</p><div><a href="https://linkedin.com/in/chadpitton" target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${contactEmail}`}>Email</a><a href="/">Sales Team IO home</a></div><small>© {new Date().getFullYear()} Sales Team.io LLC. All rights reserved.</small></footer>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
