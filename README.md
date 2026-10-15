# Sales Team IO website

Static one-page marketing site for Sales Team IO, built with Vite, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local URL. Use `npm run build` to run the TypeScript build and create the production-ready `dist/` folder. Use `npm run preview` to inspect that production build locally.

## Contact form

Both forms (home page and Client Engine) validate in the browser, then POST JSON to the n8n webhook `https://n8n.salesteamio.com/webhook/website-contact` (see `src/contact.ts`). The workflow persists each submission to Postgres and then emails it. Set `VITE_FORM_ENDPOINT` to override the endpoint (staging, or another provider). If delivery fails, the form stays filled and shows a direct email link; it never claims delivery before the webhook confirms. A hidden honeypot field, `website`, filters basic bots.

## Client Engine page

A second page lives at `https://salesteamio.com/client-engine/`. It sells the Client Engine offer to Instagram coaches and creators.

- Entry: `client-engine/index.html` (second Vite input in `vite.config.ts`)
- Source: `src/client-engine.tsx` and `src/client-engine.css` (reuses `src/styles.css`)
- Shared form code: `src/contact.ts` (`sendContact`, the default endpoint and the contact email), used by both pages
- Tests: `tests/client-engine.spec.ts`

The application form reuses the `website-contact` n8n endpoint. That workflow accepts only `name`, `email`, `company`, `message` and `website`, so the Instagram handle is sent as `company` and the remaining answers are packed into `message`.

## Deployment

The site is deployed to GitHub Pages from `main` after the automated checks pass. The production build is generated with `npm run build` and uploaded from `dist/`.

The canonical production URL is `https://salesteamio.com`. GitHub Pages handles the `www` redirect and HTTPS after the custom domain and DNS records have been validated.

## Design notes

- Keeps the supplied master logo at `assets-src/salesteamio-logo.png`; only resized derivatives are published from `public/assets/`. No third-party logos or assets are included.
- The design uses custom CSS and inline SVG workflow motifs, with responsive layouts and reduced-motion support.
- Copy uses public-safe project descriptions only; it contains no client names, customer records, metrics, testimonials, or claims of certification.
