import { TopOpportunities, SectionTitle } from '@/components/DashboardCards';

async function getTop() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const res = await fetch(`${base}/api/scan/top`, { cache: 'no-store' });
  if (!res.ok) return { items: [] };
  return res.json();
}

export default async function Page() {
  const top = await getTop();
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Functional Stock Analyzer</h1>
      <SectionTitle>Top Opportunities (Today)</SectionTitle>
      <TopOpportunities items={top.items ?? []} />
      {/* TODO: Volatility Watch + Heatmap sections */}
    </main>
  );
}