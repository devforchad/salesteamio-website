# Sales Team IO website (private draft)

Static one-page marketing site for Sales Team IO, built with Vite, React, and TypeScript. It is intentionally a private draft and has not been published.

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local URL. Use `npm run build` to run the TypeScript build and create the production-ready `dist/` folder. Use `npm run preview` to inspect that production build locally.

## Contact form

The form uses browser validation, then opens the visitor's default email application with a prefilled message addressed to `chadpitton@gmail.com`. It does not collect or send data to a backend.

## Publishing after approval

This site can be hosted as static files on a low-maintenance platform such as Cloudflare Pages, Netlify, Vercel, or a conventional static host. Build it with `npm run build`, then deploy the contents of `dist/`.

For `salesteamio.com`, point the apex/root domain and `www` records according to the chosen host's DNS instructions. Set the canonical domain to `https://salesteamio.com`, redirect `www` to the chosen canonical host, and enable HTTPS. Do not change GoDaddy DNS until the deployment destination has been chosen and approved.

## Design notes

- Uses the supplied logo at `public/assets/salesteamio-logo.png`; no third-party logos or assets are included.
- The design uses custom CSS and inline SVG workflow motifs, with responsive layouts and reduced-motion support.
- Copy uses public-safe project descriptions only; it contains no client names, customer records, metrics, testimonials, or claims of certification.
