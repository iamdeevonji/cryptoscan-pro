"use client";

import { useState, useEffect } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117; --surface: #1a1d27; --surface2: #21253a;
    --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
    --accent: #6c63ff; --accent-glow: rgba(108,99,255,0.25);
    --green: #22c55e; --green-glow: rgba(34,197,94,0.2);
    --red: #ef4444; --red-glow: rgba(239,68,68,0.2);
    --orange: #f97316; --blue: #38bdf8;
    --text: #e2e8f0; --text-dim: #94a3b8; --text-muted: #475569;
    --up: #22c55e; --down: #ef4444;
    --radius: 14px; --radius-sm: 8px;
  }
  .light {
    --bg: #f1f5f9; --surface: #ffffff; --surface2: #f8fafc;
    --border: rgba(0,0,0,0.07); --border2: rgba(0,0,0,0.12);
    --accent: #6c63ff; --accent-glow: rgba(108,99,255,0.15);
    --green: #16a34a; --green-glow: rgba(22,163,74,0.15);
    --red: #dc2626; --red-glow: rgba(220,38,38,0.15);
    --orange: #ea580c; --blue: #0284c7;
    --text: #0f172a; --text-dim: #475569; --text-muted: #94a3b8;
    --up: #16a34a; --down: #dc2626;
  }

  html,body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); -webkit-text-size-adjust:100%; }
  .app { min-height:100vh; background:var(--bg); transition:background .3s; }

  .nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid var(--border); background:var(--surface); position:sticky; top:0; z-index:50; backdrop-filter:blur(12px); }
  .nav-brand { display:flex; align-items:center; gap:10px; }
  .nav-logo { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,var(--accent),#a78bfa); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:white; }
  .nav-title { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--text); }
  .nav-title span { color:var(--accent); }
  .nav-right { display:flex; align-items:center; gap:10px; }
  .live-pill { display:flex; align-items:center; gap:6px; background:var(--green-glow); border:1px solid rgba(34,197,94,0.3); border-radius:20px; padding:4px 12px; font-size:12px; font-weight:500; color:var(--green); }
  .live-dot { width:6px; height:6px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
  .theme-btn { width:36px; height:36px; border-radius:var(--radius-sm); background:var(--surface2); border:1px solid var(--border2); color:var(--text-dim); cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all .2s; }
  .theme-btn:hover { border-color:var(--accent); color:var(--accent); }

  .page { max-width:1200px; margin:0 auto; padding:24px 16px; }

  .hero { text-align:center; padding:32px 16px 24px; }
  .hero-badge { display:inline-flex; align-items:center; gap:6px; background:var(--accent-glow); border:1px solid rgba(108,99,255,0.3); border-radius:20px; padding:5px 14px; font-size:12px; font-weight:500; color:var(--accent); margin-bottom:16px; }
  .hero-title { font-family:'Space Grotesk',sans-serif; font-size:clamp(26px,5vw,42px); font-weight:700; color:var(--text); line-height:1.2; margin-bottom:10px; }
  .hero-title span { background:linear-gradient(135deg,var(--accent),#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .hero-sub { font-size:15px; color:var(--text-dim); max-width:520px; margin:0 auto; line-height:1.6; }

  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
  @media(max-width:600px){ .stats-row { grid-template-columns:repeat(2,1fr); } }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px; transition:border-color .2s; }
  .stat-card:hover { border-color:var(--border2); }
  .stat-label { font-size:12px; color:var(--text-muted); margin-bottom:6px; font-weight:500; }
  .stat-value { font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:700; color:var(--text); }
  .stat-value.accent { color:var(--accent); }
  .stat-value.green  { color:var(--green); }

  .filter-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:20px; overflow:hidden; }
  .filter-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; cursor:pointer; user-select:none; transition:background .15s; }
  .filter-header:hover { background:var(--surface2); }
  .filter-header-left { display:flex; align-items:center; gap:10px; }
  .filter-icon { width:32px; height:32px; border-radius:var(--radius-sm); background:var(--accent-glow); display:flex; align-items:center; justify-content:center; font-size:15px; }
  .filter-title { font-size:15px; font-weight:600; color:var(--text); }
  .filter-subtitle { font-size:12px; color:var(--text-muted); margin-top:1px; }
  .filter-chevron { font-size:12px; color:var(--text-muted); transition:transform .2s; }
  .filter-chevron.open { transform:rotate(180deg); }
  .filter-divider { height:1px; background:var(--border); }
  .filter-body { padding:20px; display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
  @media(max-width:700px){ .filter-body { grid-template-columns:1fr; } }
  .filter-section-title { font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
  .filter-group { display:flex; flex-direction:column; gap:12px; }
  .filter-item { display:flex; flex-direction:column; gap:6px; }
  .filter-item-label { font-size:13px; font-weight:500; color:var(--text-dim); }
  .filter-item-hint { font-size:11px; color:var(--text-muted); margin-top:2px; line-height:1.4; }
  .f-input { background:var(--surface2); border:1px solid var(--border2); border-radius:var(--radius-sm); color:var(--text); font-family:'Inter',sans-serif; font-size:13px; padding:8px 12px; outline:none; width:100%; transition:border-color .2s; }
  .f-input:focus { border-color:var(--accent); }
  .f-input option { background:var(--surface); }
  .f-row { display:flex; gap:8px; align-items:center; }
  .f-unit { font-size:12px; color:var(--text-muted); white-space:nowrap; }

  .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .toggle-info { display:flex; flex-direction:column; gap:2px; }
  .toggle-label { font-size:13px; font-weight:500; color:var(--text); }
  .toggle-desc  { font-size:11px; color:var(--text-muted); line-height:1.4; }
  .pill-toggle { position:relative; width:42px; height:24px; flex-shrink:0; cursor:pointer; }
  .pill-toggle input { opacity:0; width:0; height:0; }
  .pill-track { position:absolute; inset:0; background:var(--border2); border-radius:12px; transition:background .2s; }
  .pill-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:var(--text-muted); transition:all .2s; }
  .pill-toggle input:checked ~ .pill-track { background:var(--accent); }
  .pill-toggle input:checked ~ .pill-thumb { transform:translateX(18px); background:white; }

  .active-filters { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
  .filter-chip { display:inline-flex; align-items:center; gap:5px; background:var(--surface); border:1px solid var(--border2); border-radius:20px; padding:5px 12px; font-size:12px; font-weight:500; color:var(--text-dim); }
  .filter-chip.on { background:var(--accent-glow); border-color:rgba(108,99,255,.4); color:var(--accent); }
  .filter-chip-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  .scan-section { display:flex; align-items:center; gap:14px; margin-bottom:24px; flex-wrap:wrap; }
  .scan-btn { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,var(--accent),#a78bfa); color:white; border:none; border-radius:var(--radius-sm); font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600; padding:12px 28px; cursor:pointer; transition:all .2s; box-shadow:0 4px 20px var(--accent-glow); }
  .scan-btn:hover { transform:translateY(-1px); box-shadow:0 6px 28px var(--accent-glow); }
  .scan-btn:active { transform:translateY(0); }
  .scan-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .scan-btn.scanning { animation:btnPulse 1s ease infinite; }
  @keyframes btnPulse { 0%,100%{box-shadow:0 4px 20px var(--accent-glow)} 50%{box-shadow:0 4px 32px rgba(108,99,255,.5)} }
  .scan-info { font-size:12px; color:var(--text-muted); }
  .scan-info span { color:var(--accent); font-weight:600; }

  /* ── DYK Screen ── */
  .dyk-screen { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:48px 32px; text-align:center; position:relative; overflow:hidden; }
  .dyk-screen::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%,rgba(108,99,255,0.08) 0%,transparent 70%); pointer-events:none; }
  .dyk-spinner-wrap { display:flex; justify-content:center; margin-bottom:24px; }
  .dyk-spinner { width:56px; height:56px; border:3px solid var(--border2); border-top-color:var(--accent); border-radius:50%; animation:spin .9s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .dyk-status { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--text); margin-bottom:6px; }
  .dyk-substatus { font-size:13px; color:var(--text-muted); margin-bottom:28px; min-height:20px; }
  .dyk-exchange-row { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:32px; }
  .dyk-exchange-pill { display:flex; align-items:center; gap:6px; background:var(--surface2); border:1px solid var(--border2); border-radius:20px; padding:5px 14px; font-size:12px; font-weight:600; color:var(--text-muted); transition:all .4s; }
  .dyk-exchange-pill.active { border-color:rgba(108,99,255,0.5); color:var(--accent); background:var(--accent-glow); }
  .dyk-exchange-pill.done  { border-color:rgba(34,197,94,0.4); color:var(--green); background:var(--green-glow); }
  .dyk-ex-dot { width:7px; height:7px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .dyk-ex-dot.spinning { background:transparent; border:2px solid currentColor; border-top-color:transparent; border-radius:50%; animation:spin .6s linear infinite; width:9px; height:9px; }
  .dyk-card { max-width:580px; margin:0 auto; background:var(--surface2); border:1px solid var(--border2); border-radius:var(--radius); padding:24px 28px; transition:opacity .4s ease; }
  .dyk-label { display:inline-flex; align-items:center; gap:6px; background:var(--accent-glow); border:1px solid rgba(108,99,255,0.3); border-radius:20px; padding:4px 12px; font-size:11px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:.5px; margin-bottom:14px; }
  .dyk-fact { font-size:15px; line-height:1.8; color:var(--text-dim); }
  .dyk-fact strong { color:var(--text); font-weight:600; }
  .dyk-dots { display:flex; justify-content:center; gap:6px; margin-top:24px; }
  .dyk-dot { width:6px; height:6px; border-radius:50%; background:var(--border2); transition:background .3s; }
  .dyk-dot.active { background:var(--accent); }

  /* ── Results ── */
  .results-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
  .results-title { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--text); }
  .results-sub { font-size:13px; color:var(--text-muted); margin-top:2px; }
  .results-badge { font-family:'Space Grotesk',sans-serif; font-size:28px; font-weight:700; color:var(--green); }
  .results-badge span { font-size:13px; color:var(--text-muted); margin-left:4px; font-weight:400; }

  .tabs { display:flex; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:4px; gap:4px; }
  .tab { padding:6px 16px; border-radius:6px; font-size:13px; font-weight:500; color:var(--text-muted); cursor:pointer; border:none; background:transparent; transition:all .15s; }
  .tab.active { background:var(--accent); color:white; box-shadow:0 2px 10px var(--accent-glow); }
  .tab:not(.active):hover { color:var(--text); background:var(--surface2); }

  /* table — removed ATR + Vol columns, now 8 cols */
  .table-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .t-head { display:grid; grid-template-columns:1fr 80px 110px 100px 110px 110px 120px 44px; padding:12px 20px; gap:8px; border-bottom:1px solid var(--border); }
  .t-th { font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; }
  .row-wrap { border-bottom:1px solid var(--border); }
  .row-wrap:last-child { border-bottom:none; }
  .t-row { display:grid; grid-template-columns:1fr 80px 110px 100px 110px 110px 120px 44px; padding:14px 20px; gap:8px; align-items:center; transition:background .15s; animation:rowIn .3s ease both; }
  .t-row:hover { background:var(--surface2); }
  @keyframes rowIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  .pair-name { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:700; color:var(--text); }
  .pair-base { color:var(--accent); }
  .pair-exch { font-size:11px; color:var(--text-muted); margin-top:1px; }
  .t-cell { font-size:13px; color:var(--text-dim); }
  .t-cell.mono { font-variant-numeric:tabular-nums; }
  .up   { color:var(--up);   font-weight:600; }
  .down { color:var(--down); font-weight:600; }

  .badge { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; padding:3px 8px; border-radius:6px; }
  .badge-spot    { background:rgba(56,189,248,.1);  color:var(--blue); }
  .badge-futures { background:rgba(249,115,22,.1);  color:var(--orange); }
  .badge-up      { background:var(--green-glow);    color:var(--green); }
  .badge-down    { background:var(--red-glow);      color:var(--down); }
  .badge-neutral { background:var(--surface2);      color:var(--text-muted); }

  .signal { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; padding:4px 9px; border-radius:6px; white-space:nowrap; }
  .signal-ss { background:var(--green-glow); color:var(--green); }
  .signal-ls { background:var(--red-glow);   color:var(--down); }
  .signal-none { background:var(--surface2); color:var(--text-muted); font-size:10px; }

  .trend-wrap { display:flex; align-items:center; gap:6px; }
  .trend-bar-bg { width:30px; height:4px; background:var(--border2); border-radius:4px; overflow:hidden; }
  .trend-bar-fill { height:100%; border-radius:4px; width:100%; }
  .fill-up   { background:var(--up); }
  .fill-down { background:var(--down); }
  .trend-label { font-size:12px; font-weight:600; }

  .ai-btn { width:32px; height:32px; border-radius:var(--radius-sm); background:var(--surface2); border:1px solid var(--border2); cursor:pointer; font-size:15px; display:flex; align-items:center; justify-content:center; transition:all .2s; flex-shrink:0; }
  .ai-btn:hover { background:var(--accent-glow); border-color:var(--accent); }
  .ai-btn.active { background:var(--accent-glow); border-color:var(--accent); }

  .ai-panel { overflow:hidden; max-height:0; transition:max-height .35s ease; background:var(--surface2); border-top:1px solid var(--border); }
  .ai-panel.open { max-height:700px; }
  .ai-panel-inner { padding:20px; }
  .ai-panel-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px; }
  .ai-panel-title { display:flex; align-items:center; gap:8px; }
  .ai-panel-icon { width:30px; height:30px; border-radius:var(--radius-sm); background:linear-gradient(135deg,var(--accent),#a78bfa); display:flex; align-items:center; justify-content:center; font-size:14px; }
  .ai-panel-name { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:700; color:var(--text); }
  .ai-panel-sub  { font-size:12px; color:var(--text-muted); }
  .ai-chart-btn { display:inline-flex; align-items:center; gap:5px; background:var(--accent-glow); border:1px solid rgba(108,99,255,.3); border-radius:var(--radius-sm); padding:6px 14px; font-size:12px; font-weight:600; color:var(--accent); text-decoration:none; transition:all .15s; }
  .ai-chart-btn:hover { background:rgba(108,99,255,.25); }
  .ai-content { font-size:13.5px; line-height:1.85; color:var(--text-dim); white-space:pre-wrap; word-break:break-word; }
  .ai-section-head { display:block; font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:.5px; margin-top:14px; margin-bottom:4px; }
  .ai-loading { display:flex; align-items:center; gap:10px; color:var(--text-muted); font-size:13px; }
  .ai-spinner { width:18px; height:18px; border:2px solid var(--border2); border-top-color:var(--accent); border-radius:50%; animation:spin .7s linear infinite; }
  .ai-footer { margin-top:14px; padding-top:12px; border-top:1px solid var(--border); font-size:11px; color:var(--text-muted); display:flex; align-items:center; gap:6px; }

  /* mobile */
  .cards-list { display:none; flex-direction:column; gap:12px; }
  .m-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; animation:rowIn .3s ease both; }
  .m-card-link { display:block; padding:16px; text-decoration:none; color:inherit; transition:background .15s; }
  .m-card-link:hover { background:var(--surface2); }
  .m-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
  .m-card-pair { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--text); }
  .m-card-pair span { color:var(--accent); }
  .m-card-badges { display:flex; gap:6px; flex-wrap:wrap; margin-top:4px; }
  .m-card-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
  .m-cell-label { font-size:11px; color:var(--text-muted); font-weight:500; margin-bottom:3px; }
  .m-cell-value { font-size:13px; font-weight:600; color:var(--text); }
  .m-card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--border); flex-wrap:wrap; gap:8px; }
  .m-chart-link { font-size:12px; font-weight:600; color:var(--accent); text-decoration:none; display:flex; align-items:center; gap:4px; }
  .m-ai-btn { display:flex; align-items:center; gap:6px; background:var(--surface2); border:1px solid var(--border2); border-radius:var(--radius-sm); padding:7px 14px; font-size:12px; font-weight:600; color:var(--text-dim); cursor:pointer; transition:all .2s; }
  .m-ai-btn:hover,.m-ai-btn.active { background:var(--accent-glow); border-color:var(--accent); color:var(--accent); }
  .m-ai-panel { overflow:hidden; max-height:0; transition:max-height .35s ease; }
  .m-ai-panel.open { max-height:700px; }
  .m-ai-inner { padding:16px; border-top:1px solid var(--border); background:var(--surface2); }

  @media(max-width:900px){
    .table-card { display:none; }
    .cards-list { display:flex; }
  }

  .idle-state { text-align:center; padding:60px 20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); }
  .idle-icon { font-size:48px; margin-bottom:16px; opacity:.4; }
  .idle-title { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px; }
  .idle-sub { font-size:14px; color:var(--text-muted); }
  .empty-state { text-align:center; padding:60px 20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); }
  .empty-icon  { font-size:40px; margin-bottom:14px; opacity:.4; }
  .empty-title { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:700; color:var(--text); margin-bottom:6px; }
  .empty-sub   { font-size:13px; color:var(--text-muted); }
  .error-banner { background:var(--red-glow); border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-sm); padding:12px 16px; margin-bottom:16px; font-size:13px; color:var(--down); }
  .live-badge { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; background:var(--green-glow); color:var(--green); border:1px solid rgba(34,197,94,0.3); margin-left:6px; vertical-align:middle; }
  .footer { text-align:center; padding:24px 16px; font-size:12px; color:var(--text-muted); }
`;

// ── DYK Facts ─────────────────────────────────────────────────────────────────
const DYK_FACTS = [
  "<strong>Volume precedes price.</strong> Unusually high volume often signals a big move is coming — before the price even breaks out.",
  "<strong>Funding rates are a sentiment gauge.</strong> Extremely positive funding means the crowd is very long — which often precedes a flush down.",
  "<strong>Whales prefer illiquid hours.</strong> Large players often move markets during low-liquidity windows like late Sunday UTC.",
  "<strong>Most retail traders lose money.</strong> Studies show 70–80% of retail crypto traders are net negative — edge comes from discipline, not luck.",
  "<strong>Short squeezes can be violent.</strong> When too many traders are short and price rises, forced liquidations amplify the move exponentially.",
  "<strong>The best setups have confluence.</strong> A single signal is noise. Volume + trend + funding alignment = a real edge.",
  "<strong>The daily close is the most important candle.</strong> Institutions and algos reference daily closes more than any intraday level.",
  "<strong>Risk management beats entry timing.</strong> A mediocre entry with a tight stop loss will outperform a perfect entry with no plan.",
  "<strong>Open Interest tells you who's in the trade.</strong> Rising OI + rising price = new longs entering. Falling OI + rising price = shorts covering.",
  "<strong>Most breakouts fail.</strong> Over 60% of apparent breakouts retrace back — always wait for confirmation.",
  "<strong>Asymmetric risk/reward is everything.</strong> Professional traders look for at least 2:1 reward-to-risk on every trade.",
  "<strong>Correlation spikes in crashes.</strong> During crypto sell-offs, nearly all coins move together — diversification offers little protection.",
  "<strong>Liquidity hunts are real.</strong> Price often sweeps obvious support/resistance levels to trigger stop losses before reversing.",
  "<strong>Mondays and Fridays are historically volatile.</strong> Crypto sees outsized moves at the start and end of the trading week.",
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface LivePair {
  symbol: string;
  type: string;
  exchange: string;
  priceChangePct: number;
  vol24h: number;
  fundingRate: number | null;
  openInterest: number | null;
  oiChangePct: number | null;
}

interface Cfg {
  marketType: string;
  spotVolMin: number;
  futVolMin: number;
  changeMin: number;
  changeMax: number;
  oiMin: number;
  allowSideways: boolean;
  fundingFilter: boolean;
}

type ExState = "pending" | "active" | "done" | "error";
const EXCHANGES = ["Binance Spot", "Binance Futures", "Bybit Spot", "Bybit Futures"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtVol  = (m: number) => m >= 1000 ? `$${(m/1000).toFixed(2)}B` : `$${m.toFixed(0)}M`;
const fmtChg  = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
const fmtFund = (v: number | null) => v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(3)}%`;
const fmtOI   = (v: number | null) => v == null ? "—" : v >= 1000 ? `$${(v/1000).toFixed(2)}B` : `$${v.toFixed(0)}M`;

function getTrend(priceChangePct: number): string {
  if (priceChangePct > 3)  return "UPTREND";
  if (priceChangePct < -3) return "DOWNTREND";
  return "SIDEWAYS";
}

function applyFilters(pairs: LivePair[], cfg: Cfg): LivePair[] {
  return pairs.filter(p => {
    if (cfg.marketType !== "ALL" && p.type !== cfg.marketType) return false;
    const volMin = p.type === "SPOT" ? cfg.spotVolMin : cfg.futVolMin;
    if (p.vol24h < volMin) return false;
    const abs = Math.abs(p.priceChangePct);
    if (abs < cfg.changeMin || abs > cfg.changeMax) return false;
    const trend = getTrend(p.priceChangePct);
    if (!cfg.allowSideways && trend === "SIDEWAYS") return false;
    if (cfg.fundingFilter && p.type === "FUTURES") {
      const fr = p.fundingRate ?? 0;
      if (!(fr <= -0.01 && trend === "UPTREND") && !(fr >= 0.01 && trend === "DOWNTREND")) return false;
    }
    return true;
  });
}

function getSignal(p: LivePair, cfg: Cfg): string {
  const trend = getTrend(p.priceChangePct);
  if (cfg.fundingFilter && p.type === "FUTURES" && p.fundingRate != null) {
    if (p.fundingRate <= -0.01 && trend === "UPTREND")  return "SHORT_SQUEEZE";
    if (p.fundingRate >= 0.01  && trend === "DOWNTREND") return "LONG_SQUEEZE";
  }
  return "NONE";
}

function buildChartUrl(r: LivePair): string {
  const base  = r.symbol.replace(/USDT$/, "").replace(/-PERP$/, "").replace(/PERP$/, "");
  const ex    = r.exchange.startsWith("Bybit") ? "BYBIT" : "BINANCE";
  const quote = r.type === "FUTURES" ? "USDT" : "USD";
  return `https://gocharting.com/terminal?ticker=${ex}:${base}${quote}`;
}

function buildPrompt(r: LivePair, signal: string): string {
  const base = r.symbol.replace(/USDT$/, "").replace(/-PERP$/, "").replace(/PERP$/, "");
  const trend = getTrend(r.priceChangePct);
  const sl = signal === "SHORT_SQUEEZE" ? "Short Squeeze" : signal === "LONG_SQUEEZE" ? "Long Squeeze" : "Qualified Setup";
  return `You are a professional crypto trading analyst. Analyze the following LIVE scanner data for ${base}/USDT and deliver a structured trading edge analysis. Be direct and practical.

LIVE MARKET DATA:
- Symbol: ${base}/USDT (${r.type}) on ${r.exchange}
- Signal: ${sl}
- Trend: ${trend}
- 24h Price Change: ${fmtChg(r.priceChangePct)}
- 24h Volume: ${fmtVol(r.vol24h)}
${r.fundingRate != null ? `- Funding Rate: ${fmtFund(r.fundingRate)}` : "- Funding Rate: N/A (spot)"}
${r.openInterest != null ? `- Open Interest: ${fmtOI(r.openInterest)}` : ""}

Respond with these exact section headers:
**SIGNAL BREAKDOWN**
**THE EDGE**
**DIRECTIONAL BIAS**
**KEY RISKS**
**SUGGESTED APPROACH**

Under 380 words. Be sharp and specific.`;
}

const DEFAULT_CFG: Cfg = {
  marketType: "ALL",
  spotVolMin: 5,
  futVolMin: 20,
  changeMin: 3,
  changeMax: 30,
  oiMin: 0,
  allowSideways: false,
  fundingFilter: true,
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="pill-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="pill-track" /><div className="pill-thumb" />
    </label>
  );
}

function SignalBadge({ signal }: { signal: string }) {
  if (signal === "SHORT_SQUEEZE") return <span className="signal signal-ss">⚡ Short Squeeze</span>;
  if (signal === "LONG_SQUEEZE")  return <span className="signal signal-ls">⚡ Long Squeeze</span>;
  return <span className="signal signal-none">—</span>;
}

function AiPanel({ pair, signal, isOpen }: { pair: LivePair; signal: string; isOpen: boolean }) {
  const [status, setStatus]   = useState("idle");
  const [content, setContent] = useState("");
  const base = pair.symbol.replace(/USDT$/, "").replace(/-PERP$/, "").replace(/PERP$/, "");

  useEffect(() => {
    if (!isOpen || status !== "idle") return;
    setStatus("loading");
    (async () => {
      try {
        const res  = await fetch("/api/analyze", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: buildPrompt(pair, signal) }),
        });
        const data = await res.json();
        setContent(data.text || "No analysis returned.");
        setStatus("done");
      } catch {
        setContent("Unable to load analysis. Please try again.");
        setStatus("error");
      }
    })();
  }, [isOpen]);

  const renderContent = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <span key={i} className="ai-section-head">{p.slice(2, -2)}</span>
        : <span key={i}>{p}</span>
    );

  return (
    <div className={`ai-panel${isOpen ? " open" : ""}`}>
      <div className="ai-panel-inner">
        <div className="ai-panel-top">
          <div className="ai-panel-title">
            <div className="ai-panel-icon">🤖</div>
            <div>
              <div className="ai-panel-name">AI Edge Analysis</div>
              <div className="ai-panel-sub">{base}/USDT · {pair.type} · {pair.exchange}</div>
            </div>
          </div>
          <a className="ai-chart-btn" href={buildChartUrl(pair)} target="_blank" rel="noopener noreferrer">↗ GoCharting</a>
        </div>
        {status === "loading" && <div className="ai-loading"><div className="ai-spinner" />Analyzing {base}/USDT…</div>}
        {(status === "done" || status === "error") && <div className="ai-content">{renderContent(content)}</div>}
        {status === "done" && <div className="ai-footer">⚠️ For informational purposes only. Not financial advice.</div>}
      </div>
    </div>
  );
}

function DykScreen({ statusText, exStates, totalFetched }: {
  statusText: string; exStates: Record<string, ExState>; totalFetched: number;
}) {
  const [idx, setIdx]   = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx(i => (i + 1) % DYK_FACTS.length); setShow(true); }, 500);
    }, 5500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="dyk-screen">
      <div className="dyk-spinner-wrap"><div className="dyk-spinner" /></div>
      <div className="dyk-status">Fetching live market data…</div>
      <div className="dyk-substatus">
        {statusText}{totalFetched > 0 ? ` · ${totalFetched.toLocaleString()} pairs loaded` : ""}
      </div>
      <div className="dyk-exchange-row">
        {EXCHANGES.map(ex => {
          const s = exStates[ex] ?? "pending";
          return (
            <div key={ex} className={`dyk-exchange-pill ${s === "error" ? "done" : s}`}>
              <div className={`dyk-ex-dot${s === "active" ? " spinning" : ""}`} />
              {ex}{s === "done" ? " ✓" : s === "error" ? " ✗" : ""}
            </div>
          );
        })}
      </div>
      <div className="dyk-card" style={{ opacity: show ? 1 : 0 }}>
        <div className="dyk-label">💡 Did You Know?</div>
        <div className="dyk-fact" dangerouslySetInnerHTML={{ __html: DYK_FACTS[idx] }} />
      </div>
      <div className="dyk-dots">
        {DYK_FACTS.map((_, i) => <div key={i} className={`dyk-dot${i === idx ? " active" : ""}`} />)}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CryptoScanner() {
  const [theme, setTheme]           = useState("dark");
  const [phase, setPhase]           = useState("idle");
  const [allPairs, setAllPairs]     = useState<LivePair[]>([]);
  const [results, setResults]       = useState<LivePair[]>([]);
  const [filter, setFilter]         = useState("ALL");
  const [scanCount, setScanCount]   = useState(0);
  const [lastScan, setLastScan]     = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cfg, setCfg]               = useState<Cfg>(DEFAULT_CFG);
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});
  const [statusText, setStatusText] = useState("");
  const [exStates, setExStates]     = useState<Record<string, ExState>>({});
  const [totalFetched, setTotalFetched] = useState(0);
  const [scanError, setScanError]   = useState<string | null>(null);

  const upd = (k: string, v: unknown) => setCfg(p => ({ ...p, [k]: v }));
  const togglePanel = (key: string) => setOpenPanels(p => ({ ...p, [key]: !p[key] }));
  const setEx = (ex: string, s: ExState) => setExStates(p => ({ ...p, [ex]: s }));

  const handleScan = async () => {
    if (phase === "scanning") return;
    setPhase("scanning");
    setResults([]); setAllPairs([]); setOpenPanels({}); setTotalFetched(0); setScanError(null);
    const init: Record<string, ExState> = {};
    EXCHANGES.forEach(e => { init[e] = "pending"; });
    setExStates(init);

    try {
      EXCHANGES.forEach(e => setEx(e, "active"));
      setStatusText("Fetching live data from exchanges…");

      const res  = await fetch("/api/pairs");
      const data = await res.json() as { pairs: LivePair[]; errors: string[]; total: number };

      EXCHANGES.forEach(e => setEx(e, "done"));
      setTotalFetched(data.total);

      if (data.errors.length > 0 && data.total === 0) {
        setScanError(`Could not reach exchanges: ${data.errors.join(" | ")}`);
        setPhase("done");
        return;
      }

      if (data.errors.length > 0) {
        setScanError(`Some exchanges failed (${data.errors.length}): ${data.errors.join(" · ")} — showing results from remaining exchanges.`);
      }

      setStatusText("Applying filters…");
      const filtered = applyFilters(data.pairs, cfg);
      setAllPairs(data.pairs);
      setResults(filtered);
      setScanCount(c => c + 1);
      setLastScan(new Date().toTimeString().slice(0, 8));
    } catch {
      setScanError("Scan failed — could not reach /api/pairs. Check your deployment.");
      EXCHANGES.forEach(e => setEx(e, "error"));
    }

    setPhase("done");
  };

  const displayed = filter === "ALL" ? results : results.filter(r => r.type === filter);
  const upCount   = results.filter(r => getTrend(r.priceChangePct) === "UPTREND").length;
  const downCount = results.filter(r => getTrend(r.priceChangePct) === "DOWNTREND").length;

  return (
    <>
      <style>{STYLE}</style>
      <div className={`app${theme === "light" ? " light" : ""}`}>

        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo">C</div>
            <div className="nav-title">Crypto<span>Scan</span></div>
          </div>
          <div className="nav-right">
            <div className="live-pill"><div className="live-dot" />Live</div>
            <button className="theme-btn" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>

        <div className="page">
          <div className="hero">
            <div className="hero-badge">✦ Real-time Market Scanner</div>
            <h1 className="hero-title">Find Your Next <span>Trading Edge</span></h1>
            <p className="hero-sub">Live data from Binance & Bybit. Filter all USDT pairs by real volume, price change, and funding rate to surface high-probability setups.</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Pairs Scanned</div>
              <div className="stat-value accent">{phase === "done" ? allPairs.length.toLocaleString() : "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Scans</div>
              <div className="stat-value">{scanCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Results Found</div>
              <div className="stat-value green">{phase === "done" ? results.length : "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Last Scan</div>
              <div className="stat-value" style={{ fontSize: 14 }}>{lastScan || "—"}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-card">
            <div className="filter-header" onClick={() => setSettingsOpen(o => !o)}>
              <div className="filter-header-left">
                <div className="filter-icon">⚙️</div>
                <div>
                  <div className="filter-title">Filter Settings</div>
                  <div className="filter-subtitle">All values based on live market data</div>
                </div>
              </div>
              <div className={`filter-chevron${settingsOpen ? " open" : ""}`}>▼</div>
            </div>
            {settingsOpen && (
              <>
                <div className="filter-divider" />
                <div className="filter-body">

                  {/* Core */}
                  <div className="filter-group">
                    <div className="filter-section-title">Core Filters <span className="live-badge">● LIVE</span></div>
                    <div className="filter-item">
                      <div className="filter-item-label">Market Type</div>
                      <select className="f-input" value={cfg.marketType} onChange={e => upd("marketType", e.target.value)}>
                        <option value="ALL">All Markets</option>
                        <option value="SPOT">Spot Only</option>
                        <option value="FUTURES">Futures Only</option>
                      </select>
                    </div>
                    <div className="filter-item">
                      <div className="filter-item-label">Min 24h Volume — Spot</div>
                      <div className="f-row"><input className="f-input" type="number" min="0" value={cfg.spotVolMin} onChange={e => upd("spotVolMin", +e.target.value)} /><span className="f-unit">$M</span></div>
                    </div>
                    <div className="filter-item">
                      <div className="filter-item-label">Min 24h Volume — Futures</div>
                      <div className="f-row"><input className="f-input" type="number" min="0" value={cfg.futVolMin} onChange={e => upd("futVolMin", +e.target.value)} /><span className="f-unit">$M</span></div>
                    </div>
                    <div className="filter-item">
                      <div className="filter-item-label">24h Price Change Range</div>
                      <div className="f-row">
                        <input className="f-input" type="number" min="0" value={cfg.changeMin} onChange={e => upd("changeMin", +e.target.value)} style={{ width: 70 }} />
                        <span className="f-unit">% to</span>
                        <input className="f-input" type="number" min="0" value={cfg.changeMax} onChange={e => upd("changeMax", +e.target.value)} style={{ width: 70 }} />
                        <span className="f-unit">%</span>
                      </div>
                    </div>
                    <div className="toggle-row">
                      <div className="toggle-info">
                        <div className="toggle-label">Include Sideways Pairs</div>
                        <div className="toggle-desc">Show pairs with &lt;3% price change</div>
                      </div>
                      <Toggle checked={cfg.allowSideways} onChange={v => upd("allowSideways", v)} />
                    </div>
                  </div>

                  {/* Funding */}
                  <div className="filter-group">
                    <div className="filter-section-title">Funding Rate Filter <span className="live-badge">● LIVE</span></div>
                    <div className="toggle-row">
                      <div className="toggle-info">
                        <div className="toggle-label">Squeeze Detection</div>
                        <div className="toggle-desc">Find overcrowded futures positions about to reverse</div>
                      </div>
                      <Toggle checked={cfg.fundingFilter} onChange={v => upd("fundingFilter", v)} />
                    </div>
                    <div className="filter-item" style={{ marginTop: 8 }}>
                      <div className="filter-item-label" style={{ color: "var(--green)" }}>⚡ Short Squeeze</div>
                      <div className="filter-item-hint">Funding ≤ −0.01% + price rising. Too many shorts in a rising market — forced to buy back.</div>
                    </div>
                    <div className="filter-item">
                      <div className="filter-item-label" style={{ color: "var(--red)" }}>⚡ Long Squeeze</div>
                      <div className="filter-item-hint">Funding ≥ +0.01% + price falling. Too many longs in a falling market — forced to sell.</div>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Active chips */}
          <div className="active-filters">
            <div className="filter-chip on"><div className="filter-chip-dot" />Vol ≥ ${cfg.spotVolMin}M</div>
            <div className="filter-chip on"><div className="filter-chip-dot" />Change {cfg.changeMin}–{cfg.changeMax}%</div>
            <div className={`filter-chip${cfg.fundingFilter ? " on" : ""}`}><div className="filter-chip-dot" />Squeeze Detection {cfg.fundingFilter ? "On" : "Off"}</div>
            <div className={`filter-chip${!cfg.allowSideways ? " on" : ""}`}><div className="filter-chip-dot" />Trending Only {!cfg.allowSideways ? "On" : "Off"}</div>
          </div>

          <div className="scan-section">
            <button className={`scan-btn${phase === "scanning" ? " scanning" : ""}`} onClick={handleScan} disabled={phase === "scanning"}>
              {phase === "scanning" ? "⟳  Scanning..." : "⚡  Scan Market"}
            </button>
            <div className="scan-info">
              {scanCount > 0 && <>Scans: <span>{scanCount}</span></>}
              {lastScan && <> · Last: <span>{lastScan}</span></>}
            </div>
          </div>

          {phase === "idle" && (
            <div className="idle-state">
              <div className="idle-icon">🔍</div>
              <div className="idle-title">Ready to Scan</div>
              <div className="idle-sub">Configure your filters and hit Scan Market. All data is fetched live from Binance & Bybit.</div>
            </div>
          )}

          {phase === "scanning" && (
            <DykScreen statusText={statusText} exStates={exStates} totalFetched={totalFetched} />
          )}

          {phase === "done" && (
            <>
              {scanError && <div className="error-banner">⚠️ {scanError}</div>}
              <div className="results-bar">
                <div>
                  <div className="results-title">Results</div>
                  <div className="results-sub">↑ {upCount} uptrend · ↓ {downCount} downtrend · {allPairs.length.toLocaleString()} pairs scanned</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div className="tabs">
                    {["ALL", "SPOT", "FUTURES"].map(f => (
                      <button key={f} className={`tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                  </div>
                  <div className="results-badge">{displayed.length}<span>pairs</span></div>
                </div>
              </div>

              {displayed.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📡</div>
                  <div className="empty-title">No pairs matched</div>
                  <div className="empty-sub">Try relaxing the filters — lower the min volume, widen the price change range, or turn off Squeeze Detection.</div>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="table-card">
                    <div className="t-head">
                      {["Pair", "Type", "24h Volume", "24h Change", "Funding Rate", "Open Interest", "Trend", "Signal", "AI"].map(h => (
                        <div key={h} className="t-th">{h}</div>
                      ))}
                    </div>
                    {displayed.map((r, i) => {
                      const base      = r.symbol.replace(/USDT$/, "").replace(/-PERP$/, "").replace(/PERP$/, "");
                      const signal    = getSignal(r, cfg);
                      const chartUrl  = buildChartUrl(r);
                      const key       = r.symbol + r.exchange;
                      const panelOpen = !!openPanels[key];
                      const trend     = getTrend(r.priceChangePct);
                      const isUp      = trend === "UPTREND";
                      return (
                        <div key={key} className="row-wrap" style={{ animationDelay: `${i * 20}ms` }}>
                          <div className="t-row">
                            <a href={chartUrl} target="_blank" rel="noopener noreferrer" style={{ display: "contents", textDecoration: "none", color: "inherit" }}>
                              <div>
                                <div className="pair-name"><span className="pair-base">{base}</span>/USDT</div>
                                <div className="pair-exch">{r.exchange}</div>
                              </div>
                              <div><span className={`badge badge-${r.type.toLowerCase()}`}>{r.type === "SPOT" ? "Spot" : "Perp"}</span></div>
                              <div className="t-cell mono">{fmtVol(r.vol24h)}</div>
                              <div className={`t-cell mono ${r.priceChangePct >= 0 ? "up" : "down"}`}>{fmtChg(r.priceChangePct)}</div>
                              <div className="t-cell">
                                {r.fundingRate != null
                                  ? <span className={`badge ${r.fundingRate <= -0.01 ? "badge-up" : r.fundingRate >= 0.01 ? "badge-down" : "badge-neutral"}`}>{fmtFund(r.fundingRate)}</span>
                                  : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>}
                              </div>
                              <div className="t-cell mono">{fmtOI(r.openInterest)}</div>
                              <div>
                                <div className="trend-wrap">
                                  <div className="trend-bar-bg"><div className={`trend-bar-fill fill-${isUp ? "up" : "down"}`} /></div>
                                  <span className={`trend-label ${isUp ? "up" : "down"}`}>{isUp ? "↑ Up" : "↓ Down"}</span>
                                </div>
                              </div>
                              <div><SignalBadge signal={signal} /></div>
                            </a>
                            <button className={`ai-btn${panelOpen ? " active" : ""}`} onClick={() => togglePanel(key)}>🤖</button>
                          </div>
                          <AiPanel pair={r} signal={signal} isOpen={panelOpen} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile cards */}
                  <div className="cards-list">
                    {displayed.map((r, i) => {
                      const base      = r.symbol.replace(/USDT$/, "").replace(/-PERP$/, "").replace(/PERP$/, "");
                      const signal    = getSignal(r, cfg);
                      const chartUrl  = buildChartUrl(r);
                      const key       = r.symbol + r.exchange;
                      const panelOpen = !!openPanels[key];
                      const trend     = getTrend(r.priceChangePct);
                      const isUp      = trend === "UPTREND";
                      return (
                        <div key={key} className="m-card" style={{ animationDelay: `${i * 20}ms` }}>
                          <a className="m-card-link" href={chartUrl} target="_blank" rel="noopener noreferrer">
                            <div className="m-card-top">
                              <div>
                                <div className="m-card-pair"><span>{base}</span>/USDT</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{r.exchange}</div>
                                <div className="m-card-badges">
                                  <span className={`badge badge-${r.type.toLowerCase()}`}>{r.type === "SPOT" ? "Spot" : "Perp"}</span>
                                  <SignalBadge signal={signal} />
                                </div>
                              </div>
                              <div className={`t-cell mono ${r.priceChangePct >= 0 ? "up" : "down"}`} style={{ fontSize: 16, fontWeight: 700 }}>{fmtChg(r.priceChangePct)}</div>
                            </div>
                            <div className="m-card-grid">
                              <div><div className="m-cell-label">24h Volume</div><div className="m-cell-value">{fmtVol(r.vol24h)}</div></div>
                              <div><div className="m-cell-label">Trend</div><div className={`m-cell-value ${isUp ? "up" : "down"}`}>{isUp ? "↑ Uptrend" : "↓ Downtrend"}</div></div>
                              {r.fundingRate != null && <div><div className="m-cell-label">Funding Rate</div><div className="m-cell-value">{fmtFund(r.fundingRate)}</div></div>}
                              {r.openInterest != null && <div><div className="m-cell-label">Open Interest</div><div className="m-cell-value">{fmtOI(r.openInterest)}</div></div>}
                            </div>
                            <div className="m-card-footer">
                              <a className="m-chart-link" href={chartUrl} target="_blank" rel="noopener noreferrer">↗ Open GoCharting</a>
                            </div>
                          </a>
                          <div style={{ padding: "0 16px 12px" }}>
                            <button className={`m-ai-btn${panelOpen ? " active" : ""}`} onClick={() => togglePanel(key)}>
                              🤖 {panelOpen ? "Hide Analysis" : "Get AI Analysis"}
                            </button>
                          </div>
                          <div className={`m-ai-panel${panelOpen ? " open" : ""}`}>
                            <div className="m-ai-inner">
                              <AiPanel pair={r} signal={signal} isOpen={panelOpen} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          <div className="footer">CryptoScan Pro · Live data from Binance & Bybit · Not financial advice</div>
        </div>
      </div>
    </>
  );
}