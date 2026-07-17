# TemplStudio

Marketing-studio website for local businesses and ecommerce brands. Warm editorial design — Fraunces display type, ivory/ink/terracotta palette, kinetic type and scroll animation throughout.

Built with **Next.js (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion · Lenis**.

## The one rule

**All content lives in [`src/content/site.ts`](src/content/site.ts).** Every headline, price, service, testimonial, case study, and image path is data — components never hard-code copy. Rename a service, change a price, or add a case study there and every page (including the generated `/work/[slug]` routes and the sitemap) updates automatically. Headline strings support `*asterisk*` accents, which render as italic terracotta serif words.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & deploy

```bash
npm run build      # static export → ./out
npm run preview    # serve the export locally
```

Deploy `out/` to any static host (Vercel, Netlify, Cloudflare Pages — no server needed).

## Before launch

- Set your Formspree form ID in `site.ts` (`contact.formspreeEndpoint`).
- Replace the placeholder artwork in `public/images/` with real photography (regenerate placeholders anytime with `node scripts/placeholders.mjs`).
- Swap the `#` social links in `site.ts` (`footer.socials`).
- Update `seo.siteUrl` in `site.ts` to the production domain.
