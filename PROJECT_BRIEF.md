# Sales Team IO website brief

## Objective
Build a polished, responsive lead-generation website for Sales Team IO at salesteamio.com. The company helps sales-driven businesses design and run reliable CRM, automation, AI-agent, reporting, and operational systems.

This is a private draft until Chad explicitly approves publication.

## Brand
- Company: Sales Team IO / Sales Team.io LLC
- Domain: salesteamio.com (registered at GoDaddy)
- Supplied logo: `public/assets/salesteamio-logo.png`
- Palette derived from the logo:
  - Electric blue: approximately `#35ADF2`
  - Deep graphite/black: approximately `#202124`
  - Slate gray: approximately `#41464D`
  - White/off-white for contrast
- Visual direction: dark, premium, modern systems/automation aesthetic; high contrast; electric-blue glow accents used sparingly.
- Preserve the supplied logo. Do not redraw it or invent a different brand mark.

## Structural reference
Use make.com as a structural reference, not as copy or design to clone. Borrow the general conversion pattern:
1. Tight top navigation with a primary CTA
2. High-impact hero with short outcome-led headline, supporting copy, two CTAs, and a visual workflow/system diagram
3. Technology/platform credibility band
4. Modular service/use-case cards
5. Visual “how it works” flow
6. Outcome/benefit section
7. Selected project/case-study cards
8. Founder/about section
9. Strong closing CTA and footer

Use original Sales Team IO design, messaging, and components. Do not copy Make’s wording, illustrations, or layout pixel-for-pixel.

## Audience
Owners, revenue leaders, operations leaders, and sales managers at sales-driven small and mid-sized businesses that have outgrown disconnected tools, brittle Zapier chains, manual handoffs, and unreliable CRM data.

Relevant industries based on Chad’s experience: business lending, home services, online education/coaching, and remote sales organizations.

## Positioning
Sales Team IO builds the operating system behind the sales team — CRM architecture, lead routing, AI-assisted follow-up, workflow automation, document collection, reporting, and enablement — so leads move faster, reps do less admin, and management can trust the data.

Avoid making Sales Team IO sound like a generic lead-generation agency or outsourced sales team. It is a systems, RevOps, automation, and AI-enablement consultancy.

## Recommended messaging
Possible hero direction:
- Eyebrow: `REVOPS • AUTOMATION • AI ENABLEMENT`
- Headline: `Build the system your sales team can actually run on.`
- Supporting copy: `Sales Team IO connects your CRM, automations, AI agents, follow-up, documents, and reporting into one reliable operating system.`
- Primary CTA: `Book a systems audit`
- Secondary CTA: `See what we build`

Tone: direct, practical, credible, confident, plain English. Focus on outcomes without invented statistics.

## Services
1. CRM Architecture & Administration
   - Close CRM environments, fields, stages, Smart Views, ownership logic, data hygiene, user/account administration.
2. Lead Routing & Sales Handoffs
   - Round robin, queues, ownership, speed-to-lead, local-number SMS, scheduling and rep handoffs.
3. Workflow Automation & Integrations
   - n8n, Zapier, APIs, webhooks, Google Workspace, forms, scheduling, Gmail, document platforms.
4. AI Agents & Enablement
   - Re-engagement/qualification agents, agent orchestration, prompt/task logic, human-in-the-loop QA.
5. Reporting & Revenue Operations
   - Pipeline visibility, KPI dashboards, reconciliation, payroll/commissions, campaign and sales reporting.
6. Documentation, QA & Team Adoption
   - SOPs, UAT, troubleshooting, naming conventions, training, and maintainable handoffs.

## Experience and proof
Chad Pitton is the owner and lead systems operator. Resume-based facts:
- Revenue Operations & Automation Consultant / Owner, 2020–present.
- Hands-on work in lending, home services, online education, and remote sales teams.
- Experience across Close CRM, n8n, Zapier, Kixie, PandaDoc, Content Snare, Airtable, Google Workspace, Calendly, GHL, Typeform, Stripe, Notion, Monday.com, REST APIs, webhooks, and lightweight scripting.
- Owns work from discovery through workflow mapping, implementation, testing, documentation, and user handoff.

## Public-safe selected project stories
Do not expose client names, customer records, credentials, internal IDs, or confidential details. Present these as generalized case studies:

### AI lead re-engagement system
Built an AI-assisted workflow that re-engages stale leads, qualifies responses, routes qualified prospects, and books calls with human oversight.

### Business lending operations pipeline
Connected lead capture, CRM, document collection, application preparation, Google Drive storage, internal review, lender submission, and follow-up into one trackable workflow.

### 20+ rep sales queue and assignment system
Designed Close/Kixie workflows for more than 20 sales reps using Smart Views, ownership rules, follow-up queues, appointment handoffs, and local-number SMS.

### Typeform-to-calendar attribution workflow
Carried survey responses and hidden tracking fields through booking into enriched calendar events so teams had context before each call.

### Multi-agent operations system
Configured AI agents and orchestration workflows to complete operational tasks, support automation delivery, and improve handoffs with quality checks.

### Revenue and operations reporting
Built reporting and reconciliation workflows across CRM, Stripe, Google Sheets, payroll, lead conversion, and sales activity.

## Technology credibility band
Use text badges or tasteful generic marks for: Close, n8n, Zapier, Google Workspace, Kixie, PandaDoc, Typeform, Calendly, Stripe, Airtable, OpenClaw, REST APIs/Webhooks. Do not download or misuse third-party trademark assets; text-only is acceptable.

## Conversion and contact
- Primary conversion: book/request a systems audit.
- For this draft, primary CTA may scroll to the contact form.
- Contact destination currently available from resume: `chadpitton@gmail.com`.
- LinkedIn: `https://linkedin.com/in/chadpitton`.
- Do not invent a calendar URL.
- Build a real working form UX without requiring a backend: use a mailto handoff or clearly marked local form behavior. Prefer an accessible form that opens a prefilled email after validation.
- No public deployment until explicit approval.

## Technical direction
- Create a self-contained static site that is inexpensive and low-maintenance to host.
- Recommended stack: Vite + React + TypeScript, or similarly lean static implementation.
- No paid dependencies.
- Responsive at mobile, tablet, and desktop sizes.
- Accessible semantic HTML, visible focus states, reduced-motion handling, good contrast, keyboard-friendly navigation.
- SEO essentials: useful title/description, Open Graph basics, canonical placeholder for `https://salesteamio.com`, favicon/app icon using supplied logo where practical, structured data for a professional service business.
- Performance: avoid heavy animation libraries unless justified; use CSS/SVG for workflow visuals.
- Include a README with local development, build, preview, deployment options, and DNS notes.
- Include a `.gitignore`.

## Definition of done
- Complete one-page marketing site exists in this folder.
- Original brand-consistent design and copy are implemented.
- Site builds cleanly.
- Main CTAs and navigation work.
- Contact form validates and opens a prefilled email.
- Responsive behavior and accessibility basics are verified.
- No sensitive client information appears.
- README explains local run/build and a recommended publishing path.
