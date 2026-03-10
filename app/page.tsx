"use client";
import { useState, useEffect, useRef } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Chakra+Petch:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:#040a0f; --panel:#070e14; --border:#0d2033; --border-bright:#0f3352;
    --accent:#00d4ff; --accent2:#00cc7a; --accent3:#ff6b35; --danger:#ff2d55;
    --muted:#2a4a60; --text:#c8dde8; --text-dim:#4a7a95; --text-bright:#e8f4f8;
    --up:#00cc7a; --down:#ff2d55;
    --term-bg:#020609; --row-hover:rgba(0,212,255,0.07);
    --thead-bg:#050d13;
    --tog-bg:#0a1a26; --tog-border:#00d4ff; --tog-color:#00d4ff;
    --ai-bg:#040f18; --ai-border:#0a2535;
  }
  .light {
    --bg:#f0f4f8; --panel:#fff; --border:#c8d8e8; --border-bright:#a0bdd0;
    --accent:#0066aa; --accent2:#007a48; --accent3:#c04a00; --danger:#c0003a;
    --muted:#88aabf; --text:#1a3a52; --text-dim:#5580a0; --text-bright:#061826;
    --up:#007a48; --down:#c0003a;
    --term-bg:#e4eef8; --row-hover:rgba(0,102,170,0.06);
    --thead-bg:#e0ecf8;
    --tog-bg:#0066aa; --tog-border:#0066aa; --tog-color:#fff;
    --ai-bg:#e8f4ff; --ai-border:#b8d4ec;
  }

  html { font-size:16px; }
  body { background:var(--bg); font-family:'Space Mono',monospace; color:var(--text); -webkit-text-size-adjust:100%; }

  .wrap { min-height:100vh; background:var(--bg); position:relative; overflow-x:hidden; transition:background .3s; }
  .wrap::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:100; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,255,.012) 2px,rgba(0,212,255,.012) 4px); }
  .light .wrap::before { display:none; }
  .bg-grid { position:fixed; inset:0; pointer-events:none; background-image:linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px); background-size:40px 40px; }
  .light .bg-grid { background-image:linear-gradient(rgba(0,102,170,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,170,.05) 1px,transparent 1px); }
  .container { max-width:1200px; margin:0 auto; padding:16px; position:relative; z-index:1; }

  /* Header */
  .header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--border); }
  .logo-tag { font-family:'Chakra Petch',sans-serif; font-size:9px; font-weight:600; letter-spacing:3px; color:var(--accent); text-transform:uppercase; margin-bottom:5px; }
  .logo-title { font-family:'Chakra Petch',sans-serif; font-size:clamp(18px,4vw,26px); font-weight:700; color:var(--text-bright); line-height:1; }
  .logo-title span { color:var(--accent); }
  .logo-sub { font-size:clamp(8px,1.5vw,10px); color:var(--text-dim); margin-top:5px; letter-spacing:1px; }
  .header-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; }
  .header-top-row { display:flex; align-items:center; gap:10px; }
  .theme-toggle { display:inline-flex; align-items:center; gap:6px; background:var(--tog-bg); border:1.5px solid var(--tog-border); color:var(--tog-color); font-family:'Chakra Petch',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; padding:6px 14px; cursor:pointer; transition:opacity .2s; white-space:nowrap; clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%); }
  .theme-toggle:hover { opacity:.8; }
  .live-dot { display:flex; align-items:center; gap:6px; font-size:9px; color:var(--text-dim); letter-spacing:2px; }
  .live-dot::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--accent2); box-shadow:0 0 8px var(--accent2); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .clock { font-size:10px; color:var(--text-dim); }

  /* Settings */
  .settings-panel { background:var(--panel); border:1px solid var(--border); margin-bottom:14px; }
  .settings-header { display:flex; align-items:center; justify-content:space-between; padding:11px 16px; cursor:pointer; user-select:none; border-bottom:1px solid transparent; transition:border-color .2s; }
  .settings-header.open { border-bottom-color:var(--border); }
  .settings-header:hover { background:var(--row-hover); }
  .settings-title { font-family:'Chakra Petch',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; color:var(--accent); text-transform:uppercase; }
  .settings-chevron { font-size:10px; color:var(--text-dim); letter-spacing:1px; }
  .settings-body { padding:16px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  @media(max-width:700px){ .settings-body { grid-template-columns:1fr; } }
  .setting-group { display:flex; flex-direction:column; gap:10px; }
  .setting-group-label { font-size:9px; letter-spacing:2.5px; color:var(--accent); text-transform:uppercase; font-weight:700; border-bottom:1px solid var(--border); padding-bottom:6px; }
  .setting-row { display:flex; flex-direction:column; gap:4px; }
  .setting-label { font-size:10px; color:var(--text-dim); letter-spacing:1px; }
  .setting-sublabel { font-size:9px; color:var(--muted); line-height:1.5; }
  .toggle-switch { display:flex; align-items:center; gap:10px; }
  .switch { position:relative; width:34px; height:17px; flex-shrink:0; }
  .switch input { opacity:0; width:0; height:0; }
  .slider { position:absolute; inset:0; background:var(--border); cursor:pointer; border:1px solid var(--border-bright); transition:.2s; }
  .slider::before { content:''; position:absolute; height:11px; width:11px; left:2px; bottom:2px; background:var(--text-dim); transition:.2s; }
  input:checked + .slider { background:rgba(0,212,255,.15); border-color:var(--accent); }
  input:checked + .slider::before { transform:translateX(17px); background:var(--accent); }
  .switch-label { font-size:11px; color:var(--text); }
  .select-input,.number-input { background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:'Space Mono',monospace; font-size:10px; padding:6px 10px; outline:none; width:100%; transition:border-color .2s; }
  .select-input:focus,.number-input:focus { border-color:var(--accent); }
  .select-input option { background:var(--bg); }
  .input-row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .input-unit { font-size:10px; color:var(--text-dim); white-space:nowrap; }

  /* Criteria */
  .criteria-bar { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:14px; }
  @media(max-width:900px){ .criteria-bar { grid-template-columns:repeat(3,1fr); } }
  @media(max-width:500px){ .criteria-bar { grid-template-columns:repeat(2,1fr); } }
  .criterion { background:var(--panel); border:1px solid var(--border); border-top:2px solid var(--accent); padding:9px 11px; }
  .criterion.inactive { border-top-color:var(--muted); opacity:.5; }
  .criterion-label { font-size:8px; color:var(--text-dim); letter-spacing:2px; text-transform:uppercase; margin-bottom:3px; }
  .criterion-value { font-family:'Chakra Petch',sans-serif; font-size:11px; font-weight:600; color:var(--accent); }
  .criterion.inactive .criterion-value { color:var(--muted); }
  .criterion-sub { font-size:8px; color:var(--text-dim); margin-top:2px; }

  /* Scan bar */
  .scan-area { display:flex; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
  .scan-btn { background:transparent; border:1px solid var(--accent); color:var(--accent); font-family:'Chakra Petch',sans-serif; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:12px 28px; cursor:pointer; transition:all .2s; clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%); position:relative; overflow:hidden; white-space:nowrap; }
  .scan-btn::before { content:''; position:absolute; inset:0; background:var(--accent); opacity:0; transition:opacity .2s; }
  .scan-btn:hover::before { opacity:.1; }
  .scan-btn:hover { box-shadow:0 0 24px rgba(0,212,255,.3); color:var(--text-bright); }
  .scan-btn:active { transform:scale(.98); }
  .scan-btn.scanning { border-color:var(--accent2); color:var(--accent2); animation:scanP .8s ease infinite; }
  @keyframes scanP { 0%,100%{box-shadow:0 0 18px rgba(0,204,122,.25)} 50%{box-shadow:0 0 36px rgba(0,204,122,.5)} }
  .scan-btn-text { position:relative; z-index:1; }
  .progress-wrap { flex:1; min-width:80px; height:2px; background:var(--border); overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition:width .1s linear; box-shadow:0 0 8px var(--accent); }
  .scan-meta { font-size:10px; color:var(--text-dim); letter-spacing:1px; white-space:nowrap; }
  .scan-meta span { color:var(--accent2); }

  /* Terminal */
  .terminal { background:var(--term-bg); border:1px solid var(--border); border-left:2px solid var(--accent); padding:10px 14px; margin-bottom:14px; height:82px; overflow-y:auto; font-size:10px; }
  .terminal::-webkit-scrollbar { width:3px; }
  .terminal::-webkit-scrollbar-thumb { background:var(--border-bright); }
  .log-line { line-height:1.9; opacity:0; animation:fadeIn .3s forwards; }
  @keyframes fadeIn { to{opacity:1} }
  .log-time { color:var(--muted); margin-right:7px; }
  .log-ok{color:var(--accent2);} .log-info{color:var(--accent);} .log-err{color:var(--danger);} .log-warn{color:var(--accent3);}

  /* Results header */
  .results-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
  .results-label { font-family:'Chakra Petch',sans-serif; font-size:10px; font-weight:600; letter-spacing:3px; color:var(--text-dim); text-transform:uppercase; }
  .results-stats { font-size:9px; color:var(--text-dim); margin-top:3px; }
  .results-count { font-family:'Chakra Petch',sans-serif; font-size:20px; font-weight:700; color:var(--accent2); }
  .results-count span { font-size:10px; color:var(--text-dim); margin-left:4px; }
  .filter-tabs { display:flex; gap:5px; flex-wrap:wrap; }
  .filter-tab { background:transparent; border:1px solid var(--border); color:var(--text-dim); font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1px; padding:5px 12px; cursor:pointer; transition:all .15s; text-transform:uppercase; }
  .filter-tab.active,.filter-tab:hover { border-color:var(--accent); color:var(--accent); background:rgba(0,212,255,.05); }

  /* Table */
  .table-wrap { border:1px solid var(--border); overflow:hidden; }
  .table-head { display:grid; grid-template-columns:120px 60px 90px 80px 68px 95px 95px 110px 85px 38px; background:var(--thead-bg); border-bottom:1px solid var(--border-bright); padding:9px 12px; gap:6px; }
  .th { font-size:8px; letter-spacing:2px; color:var(--text-dim); text-transform:uppercase; }

  /* Row wrapper — holds the data row + AI panel */
  .row-wrap { border-bottom:1px solid var(--border); }
  .row-wrap:last-child { border-bottom:none; }

  .result-row {
    display:grid; grid-template-columns:120px 60px 90px 80px 68px 95px 95px 110px 85px 38px;
    padding:11px 12px; gap:6px;
    transition:background .15s; animation:rowIn .4s ease both;
    align-items:center; text-decoration:none; color:inherit;
  }
  .result-row:hover { background:var(--row-hover); }
  @keyframes rowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

  /* AI button inside table row */
  .ai-btn {
    display:flex; align-items:center; justify-content:center;
    width:28px; height:28px; border-radius:2px;
    background:rgba(0,212,255,.07); border:1px solid rgba(0,212,255,.25);
    color:var(--accent); cursor:pointer; font-size:13px;
    transition:all .2s; flex-shrink:0;
  }
  .ai-btn:hover { background:rgba(0,212,255,.15); border-color:var(--accent); box-shadow:0 0 10px rgba(0,212,255,.2); }
  .ai-btn.active { background:rgba(0,212,255,.18); border-color:var(--accent); color:var(--accent2); }

  /* AI Panel */
  .ai-panel {
    background:var(--ai-bg);
    border-top:1px solid var(--ai-border);
    border-left:3px solid var(--accent);
    padding:0;
    overflow:hidden;
    max-height:0;
    transition:max-height .35s ease, padding .35s ease;
  }
  .ai-panel.open {
    max-height:600px;
    padding:16px;
  }

  .ai-panel-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:12px; flex-wrap:wrap; gap:8px;
  }
  .ai-panel-title {
    display:flex; align-items:center; gap:8px;
    font-family:'Chakra Petch',sans-serif; font-size:11px; font-weight:700;
    letter-spacing:2px; color:var(--accent); text-transform:uppercase;
  }
  .ai-icon-spin { animation:spin .8s linear infinite; display:inline-block; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .ai-pair-tag { font-size:10px; color:var(--text-dim); letter-spacing:1px; }

  .ai-content {
    font-size:11.5px; line-height:1.85; color:var(--text);
    white-space:pre-wrap; word-break:break-word;
  }
  .ai-content .ai-cursor {
    display:inline-block; width:7px; height:13px;
    background:var(--accent); margin-left:2px; vertical-align:middle;
    animation:blink .7s step-end infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  .ai-section-head {
    font-family:'Chakra Petch',sans-serif; font-size:10px; font-weight:700;
    letter-spacing:2px; color:var(--accent2); text-transform:uppercase;
    margin-top:12px; margin-bottom:4px; display:block;
  }

  .ai-footer {
    margin-top:12px; padding-top:10px; border-top:1px solid var(--ai-border);
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;
  }
  .ai-disclaimer { font-size:9px; color:var(--muted); letter-spacing:.5px; }
  .ai-chart-link {
    font-size:9px; color:var(--accent); text-decoration:none; letter-spacing:1px;
    border:1px solid rgba(0,212,255,.3); padding:3px 10px;
    transition:all .15s;
  }
  .ai-chart-link:hover { background:rgba(0,212,255,.08); }

  /* Mobile cards */
  .cards-list { display:none; flex-direction:column; gap:10px; }
  .pair-card { background:var(--panel); border:1px solid var(--border); border-left:3px solid var(--accent2); overflow:hidden; animation:rowIn .4s ease both; }
  .card-inner { padding:14px; text-decoration:none; color:inherit; display:block; transition:background .15s; }
  .card-inner:hover { background:var(--row-hover); }
  .card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; gap:8px; flex-wrap:wrap; }
  .card-pair { font-family:'Chakra Petch',sans-serif; font-size:16px; font-weight:700; color:var(--text-bright); }
  .card-pair span { color:var(--accent); }
  .card-badges { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .card-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 14px; margin-bottom:10px; }
  .card-cell { display:flex; flex-direction:column; gap:2px; }
  .card-cell-label { font-size:8px; letter-spacing:2px; color:var(--text-dim); text-transform:uppercase; }
  .card-cell-value { font-size:12px; font-family:'Space Mono',monospace; color:var(--text); }
  .card-bottom { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; padding-top:8px; border-top:1px solid var(--border); }

  /* AI button for mobile card */
  .card-ai-btn {
    display:flex; align-items:center; gap:6px;
    background:rgba(0,212,255,.07); border:1px solid rgba(0,212,255,.25);
    color:var(--accent); cursor:pointer;
    font-family:'Chakra Petch',sans-serif; font-size:10px; font-weight:700; letter-spacing:1.5px;
    padding:6px 14px; transition:all .2s; text-transform:uppercase; width:100%; justify-content:center;
    margin-top:10px;
  }
  .card-ai-btn:hover { background:rgba(0,212,255,.14); border-color:var(--accent); }
  .card-ai-btn.active { color:var(--accent2); border-color:var(--accent2); background:rgba(0,204,122,.07); }

  /* Mobile AI panel */
  .card-ai-panel {
    background:var(--ai-bg); border-top:1px solid var(--ai-border);
    border-left:3px solid var(--accent);
    max-height:0; overflow:hidden; transition:max-height .35s ease, padding .35s ease; padding:0 14px;
  }
  .card-ai-panel.open { max-height:600px; padding:14px; }

  @media(max-width:860px) {
    .table-wrap { display:none; }
    .cards-list { display:flex; }
  }

  /* Shared badges */
  .pair-name { font-family:'Chakra Petch',sans-serif; font-size:13px; font-weight:700; color:var(--text-bright); }
  .pair-base { color:var(--accent); }
  .market-badge { display:inline-block; font-size:8px; letter-spacing:1.5px; padding:3px 7px; font-weight:700; text-transform:uppercase; clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%); }
  .market-badge.spot { background:rgba(0,212,255,.1); color:var(--accent); border:1px solid rgba(0,212,255,.3); }
  .market-badge.futures { background:rgba(255,107,53,.1); color:var(--accent3); border:1px solid rgba(255,107,53,.3); }
  .td { font-size:11px; color:var(--text); }
  .td.mono { font-family:'Space Mono',monospace; }
  .change-up{color:var(--up);font-weight:700;} .change-down{color:var(--down);font-weight:700;}
  .fund-badge { display:inline-flex; align-items:center; font-size:10px; font-weight:700; padding:2px 6px; border:1px solid; font-family:'Space Mono',monospace; }
  .fund-short{color:var(--down);border-color:var(--down);background:rgba(255,45,85,.07);}
  .fund-long{color:var(--up);border-color:var(--up);background:rgba(0,204,122,.07);}
  .fund-neutral{color:var(--text-dim);border-color:var(--border);}
  .vol-badge{font-size:10px;font-weight:700;font-family:'Chakra Petch',sans-serif;letter-spacing:1px;}
  .vol-high{color:var(--accent2);} .vol-med{color:var(--accent3);} .vol-norm{color:var(--text-dim);}
  .trend-badge{display:flex;align-items:center;gap:5px;font-family:'Chakra Petch',sans-serif;font-size:11px;font-weight:600;letter-spacing:1px;}
  .trend-up{color:var(--up);} .trend-down{color:var(--down);}
  .trend-bar{width:20px;height:3px;background:var(--border);overflow:hidden;flex-shrink:0;}
  .trend-fill-up{height:100%;background:var(--up);box-shadow:0 0 6px var(--up);width:100%;}
  .trend-fill-down{height:100%;background:var(--down);box-shadow:0 0 6px var(--down);width:100%;}
  .atr-tag{font-size:8px;color:var(--accent3);margin-left:2px;}
  .signal-chip{display:inline-flex;align-items:center;gap:3px;font-family:'Chakra Petch',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;padding:3px 7px;border:1px solid;}
  .signal-squeeze-short{color:var(--up);border-color:var(--up);background:rgba(0,204,122,.08);}
  .signal-squeeze-long{color:var(--down);border-color:var(--down);background:rgba(255,45,85,.08);}
  .signal-breakout{color:var(--accent3);border-color:var(--accent3);background:rgba(255,107,53,.08);}
  .signal-none{color:var(--text-dim);border-color:var(--border);}
  .chart-hint{font-size:9px;opacity:0;transition:opacity .15s;white-space:nowrap;}
  .chart-hint.gc{color:var(--accent2);} .chart-hint.tv{color:var(--accent3);}
  .result-row:hover .chart-hint{opacity:1;}
  .src-badge{display:inline-block;font-size:8px;font-weight:700;letter-spacing:1px;padding:1px 5px;border:1px solid;font-family:'Chakra Petch',sans-serif;}
  .src-badge.gc{color:var(--accent2);border-color:var(--accent2);background:rgba(0,204,122,.08);}
  .src-badge.tv{color:var(--accent3);border-color:var(--accent3);background:rgba(255,107,53,.08);}

  /* States */
  .empty-state{text-align:center;padding:50px 20px;border:1px solid var(--border);background:var(--panel);}
  .empty-icon{font-size:32px;margin-bottom:12px;opacity:.3;filter:grayscale(1);}
  .empty-title{font-family:'Chakra Petch',sans-serif;font-size:14px;color:var(--text-dim);margin-bottom:6px;letter-spacing:2px;}
  .empty-sub{font-size:10px;color:var(--muted);}
  .initial-state{text-align:center;padding:50px 20px;border:1px solid var(--border);background:var(--panel);position:relative;overflow:hidden;}
  .initial-state::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,212,255,.04) 0%,transparent 70%);}
  .radar-ring{width:72px;height:72px;border:1px solid rgba(0,212,255,.2);border-radius:50%;margin:0 auto 12px;position:relative;animation:radarSpin 4s linear infinite;}
  .radar-ring::before{content:'';position:absolute;top:4px;left:4px;right:4px;bottom:4px;border:1px solid rgba(0,212,255,.1);border-radius:50%;}
  .radar-ring::after{content:'';position:absolute;top:0;left:50%;width:50%;height:50%;background:conic-gradient(from 0deg,transparent 80%,rgba(0,212,255,.3));border-radius:0 100% 0 0;transform-origin:0% 100%;}
  @keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .initial-title{font-family:'Chakra Petch',sans-serif;font-size:14px;color:var(--text-dim);letter-spacing:4px;text-transform:uppercase;position:relative;}
  .initial-sub{font-size:10px;color:var(--muted);margin-top:9px;letter-spacing:1.5px;position:relative;}
  .scan-progress{border:1px solid var(--border);background:var(--panel);padding:36px 20px;text-align:center;}
  .scan-spinner{width:44px;height:44px;border:2px solid var(--border);border-top-color:var(--accent);border-right-color:var(--accent2);border-radius:50%;margin:0 auto 16px;animation:spin .8s linear infinite;}
  .scan-status-text{font-family:'Chakra Petch',sans-serif;font-size:12px;color:var(--accent);letter-spacing:3px;text-transform:uppercase;animation:blink 1s step-end infinite;}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
  .scan-sub-text{font-size:10px;color:var(--text-dim);margin-top:8px;letter-spacing:1px;}
  .footer{margin-top:16px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;}
  .footer-note{font-size:9px;color:var(--muted);letter-spacing:1px;}
  .footer-note span{color:var(--accent);}
`;

// ── Constants ─────────────────────────────────────────────────────────────────
const SPOT_PAIRS    = ["BTC/USDT","ETH/USDT","SOL/USDT","BNB/USDT","XRP/USDT","AVAX/USDT","DOGE/USDT","ADA/USDT","DOT/USDT","MATIC/USDT","LINK/USDT","ATOM/USDT","LTC/USDT","UNI/USDT","APT/USDT","ARB/USDT","OP/USDT","SUI/USDT","INJ/USDT","TIA/USDT","SEI/USDT","WIF/USDT","JUP/USDT","PYTH/USDT"];
const FUTURES_PAIRS = ["BTC-PERP","ETH-PERP","SOL-PERP","BNB-PERP","XRP-PERP","AVAX-PERP","DOGE-PERP","ADA-PERP","LINK-PERP","MATIC-PERP","APT-PERP","ARB-PERP","OP-PERP","SUI-PERP","INJ-PERP","TIA-PERP","WIF-PERP","JUP-PERP"];
const GC_EXCHANGES    = ["BINANCE","BYBIT","DERIBIT","EXNESS","COINBASE","BITSTAMP"];
const COINBASE_PAIRS  = ["BTC","ETH","SOL","ADA","DOT","LTC","XRP","DOGE","AVAX","LINK","UNI","ATOM"];
const BITSTAMP_PAIRS  = ["BTC","ETH","XRP","LTC","LINK"];
const DERIBIT_FUTURES = ["BTC","ETH"];

const rnd  = (lo, hi) => Math.random() * (hi - lo) + lo;
const rndN = (lo, hi) => Math.round(rnd(lo, hi) * 1000) / 1000;
const fmtVol  = m => m >= 1000 ? `$${(m/1000).toFixed(2)}B` : `$${m.toFixed(0)}M`;
const fmtChg  = v => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
const fmtFund = v => v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(3)}%`;

// ── Data generation ───────────────────────────────────────────────────────────
function generatePairs() {
  return [
    ...SPOT_PAIRS.map(s => ({ symbol:s, type:"SPOT" })),
    ...FUTURES_PAIRS.map(s => ({ symbol:s, type:"FUTURES" })),
  ].map(({ symbol, type }) => {
    const vol24h   = type === "SPOT" ? rnd(10,900) : rnd(20,2200);
    const avgVol7d = vol24h * rnd(0.4,0.9);
    const volRatio = vol24h / avgVol7d;
    const priceChange = rnd(-12,32);
    const trend = priceChange > 5 ? "UPTREND" : priceChange < -3 ? "DOWNTREND" : "SIDEWAYS";
    const baseAtr = rnd(0.4,6);
    const expanding = Math.random() > 0.45;
    const atrSeries = Array.from({length:5},(_,i) =>
      expanding ? baseAtr + i*rnd(0.1,0.4)+rnd(-0.1,0.1) : baseAtr+rnd(-0.3,0.3)
    );
    const atr = atrSeries[4];
    const prevAtrAvg = atrSeries.slice(0,4).reduce((a,b)=>a+b,0)/4;
    const atrExpansion = atr > prevAtrAvg && expanding;
    const oiChangePct  = rnd(-10,25);
    const fundingRate  = type==="FUTURES" ? rndN(-0.06,0.06) : null;
    return { symbol, type, vol24h, avgVol7d, volRatio, priceChange, trend, atr, atrExpansion, oiChangePct, fundingRate };
  });
}

function applyFilters(pairs, cfg) {
  return pairs.filter(p => {
    if (cfg.marketType !== "ALL" && p.type !== cfg.marketType) return false;
    const volMin = p.type==="SPOT" ? cfg.spotVolMin : cfg.futVolMin;
    if (p.vol24h < volMin) return false;
    const abs = Math.abs(p.priceChange);
    if (abs < cfg.changeMin || abs > cfg.changeMax) return false;
    if (p.atr < cfg.atrMin) return false;
    if (p.oiChangePct < cfg.oiMin) return false;
    if (!cfg.allowSideways && p.trend==="SIDEWAYS") return false;
    if (cfg.fundingFilter && p.type==="FUTURES") {
      const fr = p.fundingRate??0;
      if (!(fr<=-0.01 && p.trend==="UPTREND") && !(fr>=0.01 && p.trend==="DOWNTREND")) return false;
    }
    if (cfg.volExpFilter && p.volRatio < cfg.volExpMultiplier) return false;
    if (cfg.atrExpFilter && !p.atrExpansion) return false;
    return true;
  });
}

function getSignal(p, cfg) {
  if (cfg.fundingFilter && p.type==="FUTURES" && p.fundingRate!=null) {
    if (p.fundingRate<=-0.01 && p.trend==="UPTREND")  return "SHORT_SQUEEZE";
    if (p.fundingRate>=0.01  && p.trend==="DOWNTREND") return "LONG_SQUEEZE";
  }
  if (cfg.atrExpFilter && p.atrExpansion) return "BREAKOUT";
  return "NONE";
}

function buildChartUrl(r) {
  const base = r.symbol.split("/")[0].split("-")[0];
  let gcExchange;
  if (r.type==="FUTURES") {
    gcExchange = DERIBIT_FUTURES.includes(base) ? "DERIBIT" : "BYBIT";
  } else {
    gcExchange = COINBASE_PAIRS.includes(base) ? "COINBASE" : BITSTAMP_PAIRS.includes(base) ? "BITSTAMP" : "BINANCE";
  }
  const gcQuote  = r.type==="FUTURES" ? "USDT" : "USD";
  const gcUrl    = `https://gocharting.com/terminal?ticker=${gcExchange}:${base}${gcQuote}`;
  const tvExchange = r.type==="FUTURES" ? "BYBIT" : "BINANCE";
  const tvSuffix   = r.type==="FUTURES" ? "USDT.P" : "USDT";
  const tvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(`${tvExchange}:${base}${tvSuffix}`)}`;
  const useGC = GC_EXCHANGES.includes(gcExchange);
  return { url: useGC?gcUrl:tvUrl, source: useGC?"GC":"TV" };
}

// ── AI prompt builder ─────────────────────────────────────────────────────────
function buildPrompt(r, signal) {
  const base = r.symbol.split("/")[0].split("-")[0];
  const dir  = r.trend==="UPTREND" ? "bullish" : "bearish";
  const signalLabel = signal==="SHORT_SQUEEZE" ? "Short Squeeze" : signal==="LONG_SQUEEZE" ? "Long Squeeze" : signal==="BREAKOUT" ? "Volatility Breakout" : "Qualified Setup";

  return `You are a professional crypto trading analyst. Analyze the following scanner data for ${base}/USDT and deliver a structured, insightful trading edge analysis. Be direct, specific, and practical. Use the data provided — do not fabricate numbers.

PAIR DATA:
- Symbol: ${base}/USDT (${r.type})
- Signal: ${signalLabel}
- Trend: ${r.trend}
- 24h Price Change: ${fmtChg(r.priceChange)}
- ATR: ${r.atr.toFixed(2)}% ${r.atrExpansion ? "(EXPANDING ▲)" : "(STABLE)"}
- 24h Volume: ${fmtVol(r.vol24h)}
- Volume vs 7-day Avg: ${r.volRatio.toFixed(2)}× (${r.volRatio >= 2 ? "STRONG expansion 🔥" : r.volRatio >= 1.5 ? "moderate expansion" : "low expansion"})
- Open Interest Change: ${r.oiChangePct >= 0 ? "+" : ""}${r.oiChangePct.toFixed(1)}%
${r.fundingRate != null ? `- Funding Rate: ${fmtFund(r.fundingRate)} (${r.fundingRate <= -0.01 ? "shorts paying longs — market overcrowded SHORT" : r.fundingRate >= 0.01 ? "longs paying shorts — market overcrowded LONG" : "neutral"})` : "- Funding Rate: N/A (spot pair)"}

Respond in this exact structure with these section headers (use them verbatim):

**SIGNAL BREAKDOWN**
Explain what the ${signalLabel} signal means for this specific pair and why it was triggered.

**THE EDGE**
What is the actual trading edge here? Why does this setup have an advantage over a random trade? Be specific.

**DIRECTIONAL BIAS**
State the direction (${dir}) and the reasoning. What confluence of factors supports it?

**KEY RISKS**
What are the 2–3 most important risks that could invalidate this setup?

**SUGGESTED APPROACH**
Practical guidance: entry trigger to watch for, what confirms the move, and what invalidates it. Keep this actionable.

Keep the entire response under 380 words. Be sharp, not verbose.`;
}

// ── LOG sequence ──────────────────────────────────────────────────────────────
const LOG_SEQ = [
  {type:"info",msg:"Initializing scanner engine..."},
  {type:"ok",  msg:"Connected to market data feed"},
  {type:"info",msg:"Fetching 24h & 7-day OHLCV for 42 pairs..."},
  {type:"info",msg:"Computing ATR series (5-candle window)..."},
  {type:"info",msg:"Pulling open interest data from derivatives feed..."},
  {type:"ok",  msg:"Derivatives data loaded — 18 futures pairs"},
  {type:"info",msg:"Pulling funding rate data for futures pairs..."},
  {type:"ok",  msg:"Funding rates loaded"},
  {type:"info",msg:"Applying liquidity, price change & ATR filters..."},
  {type:"info",msg:"Applying OI, volume expansion & volatility filters..."},
  {type:"info",msg:"Applying funding rate imbalance filter..."},
  {type:"ok",  msg:"Scan complete. Qualifying pairs identified."},
];

const DEFAULT_CFG = {
  marketType:"ALL", spotVolMin:50, futVolMin:150,
  changeMin:5, changeMax:20, atrMin:2.5, oiMin:2,
  allowSideways:false, fundingFilter:true,
  volExpFilter:true, volExpMultiplier:1.5, atrExpFilter:true,
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Sw({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  );
}
function SignalChip({ signal }) {
  if (signal==="SHORT_SQUEEZE") return <span className="signal-chip signal-squeeze-short">⚡ SH.SQZ</span>;
  if (signal==="LONG_SQUEEZE")  return <span className="signal-chip signal-squeeze-long">⚡ LG.SQZ</span>;
  if (signal==="BREAKOUT")      return <span className="signal-chip signal-breakout">🔺 BRKOUT</span>;
  return <span className="signal-chip signal-none">—</span>;
}
function FundBadge({ rate }) {
  if (rate==null) return <span style={{color:"var(--muted)",fontSize:11}}>—</span>;
  const cls = rate<=-0.01?"fund-short":rate>=0.01?"fund-long":"fund-neutral";
  return <span className={`fund-badge ${cls}`}>{fmtFund(rate)}</span>;
}
function VolBadge({ ratio }) {
  const cls = ratio>=2?"vol-high":ratio>=1.5?"vol-med":"vol-norm";
  return <span className={`vol-badge ${cls}`}>{ratio.toFixed(1)}×{ratio>=2?" 🔥":""}</span>;
}
function TrendBadge({ trend, atrExpansion }) {
  const up = trend==="UPTREND";
  return (
    <div className={`trend-badge trend-${up?"up":"down"}`}>
      <div className="trend-bar"><div className={up?"trend-fill-up":"trend-fill-down"}/></div>
      {up?"↑ UP":"↓ DN"}
      {atrExpansion && <span className="atr-tag">▲ATR</span>}
    </div>
  );
}

// ── AI Panel component ────────────────────────────────────────────────────────
function AiPanel({ pair, signal, chartUrl, chartSource, isOpen }) {
  const [status, setStatus]   = useState("idle"); // idle | loading | done | error
  const [content, setContent] = useState("");
  const base = pair.symbol.split("/")[0].split("-")[0];

  // Fetch analysis when panel opens
  useEffect(() => {
  if (!isOpen || status !== "idle") return;
  setStatus("loading");
  setContent("");

  (async () => {
    const prompt = buildPrompt(pair, signal);
    try {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
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

  // Render markdown-like bold sections
  const renderContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**")) {
        return <span key={i} className="ai-section-head">{p.slice(2,-2)}</span>;
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div className={`ai-panel${isOpen?" open":""}`}>
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          {status==="loading" && <span className="ai-icon-spin">⟳</span>}
          {status!=="loading" && <span>◈</span>}
          AI EDGE ANALYSIS
          <span className="ai-pair-tag">— {base}/USDT {pair.type}</span>
        </div>
        <a className="ai-chart-link" href={chartUrl} target="_blank" rel="noopener noreferrer">
          ↗ {chartSource==="GC"?"GoCharting":"TradingView"}
        </a>
      </div>
      <div className="ai-content">
        {status==="idle" && <span style={{color:"var(--muted)"}}>Initializing...</span>}
        {(status==="loading"||status==="done"||status==="error") && (
          <>
            {renderContent(content)}
            {status==="loading" && <span className="ai-cursor"/>}
          </>
        )}
      </div>
      {(status==="done"||status==="error") && (
        <div className="ai-footer">
          <span className="ai-disclaimer">⚠ AI analysis is for informational purposes only. Not financial advice.</span>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CryptoScanner() {
  const [theme, setTheme]           = useState("dark");
  const [phase, setPhase]           = useState("idle");
  const [logs, setLogs]             = useState([]);
  const [progress, setProgress]     = useState(0);
  const [results, setResults]       = useState([]);
  const [filter, setFilter]         = useState("ALL");
  const [scanCount, setScanCount]   = useState(0);
  const [lastScan, setLastScan]     = useState(null);
  const [clock, setClock]           = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cfg, setCfg]               = useState(DEFAULT_CFG);
  const [openPanels, setOpenPanels] = useState({}); // symbol -> bool
  const termRef = useRef(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toUTCString().slice(17,25)+" UTC");
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[]);
  useEffect(()=>{
    if(termRef.current) termRef.current.scrollTop=termRef.current.scrollHeight;
  },[logs]);

  const upd = (k,v) => setCfg(p=>({...p,[k]:v}));
  const togglePanel = (sym) => setOpenPanels(prev=>({...prev,[sym]:!prev[sym]}));

  const handleScan = () => {
    if(phase==="scanning") return;
    setPhase("scanning"); setLogs([]); setResults([]); setProgress(0); setOpenPanels({});
    const pairs=generatePairs();
    LOG_SEQ.forEach((entry,i)=>{
      setTimeout(()=>{
        const ts=new Date().toTimeString().slice(0,8);
        setLogs(prev=>[...prev,{...entry,ts,id:Date.now()+i}]);
        setProgress(Math.round(((i+1)/LOG_SEQ.length)*100));
        if(i===LOG_SEQ.length-1){
          setTimeout(()=>{
            setResults(applyFilters(pairs,cfg));
            setScanCount(c=>c+1);
            setLastScan(new Date().toTimeString().slice(0,8));
            setPhase("done");
          },400);
        }
      },i*240);
    });
  };

  const displayed = filter==="ALL"?results:results.filter(r=>r.type===filter);
  const upCount   = results.filter(r=>r.trend==="UPTREND").length;
  const downCount = results.filter(r=>r.trend==="DOWNTREND").length;

  return (
    <>
      <style>{STYLE}</style>
      <div className={`wrap${theme==="light"?" light":""}`}>
        <div className="bg-grid"/>
        <div className="container">

          {/* Header */}
          <div className="header">
            <div>
              <div className="logo-tag">// market intelligence system</div>
              <div className="logo-title">CRYPTO<span>SCAN</span> PRO</div>
              <div className="logo-sub">PAIR SCREENING ENGINE v2.6.0</div>
            </div>
            <div className="header-right">
              <div className="header-top-row">
                <button className="theme-toggle" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>
                  <span>{theme==="dark"?"☀️":"🌙"}</span>
                  {theme==="dark"?"LIGHT":"DARK"}
                </button>
                <div className="live-dot">LIVE</div>
              </div>
              <div className="clock">{clock}</div>
            </div>
          </div>

          {/* Settings */}
          <div className="settings-panel">
            <div className={`settings-header${settingsOpen?" open":""}`} onClick={()=>setSettingsOpen(o=>!o)}>
              <span className="settings-title">⚙ Filter Settings</span>
              <span className="settings-chevron">{settingsOpen?"▲ COLLAPSE":"▼ EXPAND"}</span>
            </div>
            {settingsOpen && (
              <div className="settings-body">
                <div className="setting-group">
                  <div className="setting-group-label">Core Filters</div>
                  <div className="setting-row">
                    <div className="setting-label">Market Type</div>
                    <select className="select-input" value={cfg.marketType} onChange={e=>upd("marketType",e.target.value)}>
                      <option value="ALL">All Markets</option>
                      <option value="SPOT">Spot Only</option>
                      <option value="FUTURES">Futures Only</option>
                    </select>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label">Spot Vol Min</div>
                    <div className="input-row"><input className="number-input" type="number" min="0" value={cfg.spotVolMin} onChange={e=>upd("spotVolMin",+e.target.value)}/><span className="input-unit">$M</span></div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label">Futures Vol Min</div>
                    <div className="input-row"><input className="number-input" type="number" min="0" value={cfg.futVolMin} onChange={e=>upd("futVolMin",+e.target.value)}/><span className="input-unit">$M</span></div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label">Price Change Range</div>
                    <div className="input-row">
                      <input className="number-input" type="number" min="0" value={cfg.changeMin} onChange={e=>upd("changeMin",+e.target.value)} style={{width:56}}/>
                      <span className="input-unit">% –</span>
                      <input className="number-input" type="number" min="0" value={cfg.changeMax} onChange={e=>upd("changeMax",+e.target.value)} style={{width:56}}/>
                      <span className="input-unit">%</span>
                    </div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label">ATR Min</div>
                    <div className="input-row"><input className="number-input" type="number" min="0" step="0.1" value={cfg.atrMin} onChange={e=>upd("atrMin",+e.target.value)}/><span className="input-unit">%</span></div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label">OI Change Min</div>
                    <div className="input-row"><input className="number-input" type="number" value={cfg.oiMin} onChange={e=>upd("oiMin",+e.target.value)}/><span className="input-unit">%</span></div>
                  </div>
                  <div className="setting-row">
                    <div className="toggle-switch"><Sw checked={cfg.allowSideways} onChange={v=>upd("allowSideways",v)}/><span className="switch-label">Allow Sideways</span></div>
                  </div>
                </div>
                <div className="setting-group">
                  <div className="setting-group-label">Funding Rate Filter</div>
                  <div className="setting-row">
                    <div className="toggle-switch"><Sw checked={cfg.fundingFilter} onChange={v=>upd("fundingFilter",v)}/><span className="switch-label">Enable Funding Filter</span></div>
                    <div className="setting-sublabel" style={{marginTop:6}}>Only futures with funding imbalance indicating a squeeze.</div>
                  </div>
                  <div className="setting-row" style={{marginTop:8}}>
                    <div className="setting-label" style={{color:"var(--up)"}}>▲ Short Squeeze</div>
                    <div className="setting-sublabel">Funding ≤ −0.01% AND Uptrend</div>
                  </div>
                  <div className="setting-row" style={{marginTop:8}}>
                    <div className="setting-label" style={{color:"var(--down)"}}>▼ Long Squeeze</div>
                    <div className="setting-sublabel">Funding ≥ +0.01% AND Downtrend</div>
                  </div>
                </div>
                <div className="setting-group">
                  <div className="setting-group-label">Expansion Filters</div>
                  <div className="setting-row">
                    <div className="toggle-switch"><Sw checked={cfg.volExpFilter} onChange={v=>upd("volExpFilter",v)}/><span className="switch-label">Volume Expansion</span></div>
                    <div className="setting-sublabel" style={{marginTop:4}}>Current vol ≥ N × 7-day avg</div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label">Multiplier</div>
                    <div className="input-row">
                      <input className="number-input" type="number" min="1" step="0.1" value={cfg.volExpMultiplier} onChange={e=>upd("volExpMultiplier",+e.target.value)} disabled={!cfg.volExpFilter}/>
                      <span className="input-unit">× avg</span>
                    </div>
                  </div>
                  <div className="setting-row" style={{marginTop:6}}>
                    <div className="toggle-switch"><Sw checked={cfg.atrExpFilter} onChange={v=>upd("atrExpFilter",v)}/><span className="switch-label">Volatility Expansion</span></div>
                    <div className="setting-sublabel" style={{marginTop:4}}>ATR rising over last 5 candles AND current ATR &gt; prior avg.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Criteria bar */}
          <div className="criteria-bar">
            <div className="criterion"><div className="criterion-label">Spot Vol</div><div className="criterion-value">≥${cfg.spotVolMin}M</div><div className="criterion-sub">24h min</div></div>
            <div className="criterion"><div className="criterion-label">Fut Vol</div><div className="criterion-value">≥${cfg.futVolMin}M</div><div className="criterion-sub">24h min</div></div>
            <div className="criterion"><div className="criterion-label">Chg Range</div><div className="criterion-value">{cfg.changeMin}–{cfg.changeMax}%</div><div className="criterion-sub">ATR≥{cfg.atrMin}%</div></div>
            <div className={`criterion${!cfg.fundingFilter?" inactive":""}`}><div className="criterion-label">Funding</div><div className="criterion-value">{cfg.fundingFilter?"IMBAL.":"OFF"}</div><div className="criterion-sub">Squeeze detect</div></div>
            <div className={`criterion${!cfg.volExpFilter?" inactive":""}`}><div className="criterion-label">Vol Exp.</div><div className="criterion-value">{cfg.volExpFilter?`≥${cfg.volExpMultiplier}×`:"OFF"}</div><div className="criterion-sub">New money</div></div>
            <div className={`criterion${!cfg.atrExpFilter?" inactive":""}`}><div className="criterion-label">ATR Exp.</div><div className="criterion-value">{cfg.atrExpFilter?"RISING":"OFF"}</div><div className="criterion-sub">Breakout</div></div>
          </div>

          {/* Scan bar */}
          <div className="scan-area">
            <button className={`scan-btn${phase==="scanning"?" scanning":""}`} onClick={handleScan} disabled={phase==="scanning"}>
              <span className="scan-btn-text">{phase==="scanning"?"▶ SCANNING...":"▶ SCAN MARKET"}</span>
            </button>
            <div className="progress-wrap"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
            <div className="scan-meta">SCANS: <span>{scanCount}</span>{lastScan&&<> | LAST: <span>{lastScan}</span></>}</div>
          </div>

          {/* Terminal */}
          <div className="terminal" ref={termRef}>
            {logs.length===0 && <span style={{color:"var(--muted)",fontSize:10}}>&gt; Awaiting scan command...</span>}
            {logs.map(l=>(
              <div key={l.id} className="log-line">
                <span className="log-time">[{l.ts}]</span>
                <span className={`log-${l.type==="ok"?"ok":l.type==="warn"?"warn":l.type==="err"?"err":"info"}`}>
                  {l.type==="ok"?"✓":l.type==="warn"?"⚠":l.type==="err"?"✗":"›"}&nbsp;
                </span>
                {l.msg}
              </div>
            ))}
          </div>

          {/* Results */}
          {phase!=="idle" && (
            <>
              <div className="results-header">
                <div>
                  <div className="results-label">Qualifying Pairs</div>
                  {phase==="done" && <div className="results-stats">↑ {upCount} uptrend &nbsp;|&nbsp; ↓ {downCount} downtrend</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  {phase==="done" && results.length>0 && (
                    <div className="filter-tabs">
                      {["ALL","SPOT","FUTURES"].map(f=>(
                        <button key={f} className={`filter-tab${filter===f?" active":""}`} onClick={()=>setFilter(f)}>{f}</button>
                      ))}
                    </div>
                  )}
                  {phase==="done" && <div className="results-count">{displayed.length}<span>pairs</span></div>}
                </div>
              </div>

              {phase==="scanning" && (
                <div className="scan-progress">
                  <div className="scan-spinner"/>
                  <div className="scan-status-text">SCANNING MARKET...</div>
                  <div className="scan-sub-text">{progress}% complete</div>
                </div>
              )}

              {phase==="done" && displayed.length===0 && (
                <div className="empty-state">
                  <div className="empty-icon">📡</div>
                  <div className="empty-title">No qualifying pairs</div>
                  <div className="empty-sub">Try relaxing the filters or scan again.</div>
                </div>
              )}

              {phase==="done" && displayed.length>0 && (
                <>
                  {/* ── Desktop table ── */}
                  <div className="table-wrap">
                    <div className="table-head">
                      {["Pair","Mkt","24h Vol","24h Chg","ATR","Funding","Vol Exp.","Trend/ATR","Signal","AI"].map(h=>(
                        <div key={h} className="th">{h}</div>
                      ))}
                    </div>
                    <div>
                      {displayed.map((r,i)=>{
                        const base            = r.symbol.split("/")[0].split("-")[0];
                        const signal          = getSignal(r,cfg);
                        const { url, source } = buildChartUrl(r);
                        const panelOpen       = !!openPanels[r.symbol];
                        return (
                          <div key={r.symbol} className="row-wrap" style={{animationDelay:`${i*50}ms`}}>
                            <div className="result-row">
                              <a href={url} target="_blank" rel="noopener noreferrer"
                                style={{display:"contents",textDecoration:"none",color:"inherit"}}>
                                <div className="pair-name"><span className="pair-base">{base}</span>/USDT</div>
                                <div><span className={`market-badge ${r.type.toLowerCase()}`}>{r.type==="SPOT"?"SPOT":"PERP"}</span></div>
                                <div className="td mono">{fmtVol(r.vol24h)}</div>
                                <div className={`td mono ${r.priceChange>=0?"change-up":"change-down"}`}>{fmtChg(r.priceChange)}</div>
                                <div className="td mono" style={{color:"var(--accent3)"}}>{r.atr.toFixed(2)}%</div>
                                <div className="td"><FundBadge rate={r.fundingRate}/></div>
                                <div className="td"><VolBadge ratio={r.volRatio}/></div>
                                <div className="td"><TrendBadge trend={r.trend} atrExpansion={r.atrExpansion}/></div>
                                <div className="td" style={{display:"flex",alignItems:"center",gap:4}}>
                                  <SignalChip signal={signal}/>
                                  <span className={`chart-hint ${source.toLowerCase()}`}>↗{source}</span>
                                </div>
                              </a>
                              <button
                                className={`ai-btn${panelOpen?" active":""}`}
                                onClick={()=>togglePanel(r.symbol)}
                                title="AI Edge Analysis"
                              >🤖</button>
                            </div>
                            <AiPanel
                              pair={r} signal={signal}
                              chartUrl={url} chartSource={source}
                              isOpen={panelOpen}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Mobile cards ── */}
                  <div className="cards-list">
                    {displayed.map((r,i)=>{
                      const base            = r.symbol.split("/")[0].split("-")[0];
                      const signal          = getSignal(r,cfg);
                      const { url, source } = buildChartUrl(r);
                      const panelOpen       = !!openPanels[r.symbol];
                      return (
                        <div key={r.symbol} className="pair-card"
                          style={{animationDelay:`${i*50}ms`, borderLeftColor: source==="GC"?"var(--accent2)":"var(--accent3)"}}>
                          <a className="card-inner" href={url} target="_blank" rel="noopener noreferrer">
                            <div className="card-top">
                              <div className="card-pair"><span>{base}</span>/USDT</div>
                              <div className="card-badges">
                                <span className={`market-badge ${r.type.toLowerCase()}`}>{r.type}</span>
                                <SignalChip signal={signal}/>
                                <span className={`src-badge ${source.toLowerCase()}`}>{source}</span>
                              </div>
                            </div>
                            <div className="card-grid">
                              <div className="card-cell"><span className="card-cell-label">24h Volume</span><span className="card-cell-value">{fmtVol(r.vol24h)}</span></div>
                              <div className="card-cell"><span className="card-cell-label">24h Change</span><span className={`card-cell-value ${r.priceChange>=0?"change-up":"change-down"}`}>{fmtChg(r.priceChange)}</span></div>
                              <div className="card-cell"><span className="card-cell-label">ATR</span><span className="card-cell-value" style={{color:"var(--accent3)"}}>{r.atr.toFixed(2)}%{r.atrExpansion?" ▲":""}</span></div>
                              <div className="card-cell"><span className="card-cell-label">Vol Expansion</span><span className="card-cell-value"><VolBadge ratio={r.volRatio}/></span></div>
                              {r.fundingRate!=null && (
                                <div className="card-cell"><span className="card-cell-label">Funding Rate</span><span className="card-cell-value"><FundBadge rate={r.fundingRate}/></span></div>
                              )}
                              <div className="card-cell"><span className="card-cell-label">Trend</span><span className="card-cell-value"><TrendBadge trend={r.trend} atrExpansion={r.atrExpansion}/></span></div>
                            </div>
                            <div className="card-bottom">
                              <span className={`chart-hint ${source.toLowerCase()}`} style={{opacity:1}}>
                                {source==="GC"?"↗ Open on GoCharting":"↗ Open on TradingView"}
                              </span>
                            </div>
                          </a>
                          <button
                            className={`card-ai-btn${panelOpen?" active":""}`}
                            onClick={()=>togglePanel(r.symbol)}
                          >
                            🤖 {panelOpen?"HIDE AI ANALYSIS":"GET AI ANALYSIS"}
                          </button>
                          <div className={`card-ai-panel${panelOpen?" open":""}`}>
                            <AiPanel
                              pair={r} signal={signal}
                              chartUrl={url} chartSource={source}
                              isOpen={panelOpen}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {phase==="idle" && (
            <div className="initial-state">
              <div className="radar-ring"/>
              <div className="initial-title">Scanner Ready</div>
              <div className="initial-sub">Configure filters above, then press SCAN MARKET</div>
            </div>
          )}

          <div className="footer">
            <div className="footer-note">
              Active: <span>VOL·ATR·OI·TREND{cfg.fundingFilter?" ·FUND":""}{cfg.volExpFilter?" ·VOL-EXP":""}{cfg.atrExpFilter?" ·ATR-EXP":""}</span>
            </div>
            <div className="footer-note">Simulated data — demo only</div>
          </div>

        </div>
      </div>
    </>
  );
}