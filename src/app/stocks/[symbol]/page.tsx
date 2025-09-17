import PriceChart from '@/components/Chart';
import { SignalsPanel } from '@/components/SignalsPanel';
import { headers } from 'next/headers';

function baseUrl() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  if (!host) return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return `${proto}://${host}`;
}

async function getData(symbol:string) {
  const res = await fetch(`${baseUrl()}/api/symbol/${symbol}/indicators`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function StockPage({ params }:{ params:{ symbol:string }}) {
  const data = await getData(params.symbol);
  if (!data) return <div className="p-6">No data.</div>;
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{data.symbol}</h1>
      <PriceChart ohlc={data.ohlc} />
      <SignalsPanel data={data} />
      {/* TODO: add indicator overlays, projection dot, add-to-watchlist */}
    </main>
  );
}
