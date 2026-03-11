import { NextResponse } from "next/server";

export const runtime = "edge";

export interface SentimentData {
  // Fear & Greed (market-wide)
  fearGreedValue: number;
  fearGreedLabel: string;   // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
  fearGreedYesterday: number;
  fearGreedLastWeek: number;

  // Long/Short Ratio (Binance Futures only — null for spot / Bybit)
  longShortRatio: number | null;     // e.g. 1.42 means more longs than shorts
  longPct: number | null;            // e.g. 58.7 (% of accounts long)
  shortPct: number | null;           // e.g. 41.3
  topTraderLongPct: number | null;   // top 20% traders % long
  topTraderShortPct: number | null;

  // Meta
  symbol: string;
  isFuturesBinance: boolean;
  error: string | null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol   = searchParams.get("symbol") ?? "";   // e.g. "BTCUSDT"
  const exchange = searchParams.get("exchange") ?? ""; // e.g. "Binance Futures"
  const type     = searchParams.get("type") ?? "";     // "FUTURES" | "SPOT"

  const isFuturesBinance = type === "FUTURES" && exchange === "Binance Futures";

  // ── 1. Fear & Greed (always fetch — market-wide, no symbol needed) ──────────
  let fearGreedValue     = 0;
  let fearGreedLabel     = "Unknown";
  let fearGreedYesterday = 0;
  let fearGreedLastWeek  = 0;

  try {
    const fgRes  = await fetch("https://api.alternative.me/fng/?limit=8", {
      next: { revalidate: 3600 }, // cache 1 hour — updates once daily
    });
    const fgData = await fgRes.json() as {
      data: { value: string; value_classification: string }[];
    };

    if (fgData.data?.length > 0) {
      fearGreedValue     = parseInt(fgData.data[0].value);
      fearGreedLabel     = fgData.data[0].value_classification;
      fearGreedYesterday = fgData.data[1] ? parseInt(fgData.data[1].value) : fearGreedValue;
      fearGreedLastWeek  = fgData.data[7] ? parseInt(fgData.data[7].value) : fearGreedValue;
    }
  } catch {
    // fail silently — L/S data may still succeed
  }

  // ── 2. Long/Short Ratio (Binance Futures only) ────────────────────────────
  let longShortRatio    : number | null = null;
  let longPct           : number | null = null;
  let shortPct          : number | null = null;
  let topTraderLongPct  : number | null = null;
  let topTraderShortPct : number | null = null;
  let lsError           : string | null = null;

  if (isFuturesBinance && symbol) {
    try {
      const [globalRes, topRes] = await Promise.allSettled([
        fetch(
          `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1h&limit=1`,
          { next: { revalidate: 300 } }
        ),
        fetch(
          `https://fapi.binance.com/futures/data/topLongShortPositionRatio?symbol=${symbol}&period=1h&limit=1`,
          { next: { revalidate: 300 } }
        ),
      ]);

      if (globalRes.status === "fulfilled") {
        const globalData = await globalRes.value.json() as {
          longShortRatio: string;
          longAccount: string;
          shortAccount: string;
        }[];
        if (globalData?.[0]) {
          longShortRatio = parseFloat(globalData[0].longShortRatio);
          longPct        = parseFloat(globalData[0].longAccount) * 100;
          shortPct       = parseFloat(globalData[0].shortAccount) * 100;
        }
      }

      if (topRes.status === "fulfilled") {
        const topData = await topRes.value.json() as {
          longShortRatio: string;
          longAccount: string;
          shortAccount: string;
        }[];
        if (topData?.[0]) {
          topTraderLongPct  = parseFloat(topData[0].longAccount) * 100;
          topTraderShortPct = parseFloat(topData[0].shortAccount) * 100;
        }
      }
    } catch (e) {
      lsError = `Could not fetch L/S ratio: ${String(e)}`;
    }
  }

  const result: SentimentData = {
    fearGreedValue,
    fearGreedLabel,
    fearGreedYesterday,
    fearGreedLastWeek,
    longShortRatio,
    longPct,
    shortPct,
    topTraderLongPct,
    topTraderShortPct,
    symbol,
    isFuturesBinance,
    error: lsError,
  };

  return NextResponse.json(result);
}