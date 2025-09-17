import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyOHLC, fetchQuote } from '@/lib/fetchers/yahoo';
import { sma, rsi, atrp, volZ, priorHigh, linregForecast } from '@/lib/indicators';
import { computeRuleScore } from '@/lib/scoring';

export async function GET(req: NextRequest, { params }: { params: { symbol: string }}) {
  const symbol = params.symbol.toUpperCase();
  const ohlc = await fetchDailyOHLC(symbol);
  if (!ohlc?.length) return NextResponse.json({ error: 'No data' }, { status: 404 });

  const close = ohlc.map(o => o.close);
  const high = ohlc.map(o => o.high);
  const low  = ohlc.map(o => o.low);
  const vol  = ohlc.map(o => o.volume);

  const sma20 = sma(close, 20);
  const sma50 = sma(close, 50);
  const sma200 = sma(close, 200);
  const rsi14 = rsi(close, 14);
  const atrp14 = atrp(high, low, close, 14);
  const volZ20 = volZ(vol, 20);
  const prior20High = priorHigh(high, 20);
  const forecast = linregForecast(close, 20);

  const last = ohlc.length - 1;
  const score = computeRuleScore({
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

  const insight = buildInsight(symbol, score.reasons, score.bias, score.confidence);

  const quote = await fetchQuote(symbol);
  return NextResponse.json({
    symbol,
    lastUpdated: new Date().toISOString(),
    quote: { price: quote?.regularMarketPrice ?? close[last] },
    ohlc,
    indicators: {
      sma20: sma20[last] ?? null, sma50: sma50[last] ?? null, sma200: sma200[last] ?? null,
      rsi14: rsi14[last] ?? null, atrp: atrp14[last] ?? null, volZ: volZ20[last] ?? null,
      prior20High: prior20High[last] ?? null,
    },
    rulescore: score,
    projection: forecast ? { next: forecast.next } : null,
    insight,
  });
}

function buildInsight(symbol: string, reasons: string[], bias: string, confidence: string) {
  const top = reasons.slice(0, 2).join(', ');
  return `${symbol}: ${top ? top + ' — ' : ''}Bias: ${bias}, Confidence: ${confidence}. (Educational, not advice.)`;
}
