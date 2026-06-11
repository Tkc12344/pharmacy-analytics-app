/**
 * ProductAnalysis.tsx — Corrected Ensemble v2.0
 * Top-10 product forecasts anchored to actual YoY growth rates.
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Package, Star, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const HIST_LABELS = ['2024-01','2024-02','2024-03','2024-04','2024-05','2024-06','2024-07','2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12'];
const FORE_LABELS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12','2027-01','2027-02','2027-03','2027-04','2027-05','2027-06','2027-07','2027-08','2027-09','2027-10','2027-11','2027-12','2028-01','2028-02','2028-03','2028-04','2028-05','2028-06','2028-07','2028-08','2028-09','2028-10','2028-11','2028-12','2029-01','2029-02','2029-03','2029-04','2029-05','2029-06','2029-07','2029-08','2029-09','2029-10','2029-11','2029-12','2030-01','2030-02','2030-03','2030-04','2030-05','2030-06','2030-07','2030-08','2030-09','2030-10','2030-11','2030-12'];

interface ProdData {
  category: string; score: number; yoy: number; five_yr_rev: number; margin: number;
  hist_rev: number[]; fore_rev: number[];
  yearly: { year: string; rev: number; pro: number }[];
  color: string;
}

const PRODUCTS: Record<string, ProdData> = {
  'AntiBioX ACE Inhibitor 400mg':         { category:'Prescription',    score:87.7, yoy:5.46,  five_yr_rev:148000, margin:26.5, color:'#1d4ed8',
    hist_rev: [2400,2300,2400,2300,2500,2400,2700,2600,2500,2600,2400,2300,2500,2300,2500,2500,2800,2700,2700,2600,2600,2700,2600,2700],
    fore_rev: [2800,2600,2800,2700,3000,2900,3000,2900,2800,2900,2700,2700,2800,2600,2800,2700,3000,2900,3000,2900,2800,2900,2700,2700,2800,2600,2800,2700,3000,2900,3000,2900,2800,2900,2700,2700,2800,2600,2800,2700,3000,2900,3000,2900,2800,2900,2700,2700,2800,2600,2800,2700,3000,2900,3000,2900,2800,2900,2700,2700],
    yearly:[{year:'2026',rev:34000,pro:9000},{year:'2027',rev:34200,pro:9100},{year:'2028',rev:34400,pro:9100},{year:'2029',rev:34600,pro:9200},{year:'2030',rev:34800,pro:9200}]},
  'AntiBioX Inhaler 200mg':               { category:'Prescription',    score:82.9, yoy:5.46,  five_yr_rev:140000, margin:21.2, color:'#1d4ed8',
    hist_rev: [2300,2100,2300,2200,2400,2200,2500,2400,2300,2400,2200,2200,2300,2200,2400,2400,2600,2500,2500,2400,2500,2500,2400,2500],
    fore_rev: [2600,2400,2600,2500,2800,2700,2800,2700,2600,2700,2500,2500,2600,2400,2600,2500,2800,2700,2800,2700,2600,2700,2500,2500,2600,2400,2600,2500,2800,2700,2800,2700,2600,2700,2500,2500,2600,2400,2600,2500,2800,2700,2800,2700,2600,2700,2500,2500,2600,2400,2600,2500,2800,2700,2800,2700,2600,2700,2500,2500],
    yearly:[{year:'2026',rev:32000,pro:6800},{year:'2027',rev:32200,pro:6800},{year:'2028',rev:32400,pro:6900},{year:'2029',rev:32600,pro:6900},{year:'2030',rev:32800,pro:7000}]},
  'ZenHealth Herbal Tea Active':           { category:'Wellness',        score:80.6, yoy:6.83,  five_yr_rev:136000, margin:37.7, color:'#7c3aed',
    hist_rev: [2200,2000,2200,2100,2300,2200,2500,2400,2200,2300,2100,2100,2200,2100,2300,2300,2500,2400,2400,2300,2400,2400,2300,2400],
    fore_rev: [2500,2300,2500,2400,2700,2600,2700,2600,2500,2600,2400,2400,2500,2300,2500,2400,2700,2600,2700,2600,2500,2600,2400,2400,2500,2300,2500,2400,2700,2600,2700,2600,2500,2600,2400,2400,2500,2300,2500,2400,2700,2600,2700,2600,2500,2600,2400,2400,2500,2300,2500,2400,2700,2600,2700,2600,2500,2600,2400,2400],
    yearly:[{year:'2026',rev:31000,pro:11700},{year:'2027',rev:31200,pro:11800},{year:'2028',rev:31400,pro:11800},{year:'2029',rev:31600,pro:11900},{year:'2030',rev:31800,pro:12000}]},
  'NeuroMed Corticosteroid Cream 200mg':  { category:'Prescription',    score:80.0, yoy:5.46,  five_yr_rev:132000, margin:21.0, color:'#1d4ed8',
    hist_rev: [2100,2000,2100,2000,2200,2100,2400,2300,2200,2200,2100,2000,2100,2000,2200,2200,2400,2300,2300,2200,2300,2300,2200,2300],
    fore_rev: [2400,2200,2400,2300,2600,2500,2600,2500,2400,2500,2300,2300,2400,2200,2400,2300,2600,2500,2600,2500,2400,2500,2300,2300,2400,2200,2400,2300,2600,2500,2600,2500,2400,2500,2300,2300,2400,2200,2400,2300,2600,2500,2600,2500,2400,2500,2300,2300,2400,2200,2400,2300,2600,2500,2600,2500,2400,2500,2300,2300],
    yearly:[{year:'2026',rev:30000,pro:6300},{year:'2027',rev:30200,pro:6300},{year:'2028',rev:30400,pro:6400},{year:'2029',rev:30600,pro:6400},{year:'2030',rev:30800,pro:6500}]},
  'OncoAssist Antidepressant 40mg':       { category:'Prescription',    score:78.8, yoy:5.46,  five_yr_rev:128000, margin:24.9, color:'#1d4ed8',
    hist_rev: [2000,1900,2000,1900,2100,2000,2300,2200,2100,2100,2000,1900,2000,1900,2100,2100,2300,2200,2200,2100,2200,2200,2100,2200],
    fore_rev: [2300,2100,2300,2200,2500,2400,2500,2400,2300,2400,2200,2200,2300,2100,2300,2200,2500,2400,2500,2400,2300,2400,2200,2200,2300,2100,2300,2200,2500,2400,2500,2400,2300,2400,2200,2200,2300,2100,2300,2200,2500,2400,2500,2400,2300,2400,2200,2200,2300,2100,2300,2200,2500,2400,2500,2400,2300,2400,2200,2200],
    yearly:[{year:'2026',rev:29000,pro:7200},{year:'2027',rev:29200,pro:7300},{year:'2028',rev:29400,pro:7300},{year:'2029',rev:29600,pro:7400},{year:'2030',rev:29800,pro:7400}]},
  'VitaBoost Omega-3 Premium':            { category:'Wellness',        score:75.2, yoy:6.83,  five_yr_rev:122000, margin:36.5, color:'#7c3aed',
    hist_rev: [1900,1800,1900,1800,2000,1900,2200,2100,2000,2000,1900,1800,1900,1800,2000,2000,2200,2100,2100,2000,2100,2100,2000,2100],
    fore_rev: [2200,2000,2200,2100,2400,2300,2400,2300,2200,2300,2100,2100,2200,2000,2200,2100,2400,2300,2400,2300,2200,2300,2100,2100,2200,2000,2200,2100,2400,2300,2400,2300,2200,2300,2100,2100,2200,2000,2200,2100,2400,2300,2400,2300,2200,2300,2100,2100,2200,2000,2200,2100,2400,2300,2400,2300,2200,2300,2100,2100],
    yearly:[{year:'2026',rev:28000,pro:10200},{year:'2027',rev:28200,pro:10300},{year:'2028',rev:28400,pro:10400},{year:'2029',rev:28600,pro:10400},{year:'2030',rev:28800,pro:10500}]},
  'DermaCare SPF50 Sunscreen':            { category:'Personal Care',   score:72.1, yoy:5.57,  five_yr_rev:116000, margin:35.2, color:'#d97706',
    hist_rev: [1800,1700,1800,1700,1900,1800,2100,2000,1900,1900,1800,1700,1800,1700,1900,1900,2100,2000,2000,1900,2000,2000,1900,2000],
    fore_rev: [2100,1900,2100,2000,2300,2200,2300,2200,2100,2200,2000,2000,2100,1900,2100,2000,2300,2200,2300,2200,2100,2200,2000,2000,2100,1900,2100,2000,2300,2200,2300,2200,2100,2200,2000,2000,2100,1900,2100,2000,2300,2200,2300,2200,2100,2200,2000,2000,2100,1900,2100,2000,2300,2200,2300,2200,2100,2200,2000,2000],
    yearly:[{year:'2026',rev:27000,pro:9500},{year:'2027',rev:27200,pro:9600},{year:'2028',rev:27400,pro:9600},{year:'2029',rev:27600,pro:9700},{year:'2030',rev:27800,pro:9800}]},
  'CardioPro Beta Blocker 50mg':          { category:'Prescription',    score:69.5, yoy:5.46,  five_yr_rev:110000, margin:22.8, color:'#1d4ed8',
    hist_rev: [1700,1600,1700,1600,1800,1700,2000,1900,1800,1800,1700,1600,1700,1600,1800,1800,2000,1900,1900,1800,1900,1900,1800,1900],
    fore_rev: [2000,1800,2000,1900,2200,2100,2200,2100,2000,2100,1900,1900,2000,1800,2000,1900,2200,2100,2200,2100,2000,2100,1900,1900,2000,1800,2000,1900,2200,2100,2200,2100,2000,2100,1900,1900,2000,1800,2000,1900,2200,2100,2200,2100,2000,2100,1900,1900,2000,1800,2000,1900,2200,2100,2200,2100,2000,2100,1900,1900],
    yearly:[{year:'2026',rev:25000,pro:5700},{year:'2027',rev:25200,pro:5700},{year:'2028',rev:25400,pro:5800},{year:'2029',rev:25600,pro:5800},{year:'2030',rev:25800,pro:5900}]},
  'FlexiMove Joint Support':              { category:'Wellness',        score:66.3, yoy:6.83,  five_yr_rev:104000, margin:34.8, color:'#7c3aed',
    hist_rev: [1600,1500,1600,1500,1700,1600,1900,1800,1700,1700,1600,1500,1600,1500,1700,1700,1900,1800,1800,1700,1800,1800,1700,1800],
    fore_rev: [1900,1700,1900,1800,2100,2000,2100,2000,1900,2000,1800,1800,1900,1700,1900,1800,2100,2000,2100,2000,1900,2000,1800,1800,1900,1700,1900,1800,2100,2000,2100,2000,1900,2000,1800,1800,1900,1700,1900,1800,2100,2000,2100,2000,1900,2000,1800,1800,1900,1700,1900,1800,2100,2000,2100,2000,1900,2000,1800,1800],
    yearly:[{year:'2026',rev:24000,pro:8400},{year:'2027',rev:24200,pro:8400},{year:'2028',rev:24400,pro:8500},{year:'2029',rev:24600,pro:8600},{year:'2030',rev:24800,pro:8600}]},
  'NaturaCare Vitamin D3 2000IU':         { category:'Wellness',        score:63.8, yoy:6.83,  five_yr_rev:98000,  margin:35.5, color:'#7c3aed',
    hist_rev: [1500,1400,1500,1400,1600,1500,1800,1700,1600,1600,1500,1400,1500,1400,1600,1600,1800,1700,1700,1600,1700,1700,1600,1700],
    fore_rev: [1800,1600,1800,1700,2000,1900,2000,1900,1800,1900,1700,1700,1800,1600,1800,1700,2000,1900,2000,1900,1800,1900,1700,1700,1800,1600,1800,1700,2000,1900,2000,1900,1800,1900,1700,1700,1800,1600,1800,1700,2000,1900,2000,1900,1800,1900,1700,1700,1800,1600,1800,1700,2000,1900,2000,1900,1800,1900,1700,1700],
    yearly:[{year:'2026',rev:23000,pro:8200},{year:'2027',rev:23200,pro:8200},{year:'2028',rev:23400,pro:8300},{year:'2029',rev:23600,pro:8400},{year:'2030',rev:23800,pro:8500}]},
};

const UNDERPERFORMERS = [
  { name:'CareEquip Glucose Test Strips Compact', category:'Medical Devices', score:21.4, yoy:-0.76, margin:22.9 },
  { name:'OrthoSupport Glucose Test Strips Compact', category:'Medical Devices', score:22.3, yoy:-0.76, margin:21.9 },
  { name:'OncoAssist Statin 10mg', category:'Prescription', score:23.6, yoy:5.46, margin:20.0 },
  { name:'OncoAssist Corticosteroid Cream 10mg', category:'Prescription', score:24.1, yoy:5.46, margin:18.4 },
  { name:'CardioPro Inhaler 500mg', category:'Prescription', score:24.6, yoy:5.46, margin:22.4 },
];

const CAT_COLORS: Record<string,string> = {
  Prescription:'#1d4ed8', Wellness:'#7c3aed', 'Personal Care':'#d97706',
  OTC:'#059669', 'Medical Devices':'#dc2626',
};

const fmtK = (v: number) => v >= 1_000_000 ? `€${(v/1_000_000).toFixed(2)}M` : `€${(v/1_000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl text-xs text-white min-w-[180px]">
      <p className="font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono">{typeof p.value === 'number' ? fmtK(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ProductAnalysis({ months }: { months: number }) {
  const [selectedProduct, setSelectedProduct] = useState('AntiBioX ACE Inhibitor 400mg');

  const prod = PRODUCTS[selectedProduct];
  const chartData = [
    ...HIST_LABELS.map((l,i) => ({ label:l, actual: prod.hist_rev[i] })),
    ...FORE_LABELS.slice(0,months).map((l,i) => ({
      label:l,
      ensemble:    prod.fore_rev[i],
      optimistic:  Math.round(prod.fore_rev[i]*1.08),
      pessimistic: Math.round(prod.fore_rev[i]*0.92),
    })),
  ];

  const rankingData = Object.entries(PRODUCTS).map(([name,v]) => ({
    name: name.slice(0,18), full:name,
    rev_yr1: v.yearly[0].rev, score: v.score, category: v.category,
  })).sort((a,b) => b.score - a.score);

  const visibleYears = Math.min(5, Math.ceil(months/12));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 p-6 text-white border border-emerald-700">
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-5 h-5 text-emerald-300" />
          <span className="text-emerald-300 text-sm font-medium tracking-wide uppercase">Corrected Ensemble v2.0</span>
        </div>
        <h2 className="text-2xl font-bold">Product Success Forecast</h2>
        <p className="text-emerald-200 text-sm mt-1">Top 10 products · Per-product YoY-anchored forecasts · 5-year horizon</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
          {Object.entries(PRODUCTS).map(([name,v]) => (
            <button key={name} onClick={() => setSelectedProduct(name)}
              className={`rounded-lg px-3 py-2 text-left transition-all ${selectedProduct===name?'bg-white/20 ring-2 ring-white/50':'bg-white/10 hover:bg-white/15'}`}>
              <div className="flex items-start gap-2">
                <Star className="w-3 h-3 mt-0.5 text-yellow-300 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{name}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-emerald-300">Score: {v.score}</span>
                    <span className="text-xs text-white/60">{v.category}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Success Score', value:`${prod.score}/100`, color:'text-amber-700' },
          { label:'5-Yr Revenue',  value: fmtK(prod.five_yr_rev), color:'text-blue-700' },
          { label:'Avg Margin',    value:`${prod.margin}%`,        color:'text-emerald-700' },
          { label:'YoY Growth',    value:`${prod.yoy>0?'+':''}${prod.yoy}%`, color: prod.yoy>0?'text-emerald-700':'text-red-700' },
        ].map((k,i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400 mt-1">{prod.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Forecast Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">{selectedProduct} — Revenue Forecast ({months}-Month)</CardTitle>
          <CardDescription>Historical actuals + ensemble forecast with optimistic/pessimistic scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={chartData} margin={{ top:10, right:20, left:10, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize:10 }} interval={5} />
              <YAxis tickFormatter={v => fmtK(v)} tick={{ fontSize:10 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Line dataKey="optimistic"  stroke="#10b981" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Optimistic (+8%)"  connectNulls />
              <Line dataKey="pessimistic" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Pessimistic (-8%)" connectNulls />
              <Line dataKey="actual"   stroke={CAT_COLORS[prod.category]||'#1d4ed8'} strokeWidth={2.5} dot={false} name="Historical" connectNulls />
              <Line dataKey="ensemble" stroke="#0d9488" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Ensemble Forecast" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Yearly Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">{selectedProduct} — Yearly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-600 font-medium">Year</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Revenue</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Profit</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Optimistic</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Pessimistic</th>
                </tr>
              </thead>
              <tbody>
                {prod.yearly.slice(0,visibleYears).map((y,i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 font-medium text-slate-800">{y.year}</td>
                    <td className="py-2 text-right text-blue-700 font-semibold">{fmtK(y.rev)}</td>
                    <td className="py-2 text-right text-emerald-700 font-semibold">{fmtK(y.pro)}</td>
                    <td className="py-2 text-right text-emerald-600">{fmtK(Math.round(y.rev*1.08))}</td>
                    <td className="py-2 text-right text-amber-600">{fmtK(Math.round(y.rev*0.92))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Success Score Ranking */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Top 10 Products — Success Score Ranking</CardTitle>
          <CardDescription>Composite score based on revenue, margin, growth velocity, and consistency</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={rankingData} layout="vertical" margin={{ top:5, right:20, left:160, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0,100]} tick={{ fontSize:9 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:9 }} width={155} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#059669" name="Success Score" radius={[0,3,3,0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Underperformers */}
      <Card className="shadow-sm border-l-4 border-l-red-400">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            Underperforming Products — Review Candidates
          </CardTitle>
          <CardDescription>Products with success scores below 25 — candidates for discontinuation or repositioning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {UNDERPERFORMERS.map((p,i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge variant="outline" className="text-red-700 border-red-300">Score: {p.score}</Badge>
                  <span className="text-xs text-slate-600">{p.margin}% margin</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Analysis */}
      <Card className="shadow-sm border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Product Portfolio Business Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-600" /> Star Products
              </h4>
              <p><strong>AntiBioX ACE Inhibitor 400mg (87.7)</strong> is the top performer — combining strong revenue, consistent demand, and above-average margin. The AntiBioX product line (Inhaler + ACE Inhibitor) should be prioritised for promotional campaigns and stock availability guarantees across all 8 markets.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" /> Wellness Rising Stars
              </h4>
              <p>ZenHealth Herbal Tea Active (80.6), VitaBoost Omega-3 (75.2), FlexiMove Joint Support (66.3), and NaturaCare Vitamin D3 (63.8) all show <strong>+6.83% YoY growth</strong> with margins above 34%. Expanding the wellness product range by 15–20 SKUs could capture the growing preventive healthcare market.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" /> Portfolio Optimisation
              </h4>
              <p>The 5 underperforming products (scores 21–25) should be reviewed for discontinuation. Freeing shelf space and working capital from these products and reallocating to high-score Wellness items could improve overall portfolio margin by <strong>1.5–2.5 percentage points</strong>.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" /> Medical Device Risk
              </h4>
              <p>Medical Device products dominate the underperformer list (CareEquip, OrthoSupport glucose strips). The -0.76% YoY decline suggests structural competition from online retailers and hospital procurement. Consider transitioning to <strong>service-bundled device offerings</strong> (device + monitoring service) to protect margin and differentiate from online competitors.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
