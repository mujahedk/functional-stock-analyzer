// src/lib/types.ts
export type Bias = 'Up' | 'Neutral' | 'Down';
export type Confidence = 'Low' | 'Medium' | 'High';

export type RuleScore = {
  score: number;
  reasons: string[];
  bias: Bias;
  confidence: Confidence;
};

export type Quote = { price: number | null };

export type Ohlc = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type IndicatorsSnapshot = {
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  rsi14: number | null;
  atrp: number | null;
  volZ: number | null;
  prior20High: number | null;
};

export type SymbolIndicatorsResponse = {
  symbol: string;
  lastUpdated: string;
  quote: Quote;
  ohlc: Ohlc[];
  indicators: IndicatorsSnapshot;
  rulescore: RuleScore;
  projection: { next: number } | null;
  insight: string;
};

export type TopScanItem = {
  symbol: string;
  quote?: Quote;
  rulescore: RuleScore;
  insight: string;
};
