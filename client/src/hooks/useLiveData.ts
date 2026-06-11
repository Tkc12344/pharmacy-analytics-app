/**
 * useLiveData.ts
 * Live dashboard data simulation engine.
 * Simulates real-time pharmacy sales data streaming in every few seconds.
 * All values are derived from the actual historical baseline so they stay realistic.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// ── BASELINE CONSTANTS (from actual 2024-2025 data) ────────────────────────
const DAILY_REVENUE_BASE   = 8_633_977 / 730;   // €11,827/day average
const DAILY_PROFIT_BASE    = 2_421_141 / 730;   // €3,317/day average
const DAILY_TRANSACTIONS   = 62_139 / 730;      // ~85 transactions/day
const MARGIN_BASE          = 28.04;

// Seasonal multiplier by month (1=Jan … 12=Dec) from actual data
const SEASONAL = [0.93, 0.88, 0.93, 0.89, 0.96, 0.92, 1.04, 1.00, 0.96, 0.99, 0.92, 0.91];

function seasonal() {
  return SEASONAL[new Date().getMonth()];
}

function jitter(base: number, pct = 0.03) {
  return base * (1 + (Math.random() - 0.5) * 2 * pct);
}

// ── TYPES ───────────────────────────────────────────────────────────────────
export interface LiveKPIs {
  todayRevenue:      number;
  todayProfit:       number;
  todayTransactions: number;
  todayMargin:       number;
  monthRevenue:      number;
  monthProfit:       number;
  monthTransactions: number;
  ytdRevenue:        number;
  ytdProfit:         number;
  revenueVsYday:     number;   // % change vs yesterday
  profitVsYday:      number;
  txVsYday:          number;
  lastUpdated:       Date;
}

export interface LiveTick {
  time:        string;  // HH:MM:SS
  revenue:     number;
  profit:      number;
  transactions: number;
}

export interface LiveAlert {
  id:       string;
  type:     'success' | 'warning' | 'info';
  message:  string;
  time:     Date;
}

// ── HOOK ────────────────────────────────────────────────────────────────────
export function useLiveData(intervalMs = 4000) {
  const dayFraction = useRef(0); // how far through the day we are (0-1)
  const tickHistory = useRef<LiveTick[]>([]);
  const alertPool = useRef<string[]>([
    'High-margin Wellness products trending +12% today',
    'Germany region exceeds daily revenue target',
    'Prescription category: 3 new transactions in last 60s',
    'Urban pharmacy cluster: above-average margin detected',
    'Poland market: growth momentum sustained for 5th day',
    'OTC category: promotional uplift +8% vs baseline',
    'Netherlands pharmacies: strong morning performance',
    'Medical Devices: margin improvement +0.4pp today',
    'France region: on track to beat monthly forecast',
    'Top product "PharmaCare Pro" — 14 units sold today',
  ]);
  const alertIndex = useRef(0);

  const buildKPIs = useCallback((): LiveKPIs => {
    const now = new Date();
    const s = seasonal();
    const dayFrac = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
    dayFraction.current = dayFrac;

    const dayRev  = jitter(DAILY_REVENUE_BASE   * s);
    const dayPro  = jitter(DAILY_PROFIT_BASE    * s);
    const dayTx   = Math.round(jitter(DAILY_TRANSACTIONS * s));
    const margin  = jitter(MARGIN_BASE, 0.005);

    const todayRev  = dayRev  * dayFrac;
    const todayPro  = dayPro  * dayFrac;
    const todayTx   = Math.round(dayTx * dayFrac);

    const dom = now.getDate();
    const monthRev  = todayRev  + dayRev  * (dom - 1);
    const monthPro  = todayPro  + dayPro  * (dom - 1);
    const monthTx   = todayTx   + dayTx   * (dom - 1);

    const doy = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const ytdRev = dayRev * doy;
    const ytdPro = dayPro * doy;

    return {
      todayRevenue:      todayRev,
      todayProfit:       todayPro,
      todayTransactions: todayTx,
      todayMargin:       margin,
      monthRevenue:      monthRev,
      monthProfit:       monthPro,
      monthTransactions: monthTx,
      ytdRevenue:        ytdRev,
      ytdProfit:         ytdPro,
      revenueVsYday:     jitter(4.43, 0.5),
      profitVsYday:      jitter(4.93, 0.5),
      txVsYday:          jitter(2.1,  0.8),
      lastUpdated:       now,
    };
  }, []);

  const buildTick = useCallback((): LiveTick => {
    const now = new Date();
    const s = seasonal();
    const secRev = jitter(DAILY_REVENUE_BASE * s / 86400, 0.15);
    const secPro = jitter(DAILY_PROFIT_BASE  * s / 86400, 0.15);
    return {
      time:         now.toTimeString().slice(0, 8),
      revenue:      secRev * (intervalMs / 1000),
      profit:       secPro * (intervalMs / 1000),
      transactions: Math.random() < 0.35 ? 1 : 0,
    };
  }, [intervalMs]);

  const [kpis,    setKpis]    = useState<LiveKPIs>(buildKPIs);
  const [ticks,   setTicks]   = useState<LiveTick[]>([]);
  const [alerts,  setAlerts]  = useState<LiveAlert[]>([]);
  const [isLive,  setIsLive]  = useState(true);
  const [pulse,   setPulse]   = useState(false);

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setKpis(buildKPIs());
      const tick = buildTick();
      tickHistory.current = [...tickHistory.current.slice(-59), tick];
      setTicks([...tickHistory.current]);
      setPulse(p => !p);

      // Occasionally emit an alert
      if (Math.random() < 0.15) {
        const msg = alertPool.current[alertIndex.current % alertPool.current.length];
        alertIndex.current++;
        const type = Math.random() < 0.6 ? 'success' : Math.random() < 0.5 ? 'info' : 'warning';
        setAlerts(prev => [
          { id: Date.now().toString(), type, message: msg, time: new Date() },
          ...prev.slice(0, 4),
        ]);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [isLive, intervalMs, buildKPIs, buildTick]);

  return { kpis, ticks, alerts, isLive, setIsLive, pulse };
}

// ── LIVE CLOCK ───────────────────────────────────────────────────────────────
export function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
