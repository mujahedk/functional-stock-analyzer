'use client';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { TopScanItem } from '@/lib/types';

export function TopOpportunities({ items }: { items: TopScanItem[] }) {
  if (!items?.length) {
    return <div className="text-sm text-muted-foreground">No opportunities yet. Try reloading in a few seconds.</div>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((it) => {
        const s = it.rulescore;
        return (
          <Link href={`/stocks/${it.symbol}`} key={it.symbol} className="block">
            <Card className="p-4 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{it.symbol}</div>
                <Badge>{s?.bias ?? '—'}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Score: {s?.score ?? 0} · Confidence: {s?.confidence ?? '—'}
              </div>
              <div className="mt-2 text-sm">
                {s?.reasons?.slice(0,2).join(" · ") || it.insight}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export function SectionTitle({children}:{children:React.ReactNode}) {
  return <h2 className="text-xl font-bold mb-3">{children}</h2>;
}
