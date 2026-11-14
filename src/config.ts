/**
 * Central site settings.
 *
 * Environment-specific values (domain, launch date, links, waitlist endpoint…) come from
 * `.env` via Astro's type-safe `astro:env` (schema in astro.config.mjs).
 * Brand copy that doesn't change per environment lives right here.
 */
import {
  PUBLIC_BUILD_PROGRESS,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_INSTAGRAM_URL,
  PUBLIC_LAUNCH_DATE,
  PUBLIC_POWERED_BY_NAME,
  PUBLIC_POWERED_BY_URL,
  PUBLIC_SITE_URL,
  PUBLIC_TIKTOK_URL,
  PUBLIC_WAITLIST_ENDPOINT,
  PUBLIC_X_URL,
} from 'astro:env/client';

const envError = (name: string, problem: string): Error =>
  new Error(`[.env] ${name} ${problem}. Fix it in .env (see .env.example for the expected format).`);

/** Optional http(s) URL: empty/blank means "not set". */
function optionalUrl(name: string, value: string | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw envError(name, `must be a full URL starting with https://, got "${raw}"`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw envError(name, `must use http(s), got "${raw}"`);
  }
  return url.href;
}

/** ISO 8601 date with an explicit timezone, e.g. 2027-03-01T18:00:00Z or 2027-03-01T19:00:00+01:00 */
function isoDate(name: string, value: string): string {
  const raw = value.trim();
  const hasTimezone = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(raw);
  if (!hasTimezone || Number.isNaN(Date.parse(raw))) {
    throw envError(name, `must be an ISO date with a timezone like 2027-03-01T18:00:00Z, got "${raw}"`);
  }
  return raw;
}

export type SocialIcon = 'instagram' | 'x' | 'tiktok';

export interface SocialLink {
  label: string;
  icon: SocialIcon;
  href: string;
}

const socialCandidates: Array<Omit<SocialLink, 'href'> & { href: string | undefined }> = [
  { label: 'Instagram', icon: 'instagram', href: optionalUrl('PUBLIC_INSTAGRAM_URL', PUBLIC_INSTAGRAM_URL) },
  { label: 'X', icon: 'x', href: optionalUrl('PUBLIC_X_URL', PUBLIC_X_URL) },
  { label: 'TikTok', icon: 'tiktok', href: optionalUrl('PUBLIC_TIKTOK_URL', PUBLIC_TIKTOK_URL) },
];

export const site = {
  name: 'Bipgram',
  tagline: 'Meet the stars. Up close.',
  description:
    'Bipgram is building the most exclusive way to meet celebrities — verified meet-and-greets, live fan sessions and once-in-a-lifetime moments. Join the waitlist for first access.',

  url: PUBLIC_SITE_URL,

  /** Launch date used by the countdown. */
  launchDate: isoDate('PUBLIC_LAUNCH_DATE', PUBLIC_LAUNCH_DATE),

  /** How "finished" the build looks on the progress bar (0–100). */
  buildProgress: PUBLIC_BUILD_PROGRESS,

  /**
   * Form endpoint that accepts a POST with JSON `{ email }` (Formspree, Getform, your own API…).
   * Undefined = demo mode: sign-ups are only kept in the visitor's browser.
   */
  waitlistEndpoint: optionalUrl('PUBLIC_WAITLIST_ENDPOINT', PUBLIC_WAITLIST_ENDPOINT),

  contactEmail: PUBLIC_CONTACT_EMAIL,

  /** Only links that are set in .env are shown. */
  socials: socialCandidates.filter((s): s is SocialLink => s.href !== undefined),

  poweredBy: {
    name: PUBLIC_POWERED_BY_NAME,
    url: PUBLIC_POWERED_BY_URL,
  },
};
