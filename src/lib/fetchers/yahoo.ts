import yf from 'yahoo-finance2';

export type Ohlc = { date: string; open:number; high:number; low:number; close:number; volume:number };

export async function fetchDailyOHLC(symbol: string, period = '1y'): Promise<Ohlc[]> {
  // TODO: allow custom range; for MVP use 1y daily
  const res = await yf.historical(symbol, { period1: undefined, period2: undefined, interval: '1d' });
  return res.map(r => ({
    date: (r.date ?? new Date()).toISOString(),
    open: r.open ?? 0, high: r.high ?? 0, low: r.low ?? 0, close: r.close ?? 0, volume: r.volume ?? 0
  }));
}

export async function fetchQuote(symbol: string) {
  try { return await yf.quote(symbol); } catch { return null; }
}
