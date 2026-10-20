import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './home.css'
import { contactEmail, DEFAULT_FORM_ENDPOINT, sendContact } from './contact'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'mailto'

function useContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const submitting = useRef(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) { form.reportValidity(); return }
    if (submitting.current) return
    const data = new FormData(form)
    if (data.get('website')) { setStatus('success'); return }
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim() || DEFAULT_FORM_ENDPOINT
    if (!endpoint) {
      setStatus('mailto')
      const subject = encodeURIComponent(`Systems audit request — ${data.get('name')}`)
      const body = encodeURIComponent(`Name: ${data.get('name')}\nCompany: ${data.get('company') ?? ''}\nEmail: ${data.get('email')}\n\nWhat needs attention:\n${data.get('message')}`)
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
      return
    }
    submitting.current = true
    setStatus('submitting')
    try {
      await sendContact({
        name: data.get('name'),
        email: data.get('email'),
        company: data.get('company') ?? '',
        message: data.get('message'),
        website: data.get('website'),
      }, endpoint)
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      submitting.current = false
    }
  }

  return { status, submit }
}

function Confirmation() {
  return <div className="form-confirmation" role="status"><h3>Thanks for reaching out.</h3><p>I’ll get back to you within one business day.</p></div>
}

function FormMessage({ status, className }: { status: FormStatus; className?: string }) {
  const cls = className ? `form-status ${className}` : 'form-status'
  if (status === 'error') return <p className={cls} role="alert">Your request wasn’t sent. Please try again, or email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
  if (status === 'mailto') return <p className={cls} role="status">Opening your email app with this message ready to send. If nothing opened, email me directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
  return null
}

function QuickForm() {
  const { status, submit } = useContactForm()
  if (status === 'success') return <div className="quick"><Confirmation /></div>
  const sending = status === 'submitting'
  return <form className="quick" aria-labelledby="quick-label" onSubmit={submit}>
    <label id="quick-label" htmlFor="q-msg">What's breaking in your sales process?</label>
    <textarea id="q-msg" name="message" rows={3} placeholder="Leads sit for an hour before anyone calls. Reps fight over who owns what. Stripe and the CRM never match." required></textarea>
    <div className="quick-row">
      <label className="sr" htmlFor="q-name">Your name</label>
      <input id="q-name" name="name" autoComplete="name" placeholder="Your name" required />
      <label className="sr" htmlFor="q-email">Your work email</label>
      <input id="q-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
    </div>
    <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="quick-actions">
      <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send to Chad'}</button>
      <p className="fine">Goes straight to my inbox. I reply within one business day.</p>
    </div>
    <FormMessage status={status} />
  </form>
}

function ContactForm() {
  const { status, submit } = useContactForm()
  if (status === 'success') return <Confirmation />
  const sending = status === 'submitting'
  return <form className="contact" onSubmit={submit}>
    <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" name="name" autoComplete="name" required /></div>
    <div className="field"><label htmlFor="c-email">Work email</label><input id="c-email" name="email" type="email" autoComplete="email" required /></div>
    <div className="field"><label htmlFor="c-company">Company <span>optional</span></label><input id="c-company" name="company" autoComplete="organization" /></div>
    <div className="field field-wide"><label htmlFor="c-msg">What needs attention?</label><textarea id="c-msg" name="message" rows={5} required placeholder="Your tools, your team size, and what keeps going wrong."></textarea></div>
    <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="field-wide submit-row"><button className="btn btn-light" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send to Chad'}</button></div>
    <FormMessage status={status} className="field-wide" />
  </form>
}

const tab = (n: number) => ({ '--tab': `var(--t${n})` }) as CSSProperties

function App() {
  // Scroll-spy for the divider tabs: the section in view pulls its tab out.
  useEffect(() => {
    const tabs = [...document.querySelectorAll<HTMLAnchorElement>('.tabs a')]
    const byId = new Map(tabs.map(a => [a.getAttribute('href')!.slice(1), a]))
    const setActive = (id: string) => tabs.forEach(a => {
      const on = a === byId.get(id)
      a.classList.toggle('is-active', on)
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current')
    })
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (hit) setActive(hit.target.id)
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .5, 1] })
    document.querySelectorAll('main > section').forEach(s => io.observe(s))
    setActive('overview')
    return () => io.disconnect()
  }, [])

  return <>
    <a className="skip" href="#overview">Skip to content</a>

    <div className="desk">
      <div className="sheet">

        <header className="masthead">
          <a className="brand" href="#overview" aria-label="Sales Team IO, back to top">
            <svg className="mark" viewBox="0 0 512 512" aria-hidden="true"><g transform="translate(256 256)"><g stroke="currentColor" strokeWidth="20" strokeLinecap="round" fill="none"><path d="M-52 -52 L-140 -140" /><path d="M52 -52 L140 -140" /><path d="M-52 52 L-140 140" /><path d="M52 52 L140 140" /></g><g fill="currentColor"><circle cx="-140" cy="-140" r="37.6" /><circle cx="140" cy="-140" r="37.6" /><circle cx="-140" cy="140" r="37.6" /><circle cx="140" cy="140" r="37.6" /></g><path fill="currentColor" d="M-58 -58 Q0 -24.6 58 -58 Q24.6 0 58 58 Q0 24.6 -58 58 Q-24.6 0 -58 -58 Z" /><g fill="#2f9be0"><circle cx="0" cy="-140" r="35" /><circle cx="0" cy="140" r="35" /><circle cx="-140" cy="0" r="35" /><circle cx="140" cy="0" r="35" /></g></g></svg>
            <span>Sales Team IO</span>
          </a>
          <p className="masthead-meta">CRM, lead routing and sales automation <span>· Chad Pitton</span></p>
          <nav className="masthead-links" id="primary-navigation" aria-label="Utility">
            <a href="/client-engine/">For creators</a>
            <a className="btn btn-small" href="#contact">Start a project</a>
          </nav>
        </header>

        {/* Divider tabs: the binder's own navigation. Sticky; the active tab pulls out. */}
        <nav className="tabs" aria-label="Sections">
          <a href="#overview" style={tab(1)}><b>1</b><span>Overview</span></a>
          <a href="#services" style={tab(2)}><b>2</b><span>Services</span></a>
          <a href="#work" style={tab(3)}><b>3</b><span>Work</span></a>
          <a href="#method" style={tab(4)}><b>4</b><span>Method</span></a>
          <a href="#about" style={tab(5)}><b>5</b><span>About</span></a>
          <a href="#contact" style={tab(6)} className="tab-ink"><b>6</b><span>Contact</span></a>
        </nav>

        <main>

          {/* 1 · OVERVIEW (cover page) */}
          <section className="cover" id="overview" style={tab(1)} aria-labelledby="cover-title">
            <div className="cover-main">
              <h1 id="cover-title">New leads answered in under a minute, routed to the right rep, and logged in your CRM.</h1>
              <p className="lede">I'm Chad Pitton. I design, build and run the CRM, lead routing, follow-up automation and AI texting behind sales teams of up to 50 reps.</p>

              <QuickForm />
            </div>

            <aside className="proof" aria-labelledby="proof-title">
              <h2 id="proof-title">The first five minutes decide the lead</h2>
              <p className="proof-sub">Before and after a routing build</p>

              <div className="measure">
                <h3>Time to first response</h3>
                <div className="scale" role="img" aria-label="Before: 5 to 10 minutes. After: under 60 seconds.">
                  <div className="track">
                    <span className="band band-before" style={{ '--from': '50%', '--to': '100%' } as CSSProperties}></span>
                    <span className="band band-after" style={{ '--from': '0%', '--to': '9%' } as CSSProperties}></span>
                  </div>
                  <div className="ticks" aria-hidden="true"><span style={{ '--at': '0%' } as CSSProperties}>0</span><span style={{ '--at': '10%' } as CSSProperties}>1</span><span style={{ '--at': '50%' } as CSSProperties}>5</span><span style={{ '--at': '100%' } as CSSProperties}>10 min</span></div>
                </div>
                <dl className="pair">
                  <div><dt>Before</dt><dd>5–10 min</dd></div>
                  <div className="after"><dt>After</dt><dd>Under 60 sec</dd></div>
                </dl>
                <p className="why">Between minute 5 and minute 10, the odds of reaching a lead fall fivefold.<sup><a href="#fn1" id="fn1-ref" aria-label="Footnote 1">1</a></sup></p>
              </div>

              <div className="measure">
                <h3>Manual lead assignment</h3>
                <div className="bars" role="img" aria-label="Before: about 50 hours a month. After: none, rules assign every lead.">
                  <span className="bar bar-before" style={{ '--w': '100%' } as CSSProperties}></span>
                  <span className="bar bar-after" style={{ '--w': '1.5%' } as CSSProperties}></span>
                </div>
                <dl className="pair">
                  <div><dt>Before</dt><dd>~50 hrs a month<sup><a href="#fn2" id="fn2-ref" aria-label="Footnote 2">2</a></sup></dd></div>
                  <div className="after"><dt>After</dt><dd>None<small>Rules assign every lead</small></dd></div>
                </dl>
              </div>

              <ol className="notes">
                <li id="fn1">MIT / InsideSales.com <a href="https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf">Lead Response Management Study</a> (2007), 15,000+ leads. <a href="#fn1-ref" aria-label="Back to text">↩</a></li>
                <li id="fn2">Estimate: about 2,000 leads a month at roughly 1.5 minutes of manual triage each. <a href="#fn2-ref" aria-label="Back to text">↩</a></li>
              </ol>
            </aside>

            <p className="clients"><span>Current and recent work:</span> I run the sales systems for <strong>Supple Warriors</strong> and produced product video ads for <strong>Crafted Coffee Supply</strong>. Other clients are in business lending, home services, e-commerce and med spas.</p>
          </section>

          {/* 2 · SERVICES */}
          <section className="chapter" id="services" style={tab(2)} aria-labelledby="services-title">
            <header className="divider">
              <h2 id="services-title"><span className="num">2</span> Scope of work</h2>
              <p>The six kinds of work I take on. Most projects combine two or three.</p>
            </header>
            <table className="scope">
              <thead><tr><th scope="col">Area</th><th scope="col">What I do</th><th scope="col">Usually built in</th></tr></thead>
              <tbody>
                <tr><th scope="row"><span className="clause">2.1</span>CRM setup and cleanup</th><td>Pipelines, stages, fields and ownership rules that match how you sell. Views reps actually open. Duplicates merged, dead fields removed.</td><td>Close, Airtable, Google Sheets</td></tr>
                <tr><th scope="row"><span className="clause">2.2</span>Lead routing and handoffs</th><td>Assignment by territory, capacity or rotation. Speed-to-lead alerts. Booked calls land with the right rep and the full history attached.</td><td>Close, Kixie, Calendly, n8n</td></tr>
                <tr><th scope="row"><span className="clause">2.3</span>Automation and integrations</th><td>The connections between your forms, CRM, calendar, payments, contracts and email, logged so a failure shows up instead of silently dropping a lead.</td><td>n8n, Zapier, webhooks, Stripe, PandaDoc, Typeform</td></tr>
                <tr><th scope="row"><span className="clause">2.4</span>AI texting and re-engagement</th><td>AI SMS setters that work new inquiries and old leads, with clear rules for when a person takes over.</td><td>n8n, Close, registered SMS</td></tr>
                <tr><th scope="row"><span className="clause">2.5</span>Sales reporting and attribution</th><td>Every payment tied back to the closer and setter. Leaderboards and pipeline numbers that reconcile with Stripe.</td><td>Stripe, Close, Google Sheets</td></tr>
                <tr><th scope="row"><span className="clause">2.6</span>Documentation and training</th><td>SOPs, naming conventions, training sessions and a written handoff, so your team can run the system without me.</td><td>Google Workspace</td></tr>
              </tbody>
            </table>
          </section>

          {/* 3 · WORK */}
          <section className="chapter" id="work" style={tab(3)} aria-labelledby="work-title">
            <header className="divider">
              <h2 id="work-title"><span className="num">3</span> Case files</h2>
              <p>Two clients by name. The rest are described by industry, at their request.</p>
            </header>

            <article className="case case-lead" aria-labelledby="c1">
              <div className="case-head">
                <span className="clause">3.1</span>
                <h3 id="c1">Supple Warriors</h3>
                <p className="case-meta">Fitness and mobility coaching · setters and closers · Close, Stripe, Google Sheets, n8n</p>
              </div>
              <div className="case-body">
                <p className="case-summary">I run their sales systems.</p>
                <ul>
                  <li>A daily sync matches every Stripe payment to the closer and setter recorded in Close. When it can't find a match it flags the row instead of guessing.</li>
                  <li>A sales leaderboard that only counts deals with a verified Stripe payment behind them.</li>
                  <li>An AI SMS setter that re-engages past leads and hands warm replies to a person.</li>
                </ul>
                <a className="link" href="https://demo.salesteamio.com/supple-warriors-sms-agent">Try the AI setter demo</a>
              </div>
            </article>

            <div className="case-grid">
              <article className="case" aria-labelledby="c2">
                <div className="case-head">
                  <span className="clause">3.2</span>
                  <h3 id="c2">Intake to lender submission</h3>
                  <p className="case-meta">Business lending</p>
                </div>
                <p>Connected the intake form, CRM, document collection, review, storage and lender submission into one flow, with follow-up at each stage and one status anyone can check.</p>
              </article>
              <article className="case" aria-labelledby="c3">
                <div className="case-head">
                  <span className="clause">3.3</span>
                  <h3 id="c3">Queues and ownership for a sales floor</h3>
                  <p className="case-meta">Multi-rep sales team</p>
                </div>
                <p>Ownership rules, focused rep queues, appointment handoffs and local-number texting, so every lead has exactly one owner and a next step.</p>
              </article>
              <article className="case" aria-labelledby="c4">
                <div className="case-head">
                  <span className="clause">3.4</span>
                  <h3 id="c4">Context on the calendar invite</h3>
                  <p className="case-meta">Appointment-setting team</p>
                </div>
                <p>Form answers and ad source carried into the calendar event, so the rep knows the job and the campaign before the call starts.</p>
              </article>
              <article className="case" aria-labelledby="c5">
                <div className="case-head">
                  <span className="clause">3.5</span>
                  <h3 id="c5">Crafted Coffee Supply</h3>
                  <p className="case-meta">Espresso accessories</p>
                </div>
                <p>Produced AI product video ads for their handmade portafilter handles, cut for vertical and landscape placements.</p>
              </article>
            </div>
          </section>

          {/* 4 · METHOD */}
          <section className="chapter" id="method" style={tab(4)} aria-labelledby="method-title">
            <header className="divider">
              <h2 id="method-title"><span className="num">4</span> How a project runs</h2>
              <p>Four stages. Each one ends with something you keep.</p>
            </header>
            <div className="method">
              <ol className="steps">
                <li><span className="clause">4.1</span><div><h3>Map what actually happens</h3><p>I talk to the people doing the work and trace real leads through your tools, exceptions included.</p></div><p className="keep"><span>You keep</span>Process map</p></li>
                <li><span className="clause">4.2</span><div><h3>Design the rules</h3><p>Data, ownership, timing, and the points where a person has to sign off.</p></div><p className="keep"><span>You keep</span>System blueprint</p></li>
                <li><span className="clause">4.3</span><div><h3>Build and test</h3><p>Built in your accounts and tested against the edge cases from the map before anyone relies on it.</p></div><p className="keep"><span>You keep</span>Tested workflow</p></li>
                <li><span className="clause">4.4</span><div><h3>Hand it over</h3><p>SOPs, training and a written playbook your team can run without calling me.</p></div><p className="keep"><span>You keep</span>Operating playbook</p></li>
              </ol>

              <figure className="excerpt" aria-labelledby="ex-cap">
                <figcaption id="ex-cap">What a playbook page looks like <em>(illustrative sample, not a client document)</em></figcaption>
                <div className="sop">
                  <div className="sop-head"><b>SOP 2.3</b><span>New inbound lead</span><span className="rev">Rev. 3 · Owner: Sales manager</span></div>
                  <table>
                    <thead><tr><th scope="col">Step</th><th scope="col">What happens</th><th scope="col">Within</th></tr></thead>
                    <tbody>
                      <tr><td>1</td><td>Form submitted; lead created in Close with source and answers</td><td>Seconds</td></tr>
                      <tr><td>2</td><td>Owner assigned by territory and current load</td><td>Seconds</td></tr>
                      <tr><td>3</td><td>First text sent from the owner's local number</td><td>60 sec</td></tr>
                      <tr><td>4</td><td>No reply: call task created for the owner</td><td>15 min</td></tr>
                      <tr><td>5</td><td>Still no contact: lead moves to the nurture sequence</td><td>3 days</td></tr>
                    </tbody>
                  </table>
                  <p className="sop-exception"><b>Exception</b> Existing customer detected: skip assignment, alert their current rep.</p>
                </div>
              </figure>
            </div>
          </section>

          {/* 5 · ABOUT */}
          <section className="chapter" id="about" style={tab(5)} aria-labelledby="about-title">
            <header className="divider">
              <h2 id="about-title"><span className="num">5</span> Who you'd work with</h2>
            </header>
            <div className="about">
              <div className="about-text">
                <p className="about-lead">Sales Team IO is me, Chad Pitton. I do the discovery, the mapping, the build, the testing and the handoff myself.</p>
                <p>I've worked inside lending, home services, coaching, e-commerce and med spa sales teams, where a lead that sits for ten minutes is a lead someone else calls first. That's the problem I like: the gap between a form being filled out and a rep picking up the phone, and everything that has to be true in the CRM for that to go right.</p>
                <p>Before I build anything I want to see how your team works today. Usually the fix is smaller than the tool everyone's arguing about.</p>
              </div>
              <div className="signature">
                <p className="sig-name">Chad Pitton</p>
                <p>Sales Team.io LLC</p>
                <p>Based in Florida, US Eastern time</p>
                <p><a className="link" href="mailto:chad@salesteamio.com">chad@salesteamio.com</a></p>
                <p><a className="link" href="https://linkedin.com/in/chadpitton">LinkedIn</a></p>
              </div>
            </div>
          </section>

          {/* 6 · CONTACT */}
          <section className="chapter chapter-ink" id="contact" style={tab(6)} aria-labelledby="contact-title">
            <header className="divider">
              <h2 id="contact-title"><span className="num">6</span> Tell me what's breaking</h2>
              <p>A few lines is enough. It goes straight to chad@salesteamio.com and I reply within one business day.</p>
            </header>
            <ContactForm />
          </section>
        </main>

        <footer className="colophon">
          <p>Sales Team.io LLC</p>
          <p><a href="mailto:chad@salesteamio.com">chad@salesteamio.com</a> · <a href="https://linkedin.com/in/chadpitton">LinkedIn</a> · <a href="/client-engine/">Client Engine</a></p>
          <p className="rev">Rev. October 2026</p>
        </footer>

      </div>
    </div>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
