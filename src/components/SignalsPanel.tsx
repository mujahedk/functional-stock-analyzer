export function SignalsPanel({ data }:{ data:any }) {
  const rs = data?.rulescore;
  const ind = data?.indicators;
  return (
    <div className="text-sm space-y-1">
      <div>Bias: <b>{rs?.bias}</b> · Confidence: <b>{rs?.confidence}</b> · Score: <b>{rs?.score}</b></div>
      <div>RSI(14): {ind?.rsi14?.toFixed?.(1) ?? '—'}</div>
      <div>SMA20/50/200: {ind?.sma20?.toFixed?.(2) ?? '—'} / {ind?.sma50?.toFixed?.(2) ?? '—'} / {ind?.sma200?.toFixed?.(2) ?? '—'}</div>
      <div>ATR%: {ind?.atrp?.toFixed?.(2) ?? '—'} · Vol Z: {ind?.volZ?.toFixed?.(1) ?? '—'}</div>
      <div>Insight: {data?.insight}</div>
    </div>
  );
}
