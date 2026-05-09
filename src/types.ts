export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  history: { time: string; price: number }[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  time: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgCost: number;
}
