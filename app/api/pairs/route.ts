import { NextResponse } from "next/server";

export const runtime = "edge";

export interface LivePair {
  symbol: string;
  type: string;
  exchange: string;
  priceChangePct: number;   // real 24h price change %
  vol24h: number;           // real 24h volume in USDT millions
  fundingRate: number | null; // real funding rate (futures only)
  openInterest: number | null; // real OI in USDT millions (futures only)
  oiChangePct: number | null; // simulated — not available in bulk ticker
}

// ── Binance Spot ──────────────────────────────────────────────────────────────
async function fetchBinanceSpot(): Promise<LivePair[]> {
  const [tickerRes] = await Promise.all([
    fetch("https://api.binance.com/api/v3/ticker/24hr", { next: { revalidate: 60 } }),
  ]);

  const tickers = await tickerRes.json() as {
    symbol: string;
    priceChangePercent: string;
    quoteVolume: string;
  }[];

  return tickers
    .filter(t => t.symbol.endsWith("USDT"))
    .map(t => ({
      symbol: t.symbol,
      type: "SPOT",
      exchange: "Binance Spot",
      priceChangePct: parseFloat(t.priceChangePercent),
      vol24h: parseFloat(t.quoteVolume) / 1_000_000, // convert to millions
      fundingRate: null,
      openInterest: null,
      oiChangePct: null,
    }));
}

// ── Binance Futures ───────────────────────────────────────────────────────────
async function fetchBinanceFutures(): Promise<LivePair[]> {
  const [tickerRes, fundingRes, oiRes] = await Promise.all([
    fetch("https://fapi.binance.com/fapi/v1/ticker/24hr", { next: { revalidate: 60 } }),
    fetch("https://fapi.binance.com/fapi/v1/premiumIndex", { next: { revalidate: 60 } }),
    fetch("https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT", { next: { revalidate: 60 } })
      .then(() => null).catch(() => null), // OI per symbol requires individual calls, skip bulk
  ]);

  const tickers = await tickerRes.json() as {
    symbol: string;
    priceChangePercent: string;
    quoteVolume: string;
  }[];

  const fundingData = await fundingRes.json() as {
    symbol: string;
    lastFundingRate: string;
  }[];

  const fundingMap = new Map(fundingData.map(f => [f.symbol, parseFloat(f.lastFundingRate) * 100]));

  return tickers
    .filter(t => t.symbol.endsWith("USDT"))
    .map(t => ({
      symbol: t.symbol,
      type: "FUTURES",
      exchange: "Binance Futures",
      priceChangePct: parseFloat(t.priceChangePercent),
      vol24h: parseFloat(t.quoteVolume) / 1_000_000,
      fundingRate: fundingMap.get(t.symbol) ?? null,
      openInterest: null, // bulk OI not available without per-symbol calls
      oiChangePct: null,
    }));
}

// ── Bybit Spot ────────────────────────────────────────────────────────────────
async function fetchBybitSpot(): Promise<LivePair[]> {
  const res = await fetch(
    "https://api.bybit.com/v5/market/tickers?category=spot",
    { next: { revalidate: 60 } }
  );
  const data = await res.json() as {
    result: {
      list: {
        symbol: string;
        price24hPcnt: string;
        turnover24h: string;
      }[];
    };
  };

  return (data.result?.list ?? [])
    .filter(t => t.symbol.endsWith("USDT"))
    .map(t => ({
      symbol: t.symbol,
      type: "SPOT",
      exchange: "Bybit Spot",
      priceChangePct: parseFloat(t.price24hPcnt) * 100,
      vol24h: parseFloat(t.turnover24h) / 1_000_000,
      fundingRate: null,
      openInterest: null,
      oiChangePct: null,
    }));
}

// ── Bybit Futures ─────────────────────────────────────────────────────────────
async function fetchBybitFutures(): Promise<LivePair[]> {
  const res = await fetch(
    "https://api.bybit.com/v5/market/tickers?category=linear",
    { next: { revalidate: 60 } }
  );
  const data = await res.json() as {
    result: {
      list: {
        symbol: string;
        price24hPcnt: string;
        turnover24h: string;
        fundingRate: string;
        openInterest: string;
        openInterestValue: string;
      }[];
    };
  };

  return (data.result?.list ?? [])
    .filter(t => t.symbol.endsWith("USDT"))
    .map(t => ({
      symbol: t.symbol,
      type: "FUTURES",
      exchange: "Bybit Futures",
      priceChangePct: parseFloat(t.price24hPcnt) * 100,
      vol24h: parseFloat(t.turnover24h) / 1_000_000,
      fundingRate: parseFloat(t.fundingRate) * 100, // convert to % like Binance
      openInterest: parseFloat(t.openInterestValue) / 1_000_000,
      oiChangePct: null, // historical OI change not in bulk ticker
    }));
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET() {
  const results = await Promise.allSettled([
    fetchBinanceSpot(),
    fetchBinanceFutures(),
    fetchBybitSpot(),
    fetchBybitFutures(),
  ]);

  const pairs: LivePair[] = [];
  const errors: string[] = [];
  const names = ["Binance Spot", "Binance Futures", "Bybit Spot", "Bybit Futures"];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      pairs.push(...r.value);
    } else {
      errors.push(`${names[i]}: ${String(r.reason)}`);
    }
  });

  // Deduplicate: if same symbol exists on both Binance and Bybit, keep both
  // (they are different exchanges and may have different prices/funding)
  return NextResponse.json({ pairs, errors, total: pairs.length });
}