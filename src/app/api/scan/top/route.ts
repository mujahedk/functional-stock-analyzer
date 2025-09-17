import { NextResponse } from 'next/server';
import { UNIVERSE } from '@/lib/universe';

export const dynamic = 'force-dynamic'; // ensure fresh

export async function GET() {
  // NOTE: For Sprint 1 speed, call the indicators route per symbol (simple).
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''; // set in .env.local for local dev
  const results = await Promise.allSettled(
    UNIVERSE.map(async s => {
      const url = base ? `${base}/api/symbol/${encodeURIComponent(s)}/indicators` : `/api/symbol/${encodeURIComponent(s)}/indicators`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${s} failed`);
      const json = await res.json();
      return { symbol: s, ...json };
    })
  );

  const items = results
    .filter(r => r.status === 'fulfilled')
    .map((r: any) => r.value)
    .sort((a:any,b:any) => (b?.rulescore?.score ?? 0) - (a?.rulescore?.score ?? 0))
    .slice(0, 10);

  return NextResponse.json({ items, generatedAt: new Date().toISOString() });
}
