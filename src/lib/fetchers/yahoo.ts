import yf from '@/lib/yahooClient';            // ⬅️ use our wrapper
import type { Ohlc } from '@/lib/types';

/**
 * Fetch ~1 year of daily OHLC safely.
 * Yahoo's `historical()` requires either concrete period1/period2 dates or you must use `chart()` with a `range`.
 * We pass valid Date objects to avoid validation errors.
 */
export async function fetchDailyOHLC(symbol: string, days = 370): Promise<Ohlc[]> {
  const end = new Date(); // now
  const start = new Date();
  start.setDate(end.getDate() - days);

  // historical() maps to chart() internally now; passing real dates stays valid.
  const res = await yf.historical(symbol, { period1: start, period2: end, interval: '1d' });

  return (res ?? [])
    .filter(r => r && r.open != null && r.close != null && r.high != null && r.low != null)
    .map(r => ({
      date: (r.date ?? new Date()).toISOString(),
      open: r.open as number,
      high: r.high as number,
      low:  r.low as number,
      close: r.close as number,
      volume: (r.volume ?? 0) as number,
    }));
}

export async function fetchQuote(symbol: string) {
  try { return await yf.quote(symbol); } catch { return null; }
}
