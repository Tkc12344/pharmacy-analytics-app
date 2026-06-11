/**
 * LiveDashboard.tsx
 * Design: Dark-mode command-centre aesthetic — deep slate background,
 * electric teal/emerald accents, amber warnings, crisp white data labels.
 * Core Principles: data density, real-time pulse, minimal chrome.
 */
import { useState, useEffect } from 'react';
import { useLiveData, useLiveClock } from '@/hooks/useLiveData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import {
  Activity, TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Percent, Wifi, WifiOff, Bell, CheckCircle, AlertTriangle, Info,
  RefreshCw, Zap, Globe, Package, Store, BarChart2
} from 'lucide-react';

// ── FORMATTERS ───────────────────────────────────────────────────────────────
const fmtEur = (v: number) =>
  v >= 1_000_000 ? `€${(v/1_000_000).toFixed(2)}M`
  : v >= 1_000   ? `€${(v/1_000).toFixed(1)}K`
  : `€${v.toFixed(0)}`;

const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

const pad = (n: number) => String(n).padStart(2, '0');

// ── REGIONAL LIVE BARS (static weights, jitter applied) ─────────────────────
const REGIONS = [
  { name: 'Germany',     share: 0.182, color: '#2dd4bf' },
  { name: 'France',      share: 0.158, color: '#34d399' },
  { name: 'Italy',       share: 0.141, color: '#60a5fa' },
  { name: 'Spain',       share: 0.128, color: '#a78bfa' },
  { name: 'Poland',      share: 0.112, color: '#f59e0b' },
  { name: 'Belgium',     share: 0.098, color: '#fb923c' },
  { name: 'Netherlands', share: 0.094, color: '#f472b6' },
  { name: 'Austria',     share: 0.087, color: '#94a3b8' },
];

const CATEGORIES = [
  { name: 'Prescription', share: 0.324, color: '#2dd4bf' },
  { name: 'OTC',          share: 0.287, color: '#34d399' },
  { name: 'Wellness',     share: 0.168, color: '#60a5fa' },
  { name: 'Personal Care',share: 0.134, color: '#a78bfa' },
  { name: 'Medical Dev.', share: 0.087, color: '#f59e0b' },
];

// ── ALERT ICON ────────────────────────────────────────────────────────────────
function AlertIcon({ type }: { type: string }) {
  if (type === 'success') return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
  if (type === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
  return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />;
}

// ── LIVE KPI CARD ─────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon, label, value, sub, delta, color, pulse
}: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  delta?: number; color: string; pulse: boolean;
}) {
  return (
    <div className={`relative rounded-xl border border-slate-700/60 bg-slate-800/80 p-4 overflow-hidden
      transition-all duration-300 hover:border-slate-600 hover:bg-slate-800`}>
      {/* Glow pulse */}
      <div className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500
        ${pulse ? 'opacity-10' : ''}`}
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {delta !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5
            ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {fmtPct(delta)}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function LiveDashboard() {
  const { kpis, ticks, alerts, isLive, setIsLive, pulse } = useLiveData(3500);
  const now = useLiveClock();
  const [regionData, setRegionData] = useState(
    REGIONS.map(r => ({ ...r, value: r.share * 11827 }))
  );
  const [catData, setCatData] = useState(
    CATEGORIES.map(c => ({ ...c, value: c.share * 11827 }))
  );

  // Jitter region & category bars every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setRegionData(REGIONS.map(r => ({
        ...r, value: r.share * 11827 * (1 + (Math.random() - 0.5) * 0.06)
      })));
      setCatData(CATEGORIES.map(c => ({
        ...c, value: c.share * 11827 * (1 + (Math.random() - 0.5) * 0.06)
      })));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = now.toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Build sparkline data from ticks (cumulative revenue)
  const sparkData = ticks.map((t, i) => ({
    time: t.time,
    rev:  ticks.slice(0, i + 1).reduce((s, x) => s + x.revenue, 0),
    pro:  ticks.slice(0, i + 1).reduce((s, x) => s + x.profit,  0),
  }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">

      {/* ── STATUS BAR ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/70 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <button
            onClick={() => setIsLive(l => !l)}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all
              ${isLive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-700/40 text-slate-500 border border-slate-600/40'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          {isLive
            ? <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            : <WifiOff className="w-3.5 h-3.5 text-slate-500" />}
          <span className="text-xs text-slate-500">
            Updated {kpis.lastUpdated.toTimeString().slice(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono text-teal-300 font-semibold">{timeStr}</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">{dateStr}</span>
          <button
            onClick={() => setIsLive(l => !l)}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
            title={isLive ? 'Pause live updates' : 'Resume live updates'}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isLive ? 'animate-spin' : ''}`}
              style={{ animationDuration: '3s' }} />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* ── TODAY'S KPI CARDS ──────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Today's Performance
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard icon={DollarSign}    label="Today's Revenue"      value={fmtEur(kpis.todayRevenue)}      delta={kpis.revenueVsYday}  color="#2dd4bf" pulse={pulse} />
            <KpiCard icon={TrendingUp}    label="Today's Profit"       value={fmtEur(kpis.todayProfit)}       delta={kpis.profitVsYday}   color="#34d399" pulse={pulse} />
            <KpiCard icon={ShoppingCart}  label="Transactions"         value={kpis.todayTransactions.toLocaleString()} delta={kpis.txVsYday} color="#60a5fa" pulse={pulse} />
            <KpiCard icon={Percent}       label="Margin"               value={`${kpis.todayMargin.toFixed(2)}%`} sub="vs 28.04% baseline" color="#a78bfa" pulse={pulse} />
          </div>
        </div>

        {/* ── MONTH & YTD CARDS ─────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
            Month-to-Date &amp; Year-to-Date
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard icon={DollarSign}  label="MTD Revenue"      value={fmtEur(kpis.monthRevenue)}      color="#f59e0b" pulse={pulse} />
            <KpiCard icon={TrendingUp}  label="MTD Profit"       value={fmtEur(kpis.monthProfit)}       color="#fb923c" pulse={pulse} />
            <KpiCard icon={DollarSign}  label="YTD Revenue"      value={fmtEur(kpis.ytdRevenue)}        color="#2dd4bf" pulse={pulse} />
            <KpiCard icon={TrendingUp}  label="YTD Profit"       value={fmtEur(kpis.ytdProfit)}         color="#34d399" pulse={pulse} />
          </div>
        </div>

        {/* ── LIVE REVENUE STREAM CHART ─────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                Live Revenue Stream
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Cumulative intra-session revenue &amp; profit (updates every 3.5s)</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
              ${isLive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
              {ticks.length} ticks
            </span>
          </div>
          {sparkData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={sparkData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2dd4bf" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} interval={9} />
                <YAxis tickFormatter={v => fmtEur(v)} tick={{ fontSize: 9, fill: '#64748b' }} width={60} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v: number, name: string) => [fmtEur(v), name === 'rev' ? 'Revenue' : 'Profit']}
                />
                <Area type="monotone" dataKey="rev" stroke="#2dd4bf" strokeWidth={2} fill="url(#revGrad)" dot={false} name="rev" />
                <Area type="monotone" dataKey="pro" stroke="#34d399" strokeWidth={2} fill="url(#proGrad)" dot={false} name="pro" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Collecting live data…
              </div>
            </div>
          )}
        </div>

        {/* ── REGIONAL + CATEGORY BARS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Regional */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <p className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-blue-400" />
              Live Revenue by Region
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `€${(v/1000).toFixed(0)}K`}
                  tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={72} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [fmtEur(v), 'Daily Revenue']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {regionData.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <p className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-purple-400" />
              Live Revenue by Category
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={catData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `€${(v/1000).toFixed(0)}K`}
                  tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={85} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [fmtEur(v), 'Daily Revenue']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {catData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── LIVE ALERTS ───────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
          <p className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            Live Alerts
            {alerts.length > 0 && (
              <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                {alerts.length} new
              </span>
            )}
          </p>
          {alerts.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No alerts yet — monitoring live data stream…</p>
          ) : (
            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id}
                  className="flex items-start gap-2.5 text-xs bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700/40
                    animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertIcon type={a.type} />
                  <span className="text-slate-300 flex-1">{a.message}</span>
                  <span className="text-slate-600 shrink-0 font-mono">{a.time.toTimeString().slice(0, 8)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── NETWORK STATS ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Store,    label: 'Active Pharmacies', value: '120 / 120', color: '#2dd4bf' },
            { icon: Globe,    label: 'Markets Online',    value: '8 / 8',     color: '#34d399' },
            { icon: Activity, label: 'Data Freshness',    value: isLive ? 'Real-time' : 'Paused', color: isLive ? '#34d399' : '#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-3 text-center">
              <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
              <p className="text-xs text-slate-500 mb-0.5">{label}</p>
              <p className="text-sm font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
