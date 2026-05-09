import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Bell, 
  Settings, 
  PieChart, 
  Activity, 
  Clock, 
  Globe, 
  Zap,
  LayoutDashboard,
  Wallet,
  Newspaper,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Palette,
  Moon,
  Sun,
  Pencil,
  Type,
  Eraser,
  MousePointer2,
  Square,
  Circle as CircleIcon,
  Download,
  RefreshCw,
  Coins,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  ReferenceDot,
  ReferenceArea,
  Brush
} from 'recharts';

const RefArea = ReferenceArea as any;
const RefDot = ReferenceDot as any;
const RefLine = ReferenceLine as any;
import { formatCurrency, formatCompactNumber, cn } from '@/src/lib/utils';
import { StockData, NewsItem } from '@/src/types';
import { getFundamentalAnalysis, getMarketNewsAnalysis } from '@/src/services/gemini';

// --- MOCK DATA GENERATOR ---
const INITIAL_STOCKS: StockData[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    high: 882.10,
    low: 865.00,
    volume: 45200000,
    marketCap: 2190000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 850 + Math.random() * 50 }))
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 172.62,
    change: -1.24,
    changePercent: -0.71,
    high: 174.50,
    low: 171.80,
    volume: 38500000,
    marketCap: 2670000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 170 + Math.random() * 10 }))
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.10,
    change: 2.85,
    changePercent: 0.69,
    high: 418.00,
    low: 412.50,
    volume: 18200000,
    marketCap: 3080000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 400 + Math.random() * 20 }))
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 162.50,
    change: -4.32,
    changePercent: -2.59,
    high: 168.00,
    low: 160.50,
    volume: 92000000,
    marketCap: 518000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 155 + Math.random() * 15 }))
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 154.23,
    change: 2.15,
    changePercent: 1.41,
    high: 156.10,
    low: 153.80,
    volume: 22400000,
    marketCap: 1910000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 150 + Math.random() * 8 }))
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 180.12,
    change: 1.05,
    changePercent: 0.59,
    high: 182.40,
    low: 179.30,
    volume: 31200000,
    marketCap: 1870000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 175 + Math.random() * 10 }))
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 495.30,
    change: 8.42,
    changePercent: 1.73,
    high: 498.20,
    low: 488.50,
    volume: 14700000,
    marketCap: 1260000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 480 + Math.random() * 25 }))
  },
  {
    symbol: 'BRK.B',
    name: 'Berkshire Hathaway Inc.',
    price: 405.15,
    change: -0.85,
    changePercent: -0.21,
    high: 408.30,
    low: 404.20,
    volume: 2800000,
    marketCap: 875000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 400 + Math.random() * 10 }))
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    price: 760.45,
    change: 15.20,
    changePercent: 2.04,
    high: 765.00,
    low: 748.10,
    volume: 3100000,
    marketCap: 720000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 740 + Math.random() * 30 }))
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    price: 1320.50,
    change: 22.10,
    changePercent: 1.70,
    high: 1335.00,
    low: 1305.20,
    volume: 2400000,
    marketCap: 615000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 1280 + Math.random() * 60 }))
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 198.35,
    change: 1.12,
    changePercent: 0.57,
    high: 200.10,
    low: 197.40,
    volume: 8500000,
    marketCap: 568000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 195 + Math.random() * 8 }))
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    price: 285.90,
    change: -1.45,
    changePercent: -0.50,
    high: 288.20,
    low: 284.50,
    volume: 6200000,
    marketCap: 585000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 282 + Math.random() * 10 }))
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group',
    price: 490.12,
    change: -5.40,
    changePercent: -1.09,
    high: 498.50,
    low: 488.20,
    volume: 3800000,
    marketCap: 452000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 485 + Math.random() * 20 }))
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale Corp.',
    price: 735.60,
    change: 3.15,
    changePercent: 0.43,
    high: 739.40,
    low: 730.20,
    volume: 1900000,
    marketCap: 326000000000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 725 + Math.random() * 20 }))
  }
];

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "NVIDIA Hits New Record High as AI Demand Soars",
    summary: "NVIDIA shares surged today after reporting better-than-expected demand for its next-generation H200 AI GPUs.",
    source: "Bloomberg",
    url: "#",
    time: "2h ago",
    sentiment: "positive"
  },
  {
    id: '2',
    title: "Federal Reserve Hints at 'Higher for Longer' Interest Rates",
    summary: "Minutes from the latest FOMC meeting suggest that inflation remains above target, leading to potential rate holds.",
    source: "CNBC",
    url: "#",
    time: "4h ago",
    sentiment: "neutral"
  },
  {
    id: '3',
    title: "Tech Giants Face New Regulatory Hurdles in EU",
    summary: "The European Commission has opened investigations into major tech platforms regarding compliance with the DMA.",
    source: "Reuters",
    url: "#",
    time: "6h ago",
    sentiment: "negative"
  }
];

// --- COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-sm font-medium",
      active 
        ? "bg-brand-500/10 text-brand-400 border-l-2 border-brand-500" 
        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const PriceTicker = ({ value, change, currency, exchangeRates }: { value: number, change: number, currency: string, exchangeRates: any }) => {
  const isPositive = change >= 0;
  const rate = currency === 'USD' ? 1 : exchangeRates[currency];
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-white tracking-tight">{formatCurrency(value * rate, currency)}</span>
      <div className={cn(
        "flex items-center text-xs px-1.5 py-0.5 rounded",
        isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
      )}>
        {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
        {Math.abs(change).toFixed(2)}%
      </div>
    </div>
  );
};

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<StockData>(INITIAL_STOCKS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('1D');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({ EUR: 0.92, GBP: 0.79, JPY: 151.2, BTC: 0.000015 });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates) {
          setExchangeRates(prev => ({
            ...prev,
            EUR: data.rates.EUR || prev.EUR,
            GBP: data.rates.GBP || prev.GBP,
            JPY: data.rates.JPY || prev.JPY,
          }));
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
    // Refresh every 30 minutes
    const interval = setInterval(fetchRates, 1800000);
    return () => clearInterval(interval);
  }, []);

  const [theme, setTheme] = useState('theme-emerald'); // Default theme
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const [newsSummary, setNewsSummary] = useState<string>('');
  const [isSummarizingNews, setIsSummarizingNews] = useState(false);
  const [isAmoled, setIsAmoled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stockpulse-amoled') === 'true';
    }
    return false;
  });

  // Chart Interaction States
  const [drawingMode, setDrawingMode] = useState<null | 'trendline' | 'annotate' | 'rect' | 'circle'>(null);
  const [drawingColor, setDrawingColor] = useState('#10b981'); // Default emerald
  const [trendlines, setTrendlines] = useState<{ id: string, start: any, end: any, color: string }[]>([]);
  const [annotations, setAnnotations] = useState<{ id: string, point: any, text: string }[]>([]);
  const [rects, setRects] = useState<{ id: string, start: any, end: any, color: string }[]>([]);
  const [circles, setCircles] = useState<{ id: string, center: any, radius: number, color: string }[]>([]);
  const [tempShape, setTempShape] = useState<any>(null);
  const [zoomRange, setZoomRange] = useState<[number, number] | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStartX, setPanStartX] = useState<number | null>(null);

  // Currency Converter State
  const [converterAmount, setConverterAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [converterResult, setConverterResult] = useState<number | null>(null);

  useEffect(() => {
    const amount = parseFloat(converterAmount);
    if (isNaN(amount)) {
      setConverterResult(null);
      return;
    }

    const rates = { USD: 1, ...exchangeRates } as any;
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (fromRate && toRate) {
      // Conversion: (Amount / fromRate) * toRate
      // Our exchangeRates are USD based (1 USD = X Currency)
      const result = (amount / fromRate) * toRate;
      setConverterResult(result);
    }
  }, [converterAmount, fromCurrency, toCurrency, exchangeRates]);

  // Persist Amoled state
  useEffect(() => {
    localStorage.setItem('stockpulse-amoled', isAmoled.toString());
  }, [isAmoled]);

  const handleChartInteraction = (e: any) => {
    if (!drawingMode) {
      // Start panning if zoomed in
      if (zoomRange && e.activeTooltipIndex !== undefined) {
        setIsPanning(true);
        setPanStartX(e.activeTooltipIndex);
      }
      return;
    }
    
    let point = null;
    if (e.activePayload && e.activePayload.length > 0) {
      point = e.activePayload[0].payload;
    } else if (e.activeTooltipIndex !== undefined) {
      const data = selectedStock.history.map(h => ({
        ...h,
        price: h.price * (currency === 'USD' ? 1 : (exchangeRates as any)[currency])
      }));
      point = data[e.activeTooltipIndex];
    }

    if (!point) return;

    if (drawingMode === 'trendline' || drawingMode === 'rect') {
      if (!tempShape || !tempShape.start) {
        setTempShape({ start: point, end: point });
      } else {
        if (drawingMode === 'trendline') {
          setTrendlines([...trendlines, { id: Math.random().toString(), start: tempShape.start, end: point, color: drawingColor }]);
        } else {
          setRects([...rects, { id: Math.random().toString(), start: tempShape.start, end: point, color: drawingColor }]);
        }
        setTempShape(null);
        setDrawingMode(null);
      }
    } else if (drawingMode === 'circle') {
      if (!tempShape || !tempShape.center) {
        setTempShape({ center: point, radius: 20 }); // Initial radius
      } else {
        setCircles([...circles, { id: Math.random().toString(), center: tempShape.center, radius: tempShape.radius || 20, color: drawingColor }]);
        setTempShape(null);
        setDrawingMode(null);
      }
    } else if (drawingMode === 'annotate') {
      const text = prompt("Enter annotation text:");
      if (text) {
        setAnnotations([...annotations, { id: Math.random().toString(), point, text }]);
      }
      setDrawingMode(null);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isPanning && panStartX !== null && e.activeTooltipIndex !== undefined && zoomRange) {
      const delta = panStartX - e.activeTooltipIndex;
      if (delta !== 0) {
        const totalLength = selectedStock.history.length;
        const currentStart = zoomRange[0];
        const currentEnd = zoomRange[1];
        const range = currentEnd - currentStart;
        
        let newStart = currentStart + delta;
        let newEnd = currentEnd + delta;
        
        // Clamp to boundaries
        if (newStart < 0) {
          newStart = 0;
          newEnd = range;
        } else if (newEnd >= totalLength) {
          newEnd = totalLength - 1;
          newStart = newEnd - range;
        }
        
        setZoomRange([newStart, newEnd]);
        setPanStartX(e.activeTooltipIndex);
      }
      return;
    }

    if (!drawingMode || !tempShape || e.activeTooltipIndex === undefined) return;
    
    let point = null;
    if (e.activePayload && e.activePayload.length > 0) {
      point = e.activePayload[0].payload;
    } else {
      const data = selectedStock.history.map(h => ({
        ...h,
        price: h.price * (currency === 'USD' ? 1 : (exchangeRates as any)[currency])
      }));
      point = data[e.activeTooltipIndex];
    }

    if (!point) return;

    if (drawingMode === 'trendline' || drawingMode === 'rect') {
      setTempShape({ ...tempShape, end: point });
    } else if (drawingMode === 'circle' && tempShape.center) {
      // Calculate a rough radius based on index difference for simplicity in time-series
      const centerIndex = selectedStock.history.findIndex(h => h.time === tempShape.center.time);
      if (centerIndex !== -1) {
        const dx = Math.abs(e.activeTooltipIndex - centerIndex);
        setTempShape({ ...tempShape, radius: Math.max(5, dx * 8) }); // arbitrary scaling, min 5px
      }
    }
  };

  const handleWheel = (e: any) => {
    if (drawingMode) return;
    
    const delta = e.deltaY;
    const history = selectedStock.history;
    const totalLength = history.length;
    
    const currentStart = zoomRange ? zoomRange[0] : 0;
    const currentEnd = zoomRange ? zoomRange[1] : totalLength - 1;
    const currentRange = currentEnd - currentStart;
    
    // Zoom factor: roughly 10% of visible range, minimum 1 step
    const zoomFactor = Math.max(1, Math.ceil(currentRange * 0.1));
    
    let newStart, newEnd;
    if (delta < 0) {
      // Zoom in
      newStart = Math.min(currentEnd - 2, currentStart + zoomFactor);
      newEnd = Math.max(currentStart + 2, currentEnd - zoomFactor);
    } else {
      // Zoom out
      newStart = Math.max(0, currentStart - zoomFactor);
      newEnd = Math.min(totalLength - 1, currentEnd + zoomFactor);
    }
    
    // If we've reached full size, reset zoomRange
    if (newStart <= 0 && newEnd >= totalLength - 1) {
      setZoomRange(null);
    } else {
      setZoomRange([newStart, newEnd]);
    }
  };

  const clearDrawing = () => {
    setTrendlines([]);
    setAnnotations([]);
    setRects([]);
    setCircles([]);
    setDrawingMode(null);
    setTempShape(null);
  };

  const handleBrushChange = (range: any) => {
    if (range && (range.startIndex !== undefined && range.endIndex !== undefined)) {
      setZoomRange([range.startIndex, range.endIndex]);
    }
  };

  const handleZoomReset = () => {
    setZoomRange(null);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    // Extract headers from the first object keys
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));
    
    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPortfolio = () => {
    const portfolioData = stocks.map(stock => {
      const shares = stock.symbol === 'NVDA' ? 10 : stock.symbol === 'AAPL' ? 50 : stock.symbol === 'MSFT' ? 25 : 100;
      const rate = currency === 'USD' ? 1 : (exchangeRates as any)[currency];
      const avgCost = stock.price * 0.9;
      
      return {
        Symbol: stock.symbol,
        Name: stock.name,
        Shares: shares,
        AvgCost: (avgCost * rate).toFixed(2),
        CurrentPrice: (stock.price * rate).toFixed(2),
        MarketValue: (stock.price * shares * rate).toFixed(2),
        PnL: ((stock.price - avgCost) * shares * rate).toFixed(2),
        Currency: currency
      };
    });
    exportToCSV(portfolioData, 'portfolio_holdings');
  };

  const handleExportMarkets = () => {
    const rate = currency === 'USD' ? 1 : (exchangeRates as any)[currency];
    const marketData = stocks.map(stock => ({
      Symbol: stock.symbol,
      Name: stock.name,
      Price: (stock.price * rate).toFixed(2),
      Change: stock.changePercent.toFixed(2) + '%',
      Currency: currency
    }));
    exportToCSV(marketData, 'market_data');
  };

  const handleSummarizeNews = async () => {
    if (isSummarizingNews) return;
    setIsSummarizingNews(true);
    const summaries = MOCK_NEWS.map(n => `${n.title}: ${n.summary}`);
    const result = await getMarketNewsAnalysis(summaries);
    setNewsSummary(result);
    setIsSummarizingNews(false);
  };

  const [alerts, setAlerts] = useState<{ id: string, symbol: string, target: number, condition: 'above' | 'below' }[]>([
    { id: '1', symbol: 'NVDA', target: 900, condition: 'above' }
  ]);

  const [notifications, setNotifications] = useState<{ id: string, symbol: string, message: string, type: 'success' | 'error' | 'info' }[]>([]);
  const [triggeredIds, setTriggeredIds] = useState<Set<string>>(new Set());

  // Alert Checking logic
  useEffect(() => {
    stocks.forEach(stock => {
      alerts.forEach(alert => {
        if (alert.symbol === stock.symbol) {
          const isAbove = alert.condition === 'above';
          const triggered = isAbove ? stock.price > alert.target : stock.price < alert.target;
          
          const alertKey = `${alert.id}-${triggered}`;
          if (triggered && !triggeredIds.has(alertKey)) {
            const notification = {
              id: Math.random().toString(),
              symbol: stock.symbol,
              message: `${stock.symbol} is now ${isAbove ? 'above' : 'below'} ${formatCurrency(alert.target, 'USD')}!`,
              type: isAbove ? 'success' : 'error' as const
            };
            setNotifications(prev => [notification, ...prev]);
            setTriggeredIds(prev => new Set(prev).add(alertKey));
            
            // Auto-remove notification after 5 seconds
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 5000);
          } else if (!triggered && triggeredIds.has(alertKey)) {
            // Reset trigger status if it moves back across the threshold
            setTriggeredIds(prev => {
              const next = new Set(prev);
              next.delete(alertKey);
              return next;
            });
          }
        }
      });
    });
  }, [stocks, alerts, triggeredIds]);

  const addAlert = () => {
    const target = selectedStock.price * 1.05;
    setAlerts([...alerts, { 
      id: Math.random().toString(), 
      symbol: selectedStock.symbol, 
      target: Number(target.toFixed(2)), 
      condition: 'above' 
    }]);
  };

  // AI Analysis Effect
  useEffect(() => {
    async function fetchAnalysis() {
      setIsAnalyzing(true);
      const analysis = await getFundamentalAnalysis(selectedStock.symbol, selectedStock.name);
      setAiAnalysis(analysis || '');
      setIsAnalyzing(false);
    }
    fetchAnalysis();
  }, [selectedStock.symbol]);

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(current => current.map(stock => {
        const drift = (Math.random() - 0.5) * 0.5;
        const newPrice = stock.price + drift;
        return {
          ...stock,
          price: newPrice,
          changePercent: stock.changePercent + (drift / stock.price) * 100
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updated = stocks.find(s => s.symbol === selectedStock.symbol);
    if (updated) setSelectedStock(updated);
  }, [stocks]);

  return (
    <div className={cn(
      "flex h-screen bg-bg-deep overflow-hidden", 
      theme,
      isAmoled && "theme-amoled"
    )}>
      {/* Real-time Notifications */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl",
                n.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg",
                n.type === 'success' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              )}>
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-100">Price Alert: {n.symbol}</span>
                  <button 
                    onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-300 leading-tight">
                  {n.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-bg-card border-r border-border-subtle transition-transform duration-300 lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center neon-glow">
              <Zap className="text-white" fill="white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">StockPulse</h1>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={PieChart} label="Portfolio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
            <NavItem icon={Activity} label="Markets" active={activeTab === 'markets'} onClick={() => setActiveTab('markets')} />
            <NavItem icon={TrendingUp} label="Backtesting" active={activeTab === 'backtesting'} onClick={() => setActiveTab('backtesting')} />
            <NavItem icon={Coins} label="Converter" active={activeTab === 'converter'} onClick={() => setActiveTab('converter')} />
            <NavItem icon={ShieldCheck} label="Risk Analysis" active={activeTab === 'risk'} onClick={() => setActiveTab('risk')} />
          </nav>

          <div className="pt-4 mt-4 border-t border-border-subtle">
            <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Watchlist</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {stocks.map(stock => {
                const rate = currency === 'USD' ? 1 : (exchangeRates as any)[currency];
                return (
                  <button 
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-lg transition-colors",
                      selectedStock.symbol === stock.symbol ? "bg-white/5" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-slate-100 text-sm leading-none">{stock.symbol}</span>
                      <span className="text-[10px] text-slate-500 mt-1">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-100">
                        {formatCurrency(stock.price * rate, currency)}
                      </div>
                      <div className={cn(
                        "text-[10px]",
                        stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border-subtle">
            <div className="px-4 mb-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Palette size={12} /> Dashboard Theme
              </h3>
              <div className="flex gap-2">
                {[
                  { name: 'emerald', class: 'theme-emerald', color: 'bg-emerald-500' },
                  { name: 'mint', class: 'theme-mint', color: 'bg-teal-400' },
                  { name: 'lime', class: 'theme-lime', color: 'bg-lime-400' },
                  { name: 'cyber', class: 'theme-cyber', color: 'bg-cyan-400' }
                ].map(t => (
                  <button 
                    key={t.name}
                    onClick={() => setTheme(t.class)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                      t.color,
                      theme === t.class ? "border-white" : "border-transparent"
                    )}
                  />
                ))}
              </div>
            </div>
            <NavItem icon={Settings} label="Settings" />
            <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-bg-alt border border-border-subtle">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                AA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">Abdu L.</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Pro Member</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <header className="sticky top-0 z-40 bg-bg-deep/80 backdrop-blur-md border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-slate-400 p-2 hover:bg-white/5 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-lg w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search stocks, news, or sectors..." 
                className="w-full bg-bg-alt border border-border-subtle rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-bg-alt p-1 rounded-xl border border-border-subtle items-center gap-1">
              <Globe size={14} className="ml-2 text-slate-500" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border-none text-[10px] uppercase font-black text-slate-300 rounded p-1.5 outline-none cursor-pointer hover:text-brand-400 transition-colors"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <button 
              onClick={() => setIsAmoled(!isAmoled)}
              className="p-2 text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2 text-xs font-bold border-l border-border-subtle pl-4"
              title={isAmoled ? "Disable Night Vision" : "Enable Night Vision"}
            >
              {isAmoled ? <Sun size={18} /> : <Moon size={18} />}
              <span className="hidden sm:inline uppercase tracking-tighter">Night Vision</span>
            </button>
            <div className="hidden border-r border-border-subtle pr-4 md:flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-bold">SPX 500</span>
                <span className="text-sm font-bold text-emerald-400">5,137.08 (+0.82%)</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-bold">BTC/USD</span>
                <span className="text-sm font-bold text-rose-400">67,422.50 (-1.15%)</span>
              </div>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-bg-deep"></span>
            </button>
            <button className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-600 transition-all neon-glow">
              Trade Now
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'portfolio' && (
              <motion.div 
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 block">Total Invested</span>
                    <div className="text-2xl font-black text-white">{formatCurrency(38500 * (currency === 'USD' ? 1 : (exchangeRates as any)[currency]), currency)}</div>
                  </div>
                  <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 block">All-Time Profit</span>
                    <div className="text-2xl font-black text-emerald-400">+{formatCurrency(4404.50 * (currency === 'USD' ? 1 : (exchangeRates as any)[currency]), currency)}</div>
                    <span className="text-[10px] text-emerald-500 font-bold">+12.4% yield</span>
                  </div>
                  <div className="glass-panel p-6">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 block">Day Change</span>
                    <div className="text-2xl font-black text-rose-400">-{formatCurrency(124.20 * (currency === 'USD' ? 1 : (exchangeRates as any)[currency]), currency)}</div>
                    <span className="text-[10px] text-rose-500 font-bold">-0.32% today</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 glass-panel p-0 overflow-hidden">
                    <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                      <h3 className="font-bold text-white">Current Holdings</h3>
                      <button 
                        onClick={handleExportPortfolio}
                        className="text-xs text-brand-400 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Download size={14} />
                        EXPORT CSV
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-bg-alt/30">
                            <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Asset</th>
                            <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Avg Cost</th>
                            <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Total Shares</th>
                            <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Market Value</th>
                            <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Unrealized P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stocks.map(stock => {
                            const shares = stock.symbol === 'NVDA' ? 10 : stock.symbol === 'AAPL' ? 50 : stock.symbol === 'MSFT' ? 25 : 100;
                            const avgCost = stock.price * 0.9;
                            const marketValue = stock.price * shares;
                            const pnl = (stock.price - avgCost) * shares;
                            const rate = currency === 'USD' ? 1 : (exchangeRates as any)[currency];
                            
                            return (
                              <tr key={stock.symbol} className="border-t border-border-subtle hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-100">{stock.symbol}</span>
                                    <span className="text-[10px] text-slate-500">{stock.name}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-sm font-medium text-slate-300">{formatCurrency(avgCost * rate, currency)}</td>
                                <td className="p-4 text-sm font-medium text-slate-300">{shares}</td>
                                <td className="p-4 text-sm font-bold text-slate-100">{formatCurrency(marketValue * rate, currency)}</td>
                                <td className={cn(
                                  "p-4 text-sm font-bold",
                                  pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                                )}>
                                  {pnl >= 0 ? '+' : ''}{formatCurrency(pnl * rate, currency)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-panel p-6">
                      <h3 className="font-bold text-white mb-6">Sector Exposure</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Technology', value: 65, color: 'bg-emerald-500' },
                          { label: 'Consumer Cyclical', value: 20, color: 'bg-cyan-500' },
                          { label: 'Financial Services', value: 10, color: 'bg-amber-500' },
                          { label: 'Energy', value: 5, color: 'bg-rose-500' }
                        ].map(sector => (
                          <div key={sector.label}>
                            <div className="flex justify-between text-[10px] font-bold mb-1.5">
                              <span className="text-slate-400 uppercase">{sector.label}</span>
                              <span className="text-slate-200">{sector.value}%</span>
                            </div>
                            <div className="h-1.5 bg-bg-alt rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${sector.value}%` }}
                                className={cn("h-full rounded-full", sector.color)} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 bg-gradient-to-br from-brand-600/20 to-transparent border-brand-500/20">
                      <Activity className="text-brand-400 mb-4" size={24} />
                      <h3 className="font-bold text-white mb-2">Rebalance Suggested</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your technology exposure is 15% higher than your target allocation. 
                        Consider rotating capital into defensive sectors like Energy or Healthcare.
                      </p>
                      <button className="mt-4 w-full py-2 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-colors">
                        Auto-Rebalance
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'markets' && (
              <motion.div 
                key="markets"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
                   <div>
                     <h2 className="text-xl font-bold text-white">Market Intelligence</h2>
                     <p className="text-xs text-slate-500">Real-time data across major indices and asset classes.</p>
                   </div>
                   <div className="flex gap-2 p-1 bg-bg-alt rounded-xl border border-border-subtle">
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-500 text-white">Stocks</button>
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300">Crypto</button>
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300">Forex</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: "DOW JONES", value: "38,904.04", change: "+0.15%", pos: true },
                    { label: "S&P 500", value: "5,137.08", change: "+0.82%", pos: true },
                    { label: "NASDAQ", value: "16,274.94", change: "+1.14%", pos: true },
                    { label: "VIX", value: "13.11", change: "-2.45%", pos: false },
                  ].map((idx, i) => (
                    <div key={i} className="glass-panel p-4 flex justify-between items-center bg-bg-alt/30">
                       <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{idx.label}</span>
                          <span className="text-lg font-black text-slate-100">{idx.value}</span>
                       </div>
                       <span className={cn(
                         "text-xs font-bold px-2 py-1 rounded",
                         idx.pos ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"
                       )}>
                         {idx.change}
                       </span>
                    </div>
                  ))}
                </div>

                <div className="glass-panel p-0 overflow-hidden">
                  <div className="p-6 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                       <button className="text-sm font-bold text-brand-400 border-b-2 border-brand-500 pb-1">Top Gainers</button>
                       <button className="text-sm font-bold text-slate-500 hover:text-slate-300 pb-1">Top Losers</button>
                       <button className="text-sm font-bold text-slate-500 hover:text-slate-300 pb-1">High Volume</button>
                    </div>
                    <div className="relative flex items-center gap-2">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Filter markets..." 
                          className="bg-bg-card border border-border-subtle rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                      <button 
                        onClick={handleExportMarkets}
                        className="p-2 bg-bg-alt border border-border-subtle rounded-lg text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-all"
                        title="Export CSV"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-bg-alt/30">
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Symbol</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Name</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Price</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Change</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-center w-32">Market Trend</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map(stock => {
                          const rate = currency === 'USD' ? 1 : (exchangeRates as any)[currency];
                          return (
                            <tr key={stock.symbol} className="border-t border-border-subtle hover:bg-white/5 transition-colors cursor-pointer" onClick={() => { setSelectedStock(stock); setActiveTab('dashboard'); }}>
                              <td className="p-4 font-bold text-brand-400">{stock.symbol}</td>
                              <td className="p-4 text-sm text-slate-300">{stock.name}</td>
                              <td className="p-4 text-sm font-bold text-white text-right">{formatCurrency(stock.price * rate, currency)}</td>
                              <td className={cn(
                                "p-4 text-xs font-bold text-right",
                                stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                              )}>
                                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </td>
                              <td className="p-4 text-center">
                                <div className="h-6 w-24 mx-auto">
                                   <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={stock.history}>
                                        <Area 
                                          type="monotone" 
                                          dataKey="price" 
                                          stroke={stock.changePercent >= 0 ? "#10b981" : "#f43f5e"} 
                                          fill={stock.changePercent >= 0 ? "#10b981" : "#f43f5e"} 
                                          fillOpacity={0.2} 
                                          strokeWidth={1.5}
                                        />
                                      </AreaChart>
                                   </ResponsiveContainer>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                                   <ChevronRight size={16} />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Left: Interactive Chart Container */}
                  <div className="xl:col-span-3 space-y-6">
                    <div className="glass-panel p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                        <div>
                          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            {selectedStock.name} 
                            <span className="text-slate-500 text-lg font-medium">{selectedStock.symbol}</span>
                          </h2>
                          <div className="mt-2">
                             <PriceTicker 
                               value={selectedStock.price} 
                               change={selectedStock.changePercent} 
                               currency={currency}
                               exchangeRates={exchangeRates}
                             />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Drawing Tools */}
                          <div className="flex bg-bg-alt p-1 rounded-xl border border-border-subtle mr-2 shadow-inner items-center gap-1">
                            <button 
                              onClick={() => setDrawingMode(drawingMode === 'trendline' ? null : 'trendline')}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                drawingMode === 'trendline' ? "bg-brand-500 text-white" : "text-slate-500 hover:text-slate-300"
                              )}
                              title="Trendline Tool"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => setDrawingMode(drawingMode === 'rect' ? null : 'rect')}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                drawingMode === 'rect' ? "bg-brand-500 text-white" : "text-slate-500 hover:text-slate-300"
                              )}
                              title="Rectangle Tool"
                            >
                              <Square size={16} />
                            </button>
                            <button 
                              onClick={() => setDrawingMode(drawingMode === 'circle' ? null : 'circle')}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                drawingMode === 'circle' ? "bg-brand-500 text-white" : "text-slate-500 hover:text-slate-300"
                              )}
                              title="Circle Tool"
                            >
                              <CircleIcon size={16} />
                            </button>
                            <button 
                              onClick={() => setDrawingMode(drawingMode === 'annotate' ? null : 'annotate')}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                drawingMode === 'annotate' ? "bg-brand-500 text-white" : "text-slate-500 hover:text-slate-300"
                              )}
                              title="Annotation Tool"
                            >
                              <Type size={16} />
                            </button>

                            <div className="mx-2 w-[1px] h-4 bg-border-subtle" />

                            <div className="flex items-center gap-1 px-1">
                              {[
                                { name: 'Emerald', hex: '#10b981' },
                                { name: 'Cyan', hex: '#22d3ee' },
                                { name: 'Rose', hex: '#f43f5e' },
                                { name: 'Amber', hex: '#f59e0b' },
                                { name: 'Slate', hex: '#cbd5e1' }
                              ].map(c => (
                                <button
                                  key={c.hex}
                                  onClick={() => setDrawingColor(c.hex)}
                                  className={cn(
                                    "w-4 h-4 rounded-full border border-white/10 transition-transform hover:scale-125",
                                    drawingColor === c.hex ? "ring-2 ring-white/30 scale-125" : "opacity-60"
                                  )}
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                            </div>

                            <div className="mx-2 w-[1px] h-4 bg-border-subtle" />

                            <button 
                              onClick={clearDrawing}
                              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-all"
                              title="Clear All"
                            >
                              <Eraser size={16} />
                            </button>
                          </div>

                          <div className="flex bg-bg-alt p-1 rounded-xl h-fit border border-border-subtle">
                          {['1D', '1W', '1M', '1Y', 'ALL'].map(range => (
                            <button 
                              key={range}
                              onClick={() => setTimeRange(range)}
                              className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                timeRange === range ? "bg-brand-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                              )}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                        <div 
                          className="h-[400px] w-full relative group/chart"
                          onWheel={handleWheel}
                        >
                          {drawingMode && (
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full text-[10px] font-black text-brand-400 uppercase tracking-widest animate-pulse">
                              <MousePointer2 size={12} />
                              Click to {drawingMode === 'trendline' ? 'draw line' : drawingMode === 'rect' ? 'draw area' : drawingMode === 'circle' ? 'mark spot' : 'add note'}
                            </div>
                          )}

                          {zoomRange && (
                            <button 
                              onClick={handleZoomReset}
                              className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-border-subtle px-3 py-1.5 rounded-full text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest transition-all shadow-xl backdrop-blur-md"
                            >
                              <RefreshCw size={12} />
                              Reset Zoom
                            </button>
                          )}

                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                              style={{ cursor: drawingMode ? 'crosshair' : (isPanning ? 'grabbing' : (zoomRange ? 'grab' : 'default')) }}
                              data={selectedStock.history.map(h => ({
                                ...h,
                                price: h.price * (currency === 'USD' ? 1 : (exchangeRates as any)[currency])
                              }))}
                              onMouseDown={handleChartInteraction}
                              onMouseMove={handleMouseMove}
                              onMouseUp={() => setIsPanning(false)}
                              onMouseLeave={() => setIsPanning(false)}
                            >
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={selectedStock.changePercent >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={selectedStock.changePercent >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                            <XAxis 
                              dataKey="time" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 10 }}
                              dy={10}
                            />
                            <YAxis 
                              domain={['auto', 'auto']}
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 10 }}
                              orientation="right"
                              tickFormatter={(value) => formatCompactNumber(value)}
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '8px' }}
                              itemStyle={{ color: '#10b981' }}
                              formatter={(value: number) => [formatCurrency(value, currency), 'Price']}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke={selectedStock.changePercent >= 0 ? "#10b981" : "#f43f5e"} 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorValue)" 
                              animationDuration={1500}
                              isAnimationActive={!drawingMode}
                            />

                            {/* Trendlines */}
                            {trendlines.map(line => (
                              <RefLine 
                                key={line.id} 
                                segment={[{ x: line.start.time, y: line.start.price }, { x: line.end.time, y: line.end.price }]} 
                                stroke={line.color} 
                                strokeWidth={2}
                                strokeDasharray="5 5"
                              />
                            ))}

                            {/* Rectangles (Reference Areas) */}
                            {rects.map(rect => (
                              <RefArea
                                key={rect.id}
                                x1={rect.start.time}
                                x2={rect.end.time}
                                y1={rect.start.price}
                                y2={rect.end.price}
                                fill={rect.color}
                                fillOpacity={0.1}
                                stroke={rect.color}
                                strokeOpacity={0.5}
                                strokeWidth={1}
                              />
                            ))}

                            {/* Circles (Reference Dots with border) */}
                            {circles.map(circle => (
                              <RefDot
                                key={circle.id}
                                x={circle.center.time}
                                y={circle.center.price}
                                r={circle.radius}
                                fill={circle.color}
                                fillOpacity={0.1}
                                stroke={circle.color}
                                strokeOpacity={0.5}
                                strokeWidth={2}
                              />
                            ))}

                            {/* Active/Temp Shapes */}
                            {tempShape && drawingMode === 'trendline' && (
                              <RefLine 
                                segment={[{ x: tempShape.start.time, y: tempShape.start.price }, { x: tempShape.end.time, y: tempShape.end.price }]} 
                                stroke={drawingColor} 
                                strokeWidth={2}
                              />
                            )}

                            {tempShape && drawingMode === 'rect' && (
                              <RefArea
                                x1={tempShape.start.time}
                                x2={tempShape.end.time}
                                y1={tempShape.start.price}
                                y2={tempShape.end.price}
                                fill={drawingColor}
                                fillOpacity={0.2}
                              />
                            )}

                            {tempShape && drawingMode === 'circle' && (
                              <RefDot
                                x={tempShape.center.time}
                                y={tempShape.center.price}
                                r={tempShape.radius}
                                fill={drawingColor}
                                fillOpacity={0.2}
                                stroke={drawingColor}
                                strokeWidth={1}
                              />
                            )}

                            {/* Annotations */}
                            {annotations.map(anno => (
                              <RefDot 
                                key={anno.id} 
                                x={anno.point.time} 
                                y={anno.point.price} 
                                r={4} 
                                fill="#brand-500" 
                                stroke="#fff" 
                                label={{ position: 'top', value: anno.text, fill: '#fff', fontSize: 10, fontWeight: 'bold' }} 
                              />
                            ))}

                            <Brush 
                              dataKey="time" 
                              height={20} 
                              stroke="#1f2937" 
                              fill="#0d1117"
                              travelerWidth={10}
                              startIndex={zoomRange ? zoomRange[0] : undefined}
                              endIndex={zoomRange ? zoomRange[1] : undefined}
                              onChange={handleBrushChange}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Fundamental Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { 
                          label: "Market Cap", 
                          value: formatCompactNumber(selectedStock.marketCap * (currency === 'USD' ? 1 : (exchangeRates as any)[currency])) 
                        },
                        { label: "Avg Volume", value: formatCompactNumber(selectedStock.volume) },
                        { 
                          label: "Day Range", 
                          value: `${(selectedStock.low * (currency === 'USD' ? 1 : (exchangeRates as any)[currency])).toFixed(0)} - ${(selectedStock.high * (currency === 'USD' ? 1 : (exchangeRates as any)[currency])).toFixed(0)}` 
                        },
                        { label: "PE Ratio", value: "32.4x" },
                      ].map((stat, i) => (
                        <div key={i} className="glass-panel p-4 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{stat.label}</span>
                          <span className="text-lg font-bold text-slate-100">{stat.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fundamental Analysis (AI Powered) */}
                    <div className="glass-panel p-6 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-brand-400">
                        <Zap size={120} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-2">
                           <ShieldCheck className="text-brand-400" size={20} />
                           <h3 className="text-lg font-bold text-white">AI Fundamental Insights</h3>
                         </div>
                         {isAnalyzing && (
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                              <span className="text-[10px] text-slate-500 uppercase font-bold">Refining...</span>
                           </div>
                         )}
                      </div>
                      <div className="min-h-[60px] relative">
                        <AnimatePresence mode="wait">
                          <motion.p 
                            key={selectedStock.symbol}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-slate-400 leading-relaxed max-w-3xl"
                          >
                            {aiAnalysis || "Generating deep analysis for " + selectedStock.name + "..."}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                      <button className="mt-6 flex items-center gap-2 text-brand-400 text-xs font-bold hover:gap-3 transition-all">
                        GENERATE COMPREHENSIVE REPORT <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Right: Portfolio & News */}
                  <div className="space-y-6">
                    {/* Portfolio Value */}
                    <div className="bg-brand-600 glass-panel p-6 text-white relative overflow-hidden group">
                       <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                       <div className="relative z-10">
                         <div className="flex items-center justify-between mb-4">
                           <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Portfolio Value</span>
                           <div className="p-1.5 bg-white/10 rounded-lg">
                             <Globe size={12} className="opacity-60" />
                           </div>
                         </div>
                         <div className="text-3xl font-black mb-1">
                           {formatCurrency(42904.50 * (currency === 'USD' ? 1 : (exchangeRates as any)[currency]), currency)}
                         </div>
                         <div className="flex items-center gap-2 text-emerald-400">
                           <TrendingUp size={14} />
                           <span className="text-xs font-bold">+12.4% this month</span>
                         </div>
                         <button className="mt-6 w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all">
                           View All Assets
                         </button>
                       </div>
                    </div>

                    {/* Portfolio Distribution */}
                    <div className="glass-panel p-6">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="text-lg font-bold text-white">Asset Allocation</h3>
                         <PieChart size={18} className="text-slate-500" />
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stocks.map(s => ({ name: s.symbol, value: s.marketCap / 1e12 }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '8px' }}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* News Feed */}
                    <div className="glass-panel p-6">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="text-lg font-bold text-white">Market News</h3>
                         <div className="flex gap-2">
                           <button 
                             onClick={handleSummarizeNews}
                             disabled={isSummarizingNews}
                             className={cn(
                               "text-[10px] px-2 py-1 rounded-lg font-black uppercase transition-all flex items-center gap-1.5",
                               isSummarizingNews ? "bg-white/5 text-slate-500" : "bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"
                             )}
                           >
                             <Zap size={12} className={cn(isSummarizingNews && "animate-pulse")} />
                             {isSummarizingNews ? "Summarizing..." : "AI Summary"}
                           </button>
                           <button className="text-xs text-slate-500 hover:text-brand-400 font-bold uppercase transition-colors">Latest</button>
                         </div>
                      </div>

                      <AnimatePresence>
                        {newsSummary && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10 relative overflow-hidden group"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-400" />
                            <button 
                              onClick={() => setNewsSummary('')}
                              className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                            <div className="flex items-center gap-2 mb-2">
                              <Zap size={14} className="text-brand-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">AI Market Sentiment</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                              "{newsSummary}"
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-2">
                         {MOCK_NEWS.map(news => (
                           <div 
                              key={news.id} 
                              onClick={() => setExpandedNewsId(expandedNewsId === news.id ? null : news.id)}
                              className={cn(
                                "group cursor-pointer p-3 rounded-xl transition-all border border-transparent",
                                expandedNewsId === news.id ? "bg-white/5 border-border-subtle" : "hover:bg-white/5"
                              )}
                           >
                              <div className="flex items-center gap-2 mb-1">
                                 <span className={cn(
                                   "w-1.5 h-1.5 rounded-full",
                                   news.sentiment === 'positive' ? "bg-emerald-400" : news.sentiment === 'negative' ? "bg-rose-400" : "bg-slate-400"
                                 )}></span>
                                 <span className="text-[10px] text-slate-500 uppercase font-black">{news.source} • {news.time}</span>
                              </div>
                              <h4 className={cn(
                                "text-sm font-bold transition-colors leading-snug",
                                expandedNewsId === news.id ? "text-brand-400" : "text-slate-200 group-hover:text-brand-400"
                              )}>
                                {news.title}
                              </h4>
                              <AnimatePresence>
                                {expandedNewsId === news.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                      {news.summary}
                                    </p>
                                    <a 
                                      href={news.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 mt-3 text-[10px] font-bold text-brand-500 hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      READ FULL ARTICLE <ChevronRight size={10} />
                                    </a>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                           </div>
                         ))}
                      </div>
                    </div>

                    {/* Quick Alerts */}
                    <div className="glass-panel p-6 border-dashed">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-amber-400/10 text-amber-400 rounded-lg">
                            <Bell size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-200">Price Alerts</span>
                       </div>
                       <div className="space-y-3">
                         {alerts.map(alert => (
                           <div key={alert.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg border border-border-subtle group">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-200">{alert.symbol} {alert.condition === 'above' ? '>' : '<'} ${alert.target}</span>
                                <span className="text-[10px] text-slate-500">Active</span>
                              </div>
                              <button 
                                onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all"
                              >
                                <X size={12} />
                              </button>
                           </div>
                         ))}
                         <button 
                           onClick={addAlert}
                           className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 border border-slate-700/50 rounded-lg transition-all border-dashed"
                         >
                           + Add for {selectedStock.symbol}
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'converter' && (
              <motion.div 
                key="converter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center">
                          <Coins className="text-brand-400" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Currency Converter</h2>
                          <p className="text-xs text-slate-500">Live mid-market exchange rates</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount to convert</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={converterAmount}
                              onChange={(e) => setConverterAmount(e.target.value)}
                              className="w-full bg-bg-alt border border-border-subtle rounded-2xl p-5 text-2xl font-black text-white focus:outline-none focus:border-brand-500 transition-all placeholder:text-slate-700"
                              placeholder="0.00"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                              {fromCurrency}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">From</label>
                            <select 
                              value={fromCurrency}
                              onChange={(e) => setFromCurrency(e.target.value)}
                              className="w-full bg-bg-alt border border-border-subtle rounded-xl p-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                            </select>
                          </div>
                          
                          <button 
                            onClick={() => {
                              const temp = fromCurrency;
                              setFromCurrency(toCurrency);
                              setToCurrency(temp);
                            }}
                            className="mt-6 p-4 rounded-xl bg-white/5 border border-border-subtle text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                          >
                            <ArrowRightLeft size={20} />
                          </button>

                          <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">To</label>
                            <select 
                              value={toCurrency}
                              onChange={(e) => setToCurrency(e.target.value)}
                              className="w-full bg-bg-alt border border-border-subtle rounded-xl p-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-8 mt-4 border-t border-dashed border-border-subtle">
                          <div className="flex flex-col items-center justify-center p-8 bg-brand-500/5 rounded-3xl border border-brand-500/10 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl" />
                            
                            <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Conversion Result</span>
                            <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                              {converterResult !== null ? formatCurrency(converterResult, toCurrency) : '---'}
                            </div>
                            <div className="text-xs font-bold text-brand-400">
                              1 {fromCurrency} = {(converterResult !== null && parseFloat(converterAmount) !== 0) ? (converterResult / parseFloat(converterAmount)).toFixed(4) : '---'} {toCurrency}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-panel p-6">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-border-subtle pb-4">Live Market Rates</h3>
                      <div className="space-y-4">
                        {[
                          { symbol: 'EUR', name: 'Euro', value: (exchangeRates as any).EUR },
                          { symbol: 'GBP', name: 'Pound Sterling', value: (exchangeRates as any).GBP },
                          { symbol: 'JPY', name: 'Japanese Yen', value: (exchangeRates as any).JPY },
                          { symbol: 'BTC', name: 'Bitcoin', value: (exchangeRates as any).BTC, isCrypto: true }
                        ].map((rate) => (
                          <div key={rate.symbol} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-bg-alt flex items-center justify-center text-[10px] font-black text-slate-400 border border-border-subtle group-hover:border-brand-500/50 group-hover:text-brand-400 transition-all">
                                {rate.symbol}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-200">{rate.name}</span>
                                <span className="text-[10px] text-slate-500">1 USD =</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-black text-white">
                                {rate.isCrypto ? rate.value.toFixed(6) : rate.value.toFixed(4)}
                              </div>
                              <div className="text-[10px] text-emerald-400 font-bold">
                                +0.02%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-4 border-t border-border-subtle">
                         <div className="p-3 bg-bg-alt rounded-xl border border-border-subtle text-[10px] text-slate-500 leading-relaxed italic">
                           Exchange rates are updated every 30 minutes. Last sync: {new Date().toLocaleTimeString()}
                         </div>
                      </div>
                    </div>

                    <div className="glass-panel p-6 bg-gradient-to-br from-brand-600/10 to-transparent border-brand-500/20">
                      <h3 className="text-xs font-black text-brand-400 uppercase tracking-widest mb-4">Quick Exchange</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { from: 'USD', to: 'EUR' },
                          { from: 'EUR', to: 'USD' },
                          { from: 'GBP', to: 'USD' },
                          { from: 'USD', to: 'GBP' }
                        ].map((pair, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setFromCurrency(pair.from);
                              setToCurrency(pair.to);
                            }}
                            className="bg-bg-card/50 hover:bg-brand-500/10 border border-border-subtle p-3 rounded-xl text-center transition-all group"
                          >
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-brand-400 uppercase leading-none">
                              {pair.from} <ArrowRightLeft size={8} className="inline mx-1" /> {pair.to}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'backtesting' && (
              <motion.div 
                key="backtesting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-8 min-h-[500px] flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="text-brand-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Strategy Backtester</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                  Analyze historical performance of your trading strategies against multi-year data sets. 
                  Identify patterns, stress-test your portfolio, and optimize your entry points.
                </p>
                <div className="w-full max-w-2xl bg-bg-alt/50 rounded-2xl p-8 border border-dashed border-border-subtle">
                   <div className="flex flex-col md:flex-row items-center gap-4 mb-6 text-left">
                      <div className="flex-1 w-full text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entry Strategy</label>
                        <div className="mt-1 p-3 bg-bg-card rounded-lg border border-border-subtle text-sm text-slate-300">RSI &lt; 30 + Bulish Engulfing</div>
                      </div>
                      <div className="flex-1 w-full text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Exit Strategy</label>
                        <div className="mt-1 p-3 bg-bg-card rounded-lg border border-border-subtle text-sm text-slate-300">Take Profit: 15% / Stop Loss: 5%</div>
                      </div>
                   </div>
                   <button className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all neon-glow flex items-center justify-center gap-2">
                      <Zap size={16} fill="white" /> RUN SIMULATION ENGINE
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'risk' && (
              <motion.div 
                key="risk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Sharpe Ratio Analysis</h3>
                  <div className="flex items-end gap-2 h-40">
                    {[65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-brand-500/20 rounded-t-lg relative group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="absolute bottom-0 w-full bg-brand-500 rounded-t-lg transition-all group-hover:brightness-125"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Risk-Adjusted Quality</span>
                      <span className="text-2xl font-black text-white">2.41 <span className="text-xs text-brand-400">Low Risk Portfolio</span></span>
                    </div>
                  </div>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-white mb-2">Portfolio Beta</h3>
                  <p className="text-sm text-slate-400 mb-6">Your portfolio is currently 15% more volatile than the S&P 500 benchmark.</p>
                  <div className="w-full bg-bg-alt h-4 rounded-full overflow-hidden border border-border-subtle">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '65%' }}
                       className="h-full bg-gradient-to-r from-emerald-500 to-amber-500" 
                     />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500">
                    <span>CONSERVATIVE</span>
                    <span>MODERATE</span>
                    <span>AGGRESSIVE</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
