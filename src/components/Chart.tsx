'use client';
import { useEffect, useRef } from 'react';
import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';

export default function PriceChart({ ohlc }:{ ohlc: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !ohlc?.length) return;
    const chart = createChart(ref.current, { height: 300 });
    const series: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries();
    series.setData(ohlc.map((d:any) => ({
      time: Math.floor(new Date(d.date).getTime()/1000) as UTCTimestamp,
      open: d.open, high: d.high, low: d.low, close: d.close
    })));
    const resize = () => chart.applyOptions({ width: ref.current!.clientWidth });
    resize(); window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); chart.remove(); };
  }, [ohlc]);

  return <div className="w-full" ref={ref} />;
}
