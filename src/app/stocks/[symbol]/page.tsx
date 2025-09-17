import { getBaseUrl } from '@/lib/baseUrl';
import PriceChart from '@/components/Chart';
import { SignalsPanel } from '@/components/SignalsPanel';

async function getData(symbol: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/symbol/${symbol}/indicators`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const data = await getData(params.symbol);
  if (!data) return <div className="p-6">No data.</div>;
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{data.symbol}</h1>
      <PriceChart ohlc={data.ohlc} />
      <SignalsPanel data={data} />
    </main>
  );
}
