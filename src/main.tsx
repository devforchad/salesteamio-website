import { FormEvent, useState } from 'react'
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState('')

  function closeMenu() { setMenuOpen(false) }
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) { form.reportValidity(); return }
    const data = new FormData(form)
    const subject = encodeURIComponent(`Systems audit request — ${data.get('name')}`)
    const body = encodeURIComponent(`Name: ${data.get('name')}\nCompany: ${data.get('company')}\nEmail: ${data.get('email')}\n\nWhat needs attention:\n${data.get('message')}`)
    setFormStatus('Your email app is opening with your request prepared.')
    window.location.href = `mailto:chadpitton@gmail.com?subject=${subject}&body=${body}`
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Sales Team IO home" onClick={closeMenu}><img src="/assets/salesteamio-logo.png" alt="" /><span>SALES TEAM <b>IO</b></span></a>
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
        <div className="system-visual" aria-label="Illustration of an integrated sales operations workflow">
          <div className="visual-glow"></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="node node-lead"><small>INPUT</small><b>New lead</b><span>Form · call · referral</span></div>
          <div className="node node-crm"><small>SYSTEM OF RECORD</small><b>CRM</b><span>Ownership · history</span></div>
          <div className="node node-ai"><small>ASSIST</small><b>AI workflow</b><span>Qualify · route · follow up</span></div>
          <div className="node node-rep"><small>ACTION</small><b>Sales rep</b><span>Context when it counts</span></div>
          <svg className="connections" viewBox="0 0 600 510" aria-hidden="true"><path d="M125 164 C 198 164, 210 170, 265 204"/><path d="M410 230 C 452 250, 457 297, 443 327"/><path d="M276 346 C 222 366, 180 360, 153 325"/><circle cx="265" cy="204" r="4"/><circle cx="443" cy="327" r="4"/></svg>
          <div className="visual-label"><span></span> OPERATIONAL FLOW</div>
        </div>
      </section>
      <section className="tech-band" aria-label="Technology experience"><p>Tools, platforms &amp; systems experience</p><div className="tech-list"><span>Close</span><span>n8n</span><span>Zapier</span><span>Google Workspace</span><span>Kixie</span><span>PandaDoc</span><span>Typeform</span><span>Calendly</span><span>Stripe</span><span>Airtable</span><span>OpenClaw</span><span>APIs / Webhooks</span></div></section>
      <section className="section services" id="services"><div className="section-heading"><p className="eyebrow"><span></span> CAPABILITIES</p><h2>Less busywork.<br/><em>More control.</em></h2><p>Every engagement is built around the points where leads, data, and people routinely lose momentum.</p></div><div className="service-grid">{services.map(service => <article className="service-card" key={service.number}><div className="card-top"><span className="icon"><Icon name={service.icon}/></span><small>{service.number}</small></div><h3>{service.title}</h3><p>{service.text}</p><a href="#contact" aria-label={`Discuss ${service.title}`}>Let’s discuss <span>↗</span></a></article>)}</div></section>
      <section className="section approach" id="approach"><div className="approach-intro"><p className="eyebrow"><span></span> HOW IT WORKS</p><h2>From a tangle of tools to a <em>working system.</em></h2><p>We start with the actual operation—not a generic template—then make the right work visible, repeatable, and easier to improve.</p></div><ol className="process"><li><b>01</b><div><h3>Map the reality</h3><p>Find the handoffs, exceptions, and friction your team lives with every day.</p></div></li><li><b>02</b><div><h3>Design the operating model</h3><p>Define the data, logic, ownership, and human checkpoints that make it reliable.</p></div></li><li><b>03</b><div><h3>Build &amp; test</h3><p>Implement the workflow, validate edge cases, and make the system understandable.</p></div></li><li><b>04</b><div><h3>Hand off with confidence</h3><p>Document, train, QA, and give your team a system they can operate without guessing.</p></div></li></ol></section>
      <section className="outcomes"><div><p className="eyebrow"><span></span> WHAT CHANGES</p><h2>Make the next right action <em>obvious.</em></h2></div><ul><li><span>01</span><p>Leads are routed, owned, and followed up without relying on someone to remember.</p></li><li><span>02</span><p>Reps have the context they need, where they need it, when a conversation starts.</p></li><li><span>03</span><p>Leaders can see the pipeline and trust what the numbers are actually telling them.</p></li><li><span>04</span><p>Your team spends less time repairing processes and more time moving opportunities.</p></li></ul></section>
      <section className="section projects" id="projects"><div className="section-heading"><p className="eyebrow"><span></span> SELECTED SYSTEMS</p><h2>Built around the work<br/>that actually happens.</h2><p>Examples of operational problems solved across sales-driven teams. Details are intentionally kept public-safe.</p></div><div className="project-grid">{projects.map(([title, text], i) => <article className="project-card" key={title}><div className={`project-art art-${i + 1}`}><span>{String(i + 1).padStart(2, '0')}</span><i></i><i></i><i></i></div><div><p>OPERATIONS SYSTEM</p><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
      <section className="section about" id="about"><div className="about-mark"><div className="monogram">ST<span>IO</span></div><p>Reliable systems are a<br/>competitive advantage.</p></div><div className="about-copy"><p className="eyebrow"><span></span> THE OPERATOR</p><h2>Built by someone who understands the <em>work behind the work.</em></h2><p>Sales Team IO is led by Chad Pitton, a revenue operations and automation consultant working hands-on from discovery through workflow mapping, implementation, testing, documentation, and user handoff.</p><p>His experience spans lending, home services, online education, and remote sales teams—where disconnected tools and unclear process quickly become expensive.</p><a className="text-link" href="https://linkedin.com/in/chadpitton" target="_blank" rel="noreferrer">Connect on LinkedIn <span>↗</span></a></div></section>
      <section className="contact" id="contact"><div className="contact-heading"><p className="eyebrow"><span></span> START HERE</p><h2>Let’s make your sales operation <em>easier to run.</em></h2><p>Tell us what’s breaking down, getting missed, or taking too much manual effort. We’ll start with the system underneath it.</p></div><form onSubmit={submitForm}><label>Name<input name="name" required autoComplete="name" /></label><label>Work email<input name="email" type="email" required autoComplete="email" /></label><label>Company <span>(optional)</span><input name="company" autoComplete="organization" /></label><label>What needs attention?<textarea name="message" required rows={5} placeholder="A few lines about your sales process, tools, or bottleneck."></textarea></label><button className="button primary" type="submit">Request a systems audit <span>↗</span></button><p className="form-note">No backend here—submitting opens a prepared email to Sales Team IO.</p><p className="form-status" aria-live="polite">{formStatus}</p></form></section>
    </main>
    <footer><a className="brand" href="#top" aria-label="Back to top"><img src="/assets/salesteamio-logo.png" alt="" /><span>SALES TEAM <b>IO</b></span></a><p>CRM · Automation · AI Enablement · Revenue Operations</p><div><a href="https://linkedin.com/in/chadpitton" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:chadpitton@gmail.com">Email</a></div><small>© {new Date().getFullYear()} Sales Team.io LLC. All rights reserved.</small></footer>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
