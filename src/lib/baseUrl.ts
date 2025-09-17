import { headers } from 'next/headers';

/**
 * Build an absolute origin for server-side fetches.
 * Works locally and on Vercel (x-forwarded-*).
 */
export async function getBaseUrl() {
  const h = await headers(); // MUST await in Server Components/Route Handlers
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  if (!host) return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return `${proto}://${host}`;
}
