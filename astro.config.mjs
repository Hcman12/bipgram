// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';

// Astro doesn't expose .env to this config file, so load it here for `site`.
// Real environment variables (e.g. set on Netlify/Vercel) take priority over .env.
const mode = process.argv.includes('dev') ? 'development' : 'production';
const { PUBLIC_SITE_URL } = loadEnv(mode, process.cwd(), '');

// Built-in defaults so a fresh deploy (e.g. Vercel with no env vars set) still builds.
// Override either one in .env or in the host's "Environment Variables" settings.
const DEFAULT_SITE_URL = 'https://bipgram.com';
const DEFAULT_LAUNCH_DATE = '2027-03-01T18:00:00Z';

// https://astro.build/config
export default defineConfig({
  // Canonical + social-share URLs. Set PUBLIC_SITE_URL in .env / host settings.
  site: PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },

  /**
   * Type-safe environment variables (https://docs.astro.build/en/guides/environment-variables/).
   * Every value is validated when `astro dev` / `astro build` starts, so a missing or
   * malformed variable fails fast with a clear message instead of shipping a broken page.
   * Copy .env.example to .env and fill it in.
   */
  env: {
    schema: {
      // ── Core (defaults above; override per environment) ──────
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', url: true, default: DEFAULT_SITE_URL }),
      PUBLIC_LAUNCH_DATE: envField.string({ context: 'client', access: 'public', min: 10, default: DEFAULT_LAUNCH_DATE }),

      // ── Page content ─────────────────────────────────────────
      PUBLIC_BUILD_PROGRESS: envField.number({
        context: 'client',
        access: 'public',
        int: true,
        min: 0,
        max: 100,
        default: 78,
      }),
      PUBLIC_CONTACT_EMAIL: envField.string({
        context: 'client',
        access: 'public',
        includes: '@',
        default: 'hello@bipgram.com',
      }),

      // ── Waitlist ─────────────────────────────────────────────
      PUBLIC_WAITLIST_ENDPOINT: envField.string({ context: 'client', access: 'public', optional: true }),

      // ── Social links (leave empty to hide the icon) ──────────
      PUBLIC_INSTAGRAM_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_X_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_TIKTOK_URL: envField.string({ context: 'client', access: 'public', optional: true }),

      // ── Credit ───────────────────────────────────────────────
      PUBLIC_POWERED_BY_NAME: envField.string({
        context: 'client',
        access: 'public',
        default: 'All Things Web Technology Inc',
      }),
      PUBLIC_POWERED_BY_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        default: 'https://allthingswebtechnology.com',
      }),
    },
    validateSecrets: true,
  },
});
