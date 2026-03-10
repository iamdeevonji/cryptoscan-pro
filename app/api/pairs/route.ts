import { NextResponse } from "next/server";

export const runtime = "edge";

const SOURCES = {
  binance_spot: async () => {
    const res = await fetch("https://api.binance.com/api/v3/exchangeInfo", {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return (data.symbols as { quoteAsset: string; status: string; symbol: string }[])
      .filter(s => s.quoteAsset === "USDT" && s.status === "TRADING")
      .map(s => ({ symbol: s.symbol, type: "SPOT", exchange: "Binance Spot" }));
  },

  binance_futures: async () => {
    const res = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo", {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return (data.symbols as { quoteAsset: string; status: string; contractType: string; symbol: string }[])
      .filter(s => s.quoteAsset === "USDT" && s.status === "TRADING" && s.contractType === "PERPETUAL")
      .map(s => ({ symbol: s.symbol, type: "FUTURES", exchange: "Binance Futures" }));
  },

  bybit_spot: async () => {
    const res = await fetch("https://api.bybit.com/v5/market/instruments-info?category=spot&limit=1000", {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return ((data.result?.list ?? []) as { quoteCoin: string; status: string; symbol: string }[])
      .filter(s => s.quoteCoin === "USDT" && s.status === "Trading")
      .map(s => ({ symbol: s.symbol, type: "SPOT", exchange: "Bybit Spot" }));
  },

  bybit_futures: async () => {
    const res = await fetch("https://api.bybit.com/v5/market/instruments-info?category=linear&limit=1000", {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return ((data.result?.list ?? []) as { quoteCoin: string; status: string; contractType: string; symbol: string }[])
      .filter(s => s.quoteCoin === "USDT" && s.status === "Trading" && s.contractType === "LinearPerpetual")
      .map(s => ({ symbol: s.symbol, type: "FUTURES", exchange: "Bybit Futures" }));
  },
};

export async function GET() {
  const results = await Promise.allSettled([
    SOURCES.binance_spot(),
    SOURCES.binance_futures(),
    SOURCES.bybit_spot(),
    SOURCES.bybit_futures(),
  ]);

  const pairs: { symbol: string; type: string; exchange: string }[] = [];
  const errors: string[] = [];

  const names = ["Binance Spot", "Binance Futures", "Bybit Spot", "Bybit Futures"];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      pairs.push(...r.value);
    } else {
      errors.push(`${names[i]}: ${r.reason}`);
    }
  });

  return NextResponse.json({ pairs, errors, total: pairs.length });
}