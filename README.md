# Sales Team IO website

Static one-page marketing site for Sales Team IO, built with Vite, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local URL. Use `npm run build` to run the TypeScript build and create the production-ready `dist/` folder. Use `npm run preview` to inspect that production build locally.

## Contact form

The form uses browser validation, then opens the visitor's default email application with a prefilled message addressed to `chadpitton@gmail.com`. It does not collect or send data to a backend.

## Deployment

The site is deployed to GitHub Pages from `main` after the automated checks pass. The production build is generated with `npm run build` and uploaded from `dist/`.

The canonical production URL is `https://salesteamio.com`. GitHub Pages handles the `www` redirect and HTTPS after the custom domain and DNS records have been validated.

## Design notes

- Uses the supplied logo at `public/assets/salesteamio-logo.png`; no third-party logos or assets are included.
- The design uses custom CSS and inline SVG workflow motifs, with responsive layouts and reduced-motion support.
- Copy uses public-safe project descriptions only; it contains no client names, customer records, metrics, testimonials, or claims of certification.
