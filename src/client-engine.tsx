import { FormEvent, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './client-engine.css'
import { ArrowIcon } from './arrow'
import { contactEmail, DEFAULT_FORM_ENDPOINT, sendContact } from './contact'

const DEMO_URL = 'https://demo.salesteamio.com/supple-warriors-sms-agent'

const flowStages = [
  { label: '01 FOLLOWER', title: 'Sees your content', detail: 'Reel · story · bio link' },
  { label: '02 PAGE', title: 'Opts in', detail: 'Lead magnet · quiz · application' },
  { label: '03 FOLLOW-UP', title: 'Emails + AI text', detail: 'Under 60 seconds' },
  { label: '04 SALES', title: 'Booked call', detail: 'On your calendar' },
]

const leaks = [
  ['No email capture.', 'Followers tap your link, look around, and leave. You never get the chance to follow up.'],
  ['“DM me” with nobody behind it.', 'Interested people message you and the replies go out hours or days later, after they’ve moved on.'],
  ['No idea what’s working.', 'You can’t tell which posts, hooks or offers turn into buyers, so you can’t do more of them.'],
]

const includes = [
  ['Pages that convert.', 'Opt-in, quiz or application funnel built around your offer, with 10 variations using 10 different hooks so you can see which one wins.'],
  ['Email sequences.', 'A welcome and nurture sequence written in your voice, connected to the email tool you already use.'],
  ['Ad scripts and setup.', '10 ad scripts and creative briefs plus a step-by-step guide to launching your first Meta campaign.'],
  ['AI SMS setter.', 'Texts every new lead within a minute, answers questions, qualifies them and books the call. Hands off to you when a human is needed.'],
]

const packages = [
  { name: 'Lead Capture', price: '$997', blurb: 'Start collecting emails from your audience.', featured: false, items: ['Landing / opt-in page', 'Lead magnet copy', '5-email welcome sequence', 'Connected to your email tool', 'Live in about 5 days'] },
  { name: 'Client Engine', price: '$2,500', blurb: 'The full system from follower to booked call.', featured: true, items: ['Multi-step funnel (opt-in → video or quiz → application → booking)', '10 page variations with 10 different hooks', '7-email nurture sequence', 'CRM and calendar wiring', 'Live in about 7 days'] },
  { name: 'Engine + Growth', price: '$4,500', blurb: 'Client Engine plus ads and the AI setter.', featured: false, items: ['Everything in Client Engine', 'Ads Launch Pack: 10 scripts, briefs and setup guide', 'AI SMS setter that qualifies and books leads', '30 days of tuning after launch'] },
]

const proof: { title: string; text: string; stat?: [string, string]; link?: [string, string] }[] = [
  { title: 'Supple Warriors: sales systems.', text: 'I run the CRM, Stripe-verified sales attribution and the live sales leaderboard for Supple Warriors, a mobility coaching business. The leaderboard tracks over $235,000 in verified sales.', stat: ['$235k+', 'verified sales tracked'] },
  { title: 'Supple Warriors: AI SMS setter.', text: 'An AI setter built to re-engage 654 past leads, qualify them and book calls. Click through 14 real conversations.', link: [DEMO_URL, 'Open the demo'] },
  { title: 'eCom Babes: operations since 2020.', text: 'CRM, campaigns, webinars, payments and student onboarding for an online education brand, run day to day since 2020.' },
  { title: 'Rehab clinic funnel.', text: 'A patient funnel for a physical therapy practice: pain quiz, tailored plan, booking.', link: ['https://demo.salesteamio.com/rehab/', 'Open the funnel'] },
  { title: 'Med spa AI receptionist.', text: 'An AI texting assistant that rebooks clients, handles pricing questions and knows when to hand off to staff.', link: ['https://demo.salesteamio.com/med-spa-sms-agent', 'Open the demo'] },
]

const steps = [
  ['DAY 1', 'Kickoff and intake.', 'You send your logo, colors, images and a short brief about your offer.'],
  ['DAY 2', 'Competitor teardown.', 'I study the funnels of the top players in your niche and map what to borrow and what to beat.'],
  ['DAYS 3–5', 'Build.', 'Pages, hooks, emails, ad scripts and automations, built and wired up.'],
  ['DAY 6', 'Test.', 'Every form, email, text and booking tested end to end on mobile and desktop.'],
  ['DAY 7', 'Launch and handoff.', 'We go live together and you get a recorded walkthrough of the whole system.'],
]

const faqs = [
  ['Do I need to run paid ads?', 'No. The system works with your organic Instagram traffic. Ads are an optional add-on if you want to scale.'],
  ['What platform do you build on?', 'If you already use Kajabi, ClickFunnels, GoHighLevel or similar, I build inside it. If not, I build fast custom pages on your own domain and connect them to the tools you use.'],
  ['Do I own everything?', 'Yes. Your domain, your accounts, your leads. If we stop working together, you keep the whole system.'],
  ['Can you guarantee results?', 'No one honestly can. I guarantee the system works as specified and that you’ll see exactly where leads come from and where they drop off.'],
  ['What if I don’t have an offer yet?', 'Then this isn’t the right first step. Client Engine is for creators who already sell coaching, a program or a product.'],
  ['Why so much cheaper than an agency?', 'I use AI to do in hours what used to take a team weeks, and founding clients get a lower rate in exchange for a review.'],
]

const followerRanges = ['Under 20k', '20k–50k', '50k–100k', '100k–400k', '400k+']
const packageOptions = ['Not sure yet', 'Lead Capture ($997)', 'Client Engine ($2,500)', 'Engine + Growth ($4,500)']

function FlowVisual() {
  return <div className="system-visual" role="img" aria-label="Your content turns a follower into a lead on your page, who then gets emails and an AI text within 60 seconds and ends up as a booked call on your calendar">
    <div className="visual-glow"></div>
    <div className="visual-frame">
      <div className="visual-header"><span><i></i> FOLLOWER TO CALL</span><small>4 steps</small></div>
      <ol className="system-flow">
        {flowStages.map((stage, index) => <li key={stage.title}>
          <div className="stage-copy"><small>{stage.label}</small><b>{stage.title}</b><span>{stage.detail}</span></div>
          {index < flowStages.length - 1 && <span className="flow-link" aria-hidden="true"><i></i></span>}
        </li>)}
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
    const handle = `@${String(data.get('instagram')).trim().replace(/^@+/, '')}`
    const bioLink = String(data.get('bio')).trim() || 'none'
    const message = [
      '[Client Engine application]',
      `Instagram: ${handle}`,
      `Followers: ${data.get('followers')}`,
      `Sells: ${data.get('offer')}`,
      `Bio link: ${bioLink}`,
      `Package: ${data.get('package')}`,
    ].join('\n')
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim() || DEFAULT_FORM_ENDPOINT
    if (!endpoint) {
      setFormStatus('mailto')
      const subject = encodeURIComponent(`Client Engine application — ${data.get('name')}`)
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
        <a href="#packages" onClick={closeMenu}>Packages</a><a href="#proof" onClick={closeMenu}>Proof</a><a href="#process" onClick={closeMenu}>Process</a><a href="#faq" onClick={closeMenu}>FAQ</a>
        <a className="nav-cta" href="#apply" onClick={closeMenu}>Apply now <span><ArrowIcon dir="up-right" /></span></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Turn your followers into <em>booked calls.</em></h1>
          <p className="hero-text">I build the page, the emails, the ad scripts, and an AI assistant that texts every new lead in under a minute. Live in about 7 days, for a fraction of what an agency charges.</p>
          <div className="actions"><a className="button primary" href="#apply">Apply for a founding spot <span><ArrowIcon dir="up-right" /></span></a><a className="button secondary" href={DEMO_URL} target="_blank" rel="noreferrer">See the AI setter demo <span><ArrowIcon dir="up-right" /></span></a></div>
          <p className="microcopy"><span className="dot"></span> Built for coaches and creators. Founding rates for the first 10 clients.</p>
        </div>
        <FlowVisual />
      </section>

      <section className="section ce-leak" id="leak">
        <SectionHead>Your audience is there. <em>The system isn’t.</em></SectionHead>
        <p className="ce-intro">Most creators with 50k–400k followers send people to a link-in-bio and hope. Three things usually go wrong:</p>
        <div className="ce-grid ce-grid-3">{leaks.map(([title, text]) => <article className="ce-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="section ce-includes" id="what-you-get">
        <SectionHead>Everything between a follow and <em>a sale.</em></SectionHead>
        <div className="ce-grid ce-grid-4">{includes.map(([title, text]) => <article className="ce-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="section ce-packages" id="packages">
        <SectionHead>Fixed scope. <em>Founding prices.</em></SectionHead>
        <p className="ce-intro">Founding rates apply to the first 10 clients, in exchange for an honest review and permission to share results. Prices go up after that.</p>
        <div className="ce-grid ce-grid-3 ce-pricing">{packages.map(pkg => <article className={pkg.featured ? 'ce-card ce-package featured' : 'ce-card ce-package'} key={pkg.name}>
          {pkg.featured && <span className="ce-badge">Most popular</span>}
          <h3>{pkg.name}</h3>
          <p className="ce-price">{pkg.price}</p>
          <p className="ce-blurb">{pkg.blurb}</p>
          <ul>{pkg.items.map(item => <li key={item}>{item}</li>)}</ul>
          <a className={pkg.featured ? 'button primary' : 'button secondary'} href="#apply">Apply for this package</a>
        </article>)}</div>
        <p className="ce-addons"><b>Add-ons:</b> Ads Launch Pack +$1,000 · AI SMS setter +$1,500 · <b>Ongoing:</b> new hooks, tuning and reporting from $1,000/month.</p>
        <p className="ce-small">50% to start, 50% at launch. Two rounds of revisions included.</p>
        <p className="ce-addons">Not ready for done-for-you? <a href="/kit/">Start with the $27 Creator Funnel Kit →</a></p>
      </section>

      <section className="section ce-proof" id="proof">
        <SectionHead>Built on systems that <em>already sell.</em></SectionHead>
        <p className="ce-intro">I’m Chad Pitton. I’ve spent six years building the sales systems behind online coaching and education businesses. Here’s real work you can look at today.</p>
        <div className="ce-grid ce-grid-proof">{proof.map(item => <article className="ce-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          {item.stat && <p className="ce-stat"><b>{item.stat[0]}</b><span>{item.stat[1]}</span></p>}
          {item.link && <a className="text-link" href={item.link[0]} target="_blank" rel="noreferrer">{item.link[1]} <span><ArrowIcon dir="up-right" /></span></a>}
        </article>)}</div>
      </section>

      <section className="section ce-process" id="process">
        <SectionHead>Live in about <em>7 days.</em></SectionHead>
        <ol className="process" aria-label="Five steps from kickoff to launch">{steps.map(([day, title, text]) => <li key={day}><b>{day}</b><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
      </section>

      <section className="section ce-faq" id="faq">
        <SectionHead>Questions, <em>answered.</em></SectionHead>
        <div className="ce-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="section ce-apply" id="apply">
        <div className="ce-apply-copy">
          <SectionHead>Claim a <em>founding spot.</em></SectionHead>
          <p className="ce-intro">Tell me about your audience and offer. I’ll review your page and reply within one business day with a call time.</p>
        </div>
        <div className="ce-apply-response" aria-live="polite" aria-atomic="true">{formStatus === 'success' ? <div className="ce-confirmation"><p><b>Application received.</b> I’ll review your page and get back to you within one business day.</p></div> : <form onSubmit={submitForm}>
          <label>Name<input name="name" required autoComplete="name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Instagram handle<input name="instagram" required placeholder="@yourhandle" autoComplete="off" /></label>
          <label>Followers<select name="followers" required defaultValue="">
            <option value="" disabled>Select a range</option>
            {followerRanges.map(range => <option key={range} value={range}>{range}</option>)}
          </select></label>
          <label className="wide">What do you sell?<textarea name="offer" required rows={3} placeholder="Coaching, a program, a course, a product…"></textarea></label>
          <label className="wide">Link in your bio right now <span>(optional)</span><input name="bio" type="url" placeholder="https://" autoComplete="off" /></label>
          <label className="wide">Package interest<select name="package" defaultValue="Not sure yet">
            {packageOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select></label>
          <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <button className="button primary" type="submit" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? 'Sending your application…' : 'Apply for a founding spot'} <span aria-hidden="true"><ArrowIcon dir="up-right" /></span></button>
          {formStatus === 'error' && <p className="ce-status" role="alert">Your application wasn’t sent. Please try again, or email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
          {formStatus === 'mailto' && <p className="ce-status" role="status">Opening your email app with this message ready to send. If nothing opened, email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
        </form>}</div>
      </section>
    </main>
    <footer><a className="brand" href="#top" aria-label="Back to top"><img src="/assets/logo-33.png" srcSet="/assets/logo-33.png 1x, /assets/logo-66.png 2x, /assets/logo-132.png 4x" width="33" height="33" alt="" /><span>SALES TEAM <b>IO</b></span></a><p>CRM · Automation · AI Enablement · Revenue Operations</p><div><a href="https://linkedin.com/in/chadpitton" target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${contactEmail}`}>Email</a><a href="/">Sales Team IO home</a></div><small>© {new Date().getFullYear()} Sales Team.io LLC. All rights reserved.</small></footer>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
