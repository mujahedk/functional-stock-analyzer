type Bias = 'Up'|'Neutral'|'Down';
type Confidence = 'Low'|'Medium'|'High';

export type ScoreInput = {
  price: number|null,
  sma20: number|null,
  sma50: number|null,
  sma200: number|null,
  rsi14: number|null,
  volZ: number|null,
  atrp: number|null,
  prior20High: number|null,
  highToday: number|null,
};

export function computeRuleScore(i: ScoreInput) {
  const reasons: string[] = [];
  let score = 0;
  let passes = 0;

  // Trend
  if (num(i.price) > num(i.sma20)) { score += 10; reasons.push('Price>SMA20'); passes++; }
  if (num(i.sma20) > num(i.sma50)) { score += 10; reasons.push('SMA20>SMA50'); passes++; }
  if (num(i.sma50) > num(i.sma200)) { score += 10; reasons.push('SMA50>SMA200'); passes++; }

  // Momentum
  const rsi = num(i.rsi14);
  if (!isNaN(rsi)) {
    if (rsi < 30) { score += 15; reasons.push('RSI oversold'); passes++; }
    else if (rsi <= 70) { score += 5; reasons.push('RSI neutral'); passes++; }
  }

  // Breakout
  if (num(i.highToday) > num(i.prior20High)) { score += 20; reasons.push('20d breakout'); passes++; }

  // Volume
  const vz = num(i.volZ);
  if (!isNaN(vz)) {
    if (vz >= 2) { score += 15; reasons.push(`Vol +${vz.toFixed(1)}σ`); passes += 2; } // bump confidence
    else if (vz >= 1) { score += 8; reasons.push(`Vol +${vz.toFixed(1)}σ`); passes++; }
  }

  // Volatility fit (2–6%)
  const atr = num(i.atrp);
  if (!isNaN(atr) && atr >= 2 && atr <= 6) { score += 10; reasons.push('ATR% in range'); passes++; }

  const bias: Bias = score >= 70 ? 'Up' : score >= 40 ? 'Neutral' : 'Down';
  const confidence: Confidence = passes >= 6 ? 'High' : passes >= 3 ? 'Medium' : 'Low';

  return { score, reasons, bias, confidence };
}

function num(x: number|null|undefined) {
  return typeof x === 'number' ? x : NaN;
}
