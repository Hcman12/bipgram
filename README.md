# Bipgram — Coming Soon

Animated "under construction" landing page for **Bipgram**, the app for meeting celebrities.
Built with [Astro](https://astro.build) + TypeScript: static HTML, no framework runtime, tiny inline scripts.

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Dev server at http://localhost:4321           |
| `npm run build`   | Type-check (`astro check`) and build to `dist/` |
| `npm run preview` | Serve the production build locally            |

Requires Node.js 22.12 or newer. Astro is pinned to 7.3.8 because later 7.x releases need Node 22.23.4+.

## Environment variables

Settings that change per environment live in **`.env`** (git-ignored). Start from the template:

```sh
cp .env.example .env
```

| Variable                   | Default  | What it does                                                        |
| -------------------------- | -------- | ------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`          | `https://bipgram.com` | Live domain, used for canonical and social-share URLs |
| `PUBLIC_LAUNCH_DATE`       | `2027-03-01T18:00:00Z` | Countdown target, ISO 8601 with timezone |
| `PUBLIC_BUILD_PROGRESS`    |          | % on the progress bar, 0–100 (default 78)                          |
| `PUBLIC_CONTACT_EMAIL`     |          | Footer email                                                        |
| `PUBLIC_INSTAGRAM_URL`, `PUBLIC_X_URL`, `PUBLIC_TIKTOK_URL` | | Social icons in the header, hidden when empty |
| `PUBLIC_POWERED_BY_NAME`, `PUBLIC_POWERED_BY_URL` | | Footer credit (default: All Things Web Technology Inc) |

The schema lives in `astro.config.mjs` (`env.schema`) and is read through `astro:env` in `src/config.ts`.
Values are validated every time `npm run dev` or `npm run build` starts. A bad URL or a
date without a timezone stops the build with a message naming the variable.

All of these are public: they end up in the page's HTML. Don't put secrets in `.env`.
On Netlify, Vercel or Cloudflare Pages, set the same variables in the host's dashboard.

Brand copy (name, tagline, description) is in **`src/config.ts`**.

## Brand assets

`src/assets/brand/` holds the original Bipgram logo plus a transparent version and the icon mark.
Favicons, app icons and the 1200×630 social image are in `public/`.

## Structure

```
src/
  config.ts                     site settings (reads .env via astro:env)
  layouts/Layout.astro          <head>, SEO / Open Graph, fonts
  pages/index.astro             the page
  components/
    ConstructionScene.astro     animated SVG site: crane, neon sign, welder, red carpet, flashes
    Starfield.astro             canvas starfield + shooting stars
    Countdown.astro             split-flap launch countdown (shown first)
    CodingWorker.astro          worker on the countdown: codes, sips coffee, walks; tap to shake
    BuildProgress.astro         progress bar + typewriter status
public/                         favicons, OG image, web manifest
```

All animations respect `prefers-reduced-motion`.

## Deploy

`dist/` is plain static files, so it works on Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host.
