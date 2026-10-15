# Sales Team IO website

Static one-page marketing site for Sales Team IO, built with Vite, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local URL. Use `npm run build` to run the TypeScript build and create the production-ready `dist/` folder. Use `npm run preview` to inspect that production build locally.

## Contact form

The form validates in the browser and sends a JSON request to Web3Forms. Register `chad@salesteamio.com` as the recipient with Web3Forms, then set the GitHub Actions repository secret `VITE_FORM_ENDPOINT` to `https://api.web3forms.com/submit?access_key=YOUR_KEY` (see `.env.example`). The deploy build reads that setting; Playwright uses a separate placeholder key with mocked requests. The public access key is embedded in the static bundle; restrict the domain with Web3Forms. No real key is supplied in this repository. Until configured, submissions fall back to a prefilled email draft and display a direct email link. Provider failures also show the email link; the form never claims delivery before confirmation. A hidden honeypot filters basic bots. The site has no own backend or storage.

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
