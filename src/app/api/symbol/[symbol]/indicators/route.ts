import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyOHLC, fetchQuote } from '@/lib/fetchers/yahoo';
import { sma, rsi, atrp, volZ, priorHigh, linregForecast } from '@/lib/indicators';
import { computeRuleScore } from '@/lib/scoring';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: { symbol: string } }
) {
  try {
    const symbol = (context.params.symbol || '').toUpperCase();
    if (!symbol) {
      return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
    }

    const ohlc = await fetchDailyOHLC(symbol, 370);
    if (!ohlc?.length) {
      return NextResponse.json({ error: 'No data' }, { status: 404 });
    }

    const close = ohlc.map(o => o.close);
    const high  = ohlc.map(o => o.high);
    const low   = ohlc.map(o => o.low);
    const vol   = ohlc.map(o => o.volume ?? 0);
    const last  = ohlc.length - 1;

    const sma20 = sma(close, 20);
    const sma50 = sma(close, 50);
    const sma200 = sma(close, 200);
    const rsi14 = rsi(close, 14);
    const atrp14 = atrp(high, low, close, 14);
    const volZ20 = volZ(vol, 20);
    const prior20High = priorHigh(high, 20);
    const forecast = linregForecast(close, 20);

    const rulescore = computeRuleScore({
      price: close[last] ?? null,
      sma20: sma20[last] ?? null,
      sma50: sma50[last] ?? null,
      sma200: sma200[last] ?? null,
      rsi14: rsi14[last] ?? null,
      volZ: volZ20[last] ?? null,
      atrp: atrp14[last] ?? null,
      prior20High: prior20High[last] ?? null,
      highToday: high[last] ?? null,
    });

    const quote = await fetchQuote(symbol);
    const insight = buildInsight(symbol, rulescore.reasons, rulescore.bias, rulescore.confidence);

    return NextResponse.json({
      symbol,
      lastUpdated: new Date().toISOString(),
      quote: { price: (quote?.regularMarketPrice as number) ?? close[last] ?? null },
      ohlc,
      indicators: {
        sma20: sma20[last] ?? null,
        sma50: sma50[last] ?? null,
        sma200: sma200[last] ?? null,
        rsi14: rsi14[last] ?? null,
        atrp: atrp14[last] ?? null,
        volZ: volZ20[last] ?? null,
        prior20High: prior20High[last] ?? null,
      },
      rulescore,
      projection: forecast ? { next: forecast.next } : null,
      insight,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function buildInsight(symbol: string, reasons: string[], bias: string, confidence: string) {
  const top = reasons.slice(0, 2).join(', ');
  return `${symbol}: ${top ? top + ' — ' : ''}Bias: ${bias}, Confidence: ${confidence}. (Educational, not advice.)`;
}