/**
 * SEO utility — central place for the public site URL.
 * Change the domain by updating VITE_PUBLIC_URL in .env
 */
export const SITE_URL =
  (import.meta as any).env?.VITE_PUBLIC_URL ||
  'https://tnstartupmaps.trackifyapp.co.in';

/** Build a canonical URL for a given path */
export const canonicalUrl = (path: string = '') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Default OG cover image */
export const OG_DEFAULT_IMAGE = `${SITE_URL}/og-cover.png`;
