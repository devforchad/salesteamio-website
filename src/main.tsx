import { FormEvent, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type IconName = 'grid' | 'route' | 'bolt' | 'spark' | 'chart' | 'check'

const services: { icon: IconName; number: string; title: string; text: string }[] = [
  { icon: 'grid', number: '01', title: 'CRM architecture', text: 'Fields, stages, views, ownership logic, data hygiene, and the practical administration that keeps a CRM useful.' },
  { icon: 'route', number: '02', title: 'Lead routing & handoffs', text: 'Assignment rules, queues, speed-to-lead, scheduling, and clean rep handoffs that prevent leads from drifting.' },
  { icon: 'bolt', number: '03', title: 'Automation & integrations', text: 'Reliable workflows across n8n, Zapier, APIs, webhooks, forms, Gmail, documents, and the tools your team already uses.' },
  { icon: 'spark', number: '04', title: 'AI enablement', text: 'AI-assisted qualification, re-engagement, agent workflows, and human-in-the-loop review designed around real operations.' },
  { icon: 'chart', number: '05', title: 'Revenue operations', text: 'Pipeline visibility, KPI reporting, reconciliation, commission workflows, and data leaders can make decisions from.' },
  { icon: 'check', number: '06', title: 'Documentation & adoption', text: 'SOPs, naming conventions, QA, user testing, training, and handoffs that make the system maintainable after launch.' },
]

const projects = [
  ['AI lead re-engagement', 'A human-reviewed workflow to revive stalled conversations, qualify replies, route prospects, and support booking.'],
  ['Business lending operations', 'Connected intake, CRM, documents, review, storage, submissions, and follow-up into one traceable operating flow.'],
  ['Sales queue & assignment', 'Designed a multi-rep operating model with ownership rules, focused queues, appointment handoffs, and local-number SMS.'],
  ['Attribution to calendar', 'Carried form responses and tracking context into enriched calendar events so sales teams start every call informed.'],
]

const systemStages = [
  { label: 'INPUT', title: 'New lead', detail: 'Form · call · referral', icon: '01' },
  { label: 'SYSTEM OF RECORD', title: 'CRM', detail: 'Identity · owner · history', icon: '02' },
  { label: 'ORCHESTRATION', title: 'AI workflow', detail: 'Qualify · route · follow up', icon: '03' },
  { label: 'HUMAN ACTION', title: 'Sales rep', detail: 'Full context · next step', icon: '04' },
]

function SystemVisual() {
  return <div className="system-visual" role="img" aria-label="A connected sales system moves every new lead into the CRM, through an AI workflow, and to a sales rep with context">
    <div className="visual-glow"></div>
    <div className="visual-frame">
      <div className="visual-header"><span><i></i> LIVE OPERATING FLOW</span><small>4 systems connected</small></div>
      <ol className="system-flow">
        {systemStages.map((stage, index) => <li key={stage.title}>
          <div className="stage-index">{stage.icon}</div>
          <div className="stage-copy"><small>{stage.label}</small><b>{stage.title}</b><span>{stage.detail}</span></div>
          <span className="stage-status" aria-hidden="true">{index === systemStages.length - 1 ? 'READY' : 'SYNCED'}</span>
          {index < systemStages.length - 1 && <span className="flow-link" aria-hidden="true"><i></i></span>}
        </li>)}
      </ol>
      <div className="visual-footer"><span><i></i> No dropped handoffs</span><span>One traceable record</span></div>
    </div>
  </div>
}

function ProjectVisual({ index }: { index: number }) {
  if (index === 0) return <div className="project-art project-reengagement" role="img" aria-label="A stalled lead is reviewed by AI, approved by a person, and returned to an active conversation">
    <span className="art-number">01 · RE-ENGAGEMENT LOOP</span>
    <div className="mini-flow reengagement-flow">
      <div><small>14d quiet</small><b>Stalled lead</b></div><i></i><div className="accent"><small>signal found</small><b>AI review</b></div><i></i><div><small>approved</small><b>Human check</b></div><i></i><div className="success"><small>reply</small><b>Conversation</b></div>
    </div>
  </div>

  if (index === 1) return <div className="project-art project-lending" role="img" aria-label="A lending application moves through intake, CRM, documents, review, and submission with one tracked status">
    <span className="art-number">02 · TRACEABLE APPLICATION</span>
    <div className="lending-track"><span>INTAKE</span><span>CRM</span><span>DOCS</span><span>REVIEW</span><span>SUBMIT</span></div>
    <div className="lending-record"><span>APPLICATION #2048</span><b>Review package complete</b><small><i></i> 8 documents verified · owner assigned</small></div>
  </div>

  if (index === 2) return <div className="project-art project-routing" role="img" aria-label="New leads enter one assignment engine and are routed to the right sales queue and representative">
    <span className="art-number">03 · OWNERSHIP ENGINE</span>
    <div className="route-input"><small>NEW LEADS</small><b>24</b><span>unassigned</span></div>
    <span className="route-link" aria-hidden="true"></span>
    <div className="route-hub"><small>RULES</small><b>Territory + capacity</b></div>
    <span className="route-branches" aria-hidden="true"></span>
    <div className="route-output"><span><i>A</i> East queue <b>8</b></span><span><i>B</i> West queue <b>9</b></span><span><i>C</i> Follow-up <b>7</b></span></div>
  </div>

  return <div className="project-art project-attribution" role="img" aria-label="Form and campaign attribution data are attached to the calendar event so the rep enters the call informed">
    <span className="art-number">04 · CONTEXT TO CALENDAR</span>
    <div className="source-card"><small>FORM + UTM</small><b>Roof replacement</b><span>Google · Campaign 04</span></div>
    <div className="transfer-line" aria-hidden="true"><i></i></div>
    <div className="calendar-card"><header><span>SEP</span><b>24</b></header><div><small>DISCOVERY CALL</small><b>Jordan Miller</b><span>Need, source, answers attached</span></div></div>
  </div>
}

function OperatorVisual() {
  return <div className="about-mark" role="img" aria-label="One accountable operator owns discovery, architecture, implementation, quality assurance, and handoff">
    <div className="operator-label"><span></span> HANDS-ON DELIVERY</div>
    <div className="operator-core"><small>ONE ACCOUNTABLE</small><b>Operator</b><span>Discovery through handoff</span></div>
    <ol className="operator-stages">
      <li><b>01</b><span>Discovery</span><i>Mapped</i></li>
      <li><b>02</b><span>Architecture</span><i>Designed</i></li>
      <li><b>03</b><span>Implementation</span><i>Built</i></li>
      <li><b>04</b><span>QA + handoff</span><i>Verified</i></li>
    </ol>
  </div>
}

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
    route: 'M5 4v5c0 2 2 3 4 3h6c2 0 4 1 4 3v5M5 20v-5c0-2 2-3 4-3h6c2 0 4-1 4-3V4',
    bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
    spark: 'm12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 14 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z',
    chart: 'M4 20V10m6 10V4m6 16v-7m6 7V7',
    check: 'm5 12 4.2 4L19 6',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'mailto'
const contactEmail = 'chad@salesteamio.com'

// Our own n8n endpoint. Safe to ship in the bundle: it is a public POST URL
// with no credential attached, CORS-locked to this origin, and the workflow
// validates and rate-limits on the server side. VITE_FORM_ENDPOINT can still
// override it (staging, or a swap to another provider) without a code change.
const DEFAULT_FORM_ENDPOINT = 'https://n8n.salesteamio.com/webhook/website-contact'

// Posts to our own n8n workflow at n8n.salesteamio.com, which persists the
// submission to Postgres before emailing it on. No third-party form service,
// and no API key in the client bundle.
async function sendContact(data: FormData, endpoint: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.get('name'),
      email: data.get('email'),
      company: data.get('company'),
      message: data.get('message'),
      website: data.get('website'),
    }),
  })
  if (!response.ok || (await response.json()).success !== true) throw new Error('Form delivery failed')
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const submitting = useRef(false)

  function closeMenu() { setMenuOpen(false) }
  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) { form.reportValidity(); return }
    if (submitting.current) return
    const data = new FormData(form)
    if (data.get('website')) { setFormStatus('success'); return }
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim() || DEFAULT_FORM_ENDPOINT
    if (!endpoint) {
      setFormStatus('mailto')
      const subject = encodeURIComponent(`Systems audit request — ${data.get('name')}`)
      const body = encodeURIComponent(`Name: ${data.get('name')}\nCompany: ${data.get('company')}\nEmail: ${data.get('email')}\n\nWhat needs attention:\n${data.get('message')}`)
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
      return
    }
    submitting.current = true
    setFormStatus('submitting')
    try {
      await sendContact(data, endpoint)
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
      <a className="brand" href="#top" aria-label="Sales Team IO home" onClick={closeMenu}><img src="/assets/logo-33.png" srcSet="/assets/logo-33.png 1x, /assets/logo-66.png 2x, /assets/logo-132.png 4x" width="33" height="33" alt="" /><span>SALES TEAM <b>IO</b></span></a>
      <button className="menu-button" aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i></i><i></i></button>
      <nav id="primary-navigation" className={menuOpen ? 'open' : ''} aria-label="Primary navigation">
        <a href="#services" onClick={closeMenu}>Services</a><a href="#approach" onClick={closeMenu}>Approach</a><a href="#projects" onClick={closeMenu}>Work</a><a href="#about" onClick={closeMenu}>About</a>
        <a className="nav-cta" href="#contact" onClick={closeMenu}>Request an audit <span>↗</span></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span></span> REVOPS · AUTOMATION · AI ENABLEMENT</p>
          <h1>Build the system your <em>sales team</em> can actually run on.</h1>
          <p className="hero-text">Sales Team IO connects your CRM, automations, AI agents, follow-up, documents, and reporting into one reliable operating system.</p>
          <div className="actions"><a className="button primary" href="#contact">Book a systems audit <span>↗</span></a><a className="button secondary" href="#services">See what we build <span>↓</span></a></div>
          <p className="microcopy"><span className="dot"></span> Built for sales-driven teams that are done with duct tape.</p>
        </div>
        <SystemVisual />
      </section>
      <section className="tech-band" aria-label="Technology experience"><p>Tools, platforms &amp; systems experience</p><div className="tech-list" tabIndex={0} aria-label="Scrollable technology list"><span>Close</span><span>n8n</span><span>Zapier</span><span>Google Workspace</span><span>Kixie</span><span>PandaDoc</span><span>Typeform</span><span>Calendly</span><span>Stripe</span><span>Airtable</span><span>OpenClaw</span><span>APIs / Webhooks</span></div></section>
      <section className="section services" id="services"><div className="section-heading"><p className="eyebrow"><span></span> CAPABILITIES</p><h2>Less busywork.<br/><em>More control.</em></h2><p>Every engagement is built around the points where leads, data, and people routinely lose momentum.</p></div><div className="service-grid">{services.map(service => <article className="service-card" key={service.number}><div className="card-top"><span className="icon"><Icon name={service.icon}/></span><small>{service.number}</small></div><h3>{service.title}</h3><p>{service.text}</p><a href="#contact" aria-label={`Discuss ${service.title}`}>Let’s discuss <span>↗</span></a></article>)}</div></section>
      <section className="section approach" id="approach"><div className="approach-intro"><p className="eyebrow"><span></span> HOW IT WORKS</p><h2>From a tangle of tools to a <em>working system.</em></h2><p>We start with the actual operation—not a generic template—then make the right work visible, repeatable, and easier to improve.</p></div><ol className="process" aria-label="Four connected delivery phases"><li><b>01</b><div><small>DISCOVER</small><h3>Map the reality</h3><p>Find the handoffs, exceptions, and friction your team lives with every day.</p></div><span>Process map</span></li><li><b>02</b><div><small>DESIGN</small><h3>Design the operating model</h3><p>Define the data, logic, ownership, and human checkpoints that make it reliable.</p></div><span>System blueprint</span></li><li><b>03</b><div><small>IMPLEMENT</small><h3>Build &amp; test</h3><p>Implement the workflow, validate edge cases, and make the system understandable.</p></div><span>Verified workflow</span></li><li><b>04</b><div><small>ENABLE</small><h3>Hand off with confidence</h3><p>Document, train, QA, and give your team a system they can operate without guessing.</p></div><span>Operating playbook</span></li></ol></section>
      <section className="outcomes"><div><p className="eyebrow"><span></span> WHAT CHANGES</p><h2>Make the next right action <em>obvious.</em></h2></div><ul><li><span>01</span><p>Leads are routed, owned, and followed up without relying on someone to remember.</p></li><li><span>02</span><p>Reps have the context they need, where they need it, when a conversation starts.</p></li><li><span>03</span><p>Leaders can see the pipeline and trust what the numbers are actually telling them.</p></li><li><span>04</span><p>Your team spends less time repairing processes and more time moving opportunities.</p></li></ul></section>
      <section className="section projects" id="projects"><div className="section-heading"><p className="eyebrow"><span></span> SELECTED SYSTEMS</p><h2>Built around the work<br/>that actually happens.</h2><p>Examples of operational problems solved across sales-driven teams. Details are intentionally kept public-safe.</p></div><div className="project-grid">{projects.map(([title, text], i) => <article className="project-card" key={title}><ProjectVisual index={i}/><div><p>OPERATIONS SYSTEM</p><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
      <section className="section about" id="about"><OperatorVisual/><div className="about-copy"><p className="eyebrow"><span></span> THE OPERATOR</p><h2>Built by someone who understands the <em>work behind the work.</em></h2><p>Sales Team IO is led by Chad Pitton, a revenue operations and automation consultant working hands-on from discovery through workflow mapping, implementation, testing, documentation, and user handoff.</p><p>His experience spans lending, home services, online education, and remote sales teams—where disconnected tools and unclear process quickly become expensive.</p><a className="text-link" href="https://linkedin.com/in/chadpitton" target="_blank" rel="noreferrer">Connect on LinkedIn <span>↗</span></a></div></section>
      <section className="contact" id="contact"><div className="contact-heading"><p className="eyebrow"><span></span> START HERE</p><h2>Let’s make your sales operation <em>easier to run.</em></h2><p>Tell us what’s breaking down, getting missed, or taking too much manual effort. We’ll start with the system underneath it.</p></div><div className="contact-response" aria-live="polite" aria-atomic="true">{formStatus === 'success' ? <div className="form-confirmation"><h3>Thanks for reaching out.</h3><p>I’ll get back to you within one business day.</p></div> : <form onSubmit={submitForm}><label>Name<input name="name" required autoComplete="name" /></label><label>Work email<input name="email" type="email" required autoComplete="email" /></label><label>Company <span>(optional)</span><input name="company" autoComplete="organization" /></label><label>What needs attention?<textarea name="message" required rows={5} placeholder="A few lines about your sales process, tools, or bottleneck."></textarea></label><div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><button className="button primary" type="submit" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? 'Sending your request…' : 'Request a systems audit'} <span aria-hidden="true">↗</span></button>{formStatus === 'error' && <p className="form-status" role="alert">Your request wasn’t sent. Please try again, or email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}{formStatus === 'mailto' && <p className="form-status" role="status">Opening your email app with this message ready to send. If nothing opened, email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}</form>}</div></section>
    </main>
    <footer><a className="brand" href="#top" aria-label="Back to top"><img src="/assets/logo-33.png" srcSet="/assets/logo-33.png 1x, /assets/logo-66.png 2x, /assets/logo-132.png 4x" width="33" height="33" alt="" /><span>SALES TEAM <b>IO</b></span></a><p>CRM · Automation · AI Enablement · Revenue Operations</p><div><a href="https://linkedin.com/in/chadpitton" target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${contactEmail}`}>Email</a></div><small>© {new Date().getFullYear()} Sales Team.io LLC. All rights reserved.</small></footer>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
