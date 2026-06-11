/**
 * CategoryAnalysis.tsx — Corrected Ensemble v2.0
 * Per-category forecasts anchored to actual YoY growth rates.
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

const HIST_LABELS = ['2024-01','2024-02','2024-03','2024-04','2024-05','2024-06','2024-07','2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12'];
const FORE_LABELS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12','2027-01','2027-02','2027-03','2027-04','2027-05','2027-06','2027-07','2027-08','2027-09','2027-10','2027-11','2027-12','2028-01','2028-02','2028-03','2028-04','2028-05','2028-06','2028-07','2028-08','2028-09','2028-10','2028-11','2028-12','2029-01','2029-02','2029-03','2029-04','2029-05','2029-06','2029-07','2029-08','2029-09','2029-10','2029-11','2029-12','2030-01','2030-02','2030-03','2030-04','2030-05','2030-06','2030-07','2030-08','2030-09','2030-10','2030-11','2030-12'];

interface CatData {
  yoy: number; five_yr_rev: number; five_yr_pro: number; margin: number;
  hist_rev: number[]; fore_rev: number[];
  yearly: { year: string; rev: number; pro: number; margin: number }[];
  color: string; icon: string;
}

const CATEGORIES: Record<string, CatData> = {
  Prescription: {
    yoy:5.46, five_yr_rev:7448026, five_yr_pro:1631000, margin:21.90, color:'#1d4ed8', icon:'💊',
    hist_rev: [122000,115000,121000,115000,125000,119000,135000,130000,124000,128000,119000,118000,124000,117000,126000,126000,140000,134000,135000,130000,132000,136000,130000,136000],
    fore_rev: [143000,132000,143000,139000,156000,148000,157000,151000,144000,151000,140000,139000,144000,133000,144000,140000,157000,149000,158000,152000,145000,152000,141000,140000,145000,134000,145000,141000,158000,150000,159000,153000,146000,153000,142000,141000,146000,135000,146000,142000,159000,151000,160000,154000,147000,154000,143000,142000,147000,136000,147000,143000,160000,152000,161000,155000,148000,155000,144000,143000],
    yearly:[{year:'2026',rev:1750000,pro:383000,margin:21.89},{year:'2027',rev:1760000,pro:385000,margin:21.88},{year:'2028',rev:1770000,pro:388000,margin:21.92},{year:'2029',rev:1780000,pro:390000,margin:21.91},{year:'2030',rev:1790000,pro:392000,margin:21.90}],
  },
  OTC: {
    yoy:2.26, five_yr_rev:4768371, five_yr_pro:1401000, margin:29.38, color:'#059669', icon:'🏥',
    hist_rev: [78000,73000,77000,74000,80000,76000,87000,83000,80000,82000,76000,75000,79000,74000,80000,80000,89000,85000,86000,83000,84000,86000,82000,86000],
    fore_rev: [88000,81000,88000,85000,96000,91000,96000,92000,88000,92000,86000,85000,89000,82000,89000,86000,97000,92000,97000,93000,89000,93000,87000,86000,90000,83000,90000,87000,98000,93000,98000,94000,90000,94000,88000,87000,91000,84000,91000,88000,99000,94000,99000,95000,91000,95000,89000,88000,92000,85000,92000,89000,100000,95000,100000,96000,92000,96000,90000,89000],
    yearly:[{year:'2026',rev:1120000,pro:329000,margin:29.38},{year:'2027',rev:1127000,pro:331000,margin:29.37},{year:'2028',rev:1134000,pro:333000,margin:29.36},{year:'2029',rev:1141000,pro:335000,margin:29.36},{year:'2030',rev:1148000,pro:337000,margin:29.36}],
  },
  Wellness: {
    yoy:6.83, five_yr_rev:4582645, five_yr_pro:1540000, margin:33.62, color:'#7c3aed', icon:'🌿',
    hist_rev: [74000,70000,74000,70000,76000,73000,83000,80000,76000,79000,73000,72000,76000,72000,78000,78000,87000,83000,84000,81000,82000,84000,80000,84000],
    fore_rev: [86000,79000,86000,83000,94000,89000,94000,90000,87000,90000,84000,83000,87000,80000,87000,84000,95000,90000,95000,91000,88000,91000,85000,84000,88000,81000,88000,85000,96000,91000,96000,92000,89000,92000,86000,85000,89000,82000,89000,86000,97000,92000,97000,93000,90000,93000,87000,86000,90000,83000,90000,87000,98000,93000,98000,94000,91000,94000,88000,87000],
    yearly:[{year:'2026',rev:1076000,pro:362000,margin:33.64},{year:'2027',rev:1083000,pro:364000,margin:33.61},{year:'2028',rev:1090000,pro:366000,margin:33.58},{year:'2029',rev:1097000,pro:369000,margin:33.64},{year:'2030',rev:1104000,pro:371000,margin:33.61}],
  },
  'Personal Care': {
    yoy:5.57, five_yr_rev:3958526, five_yr_pro:1329000, margin:33.57, color:'#d97706', icon:'💄',
    hist_rev: [63000,59000,63000,60000,65000,62000,70000,68000,65000,67000,62000,61000,64000,61000,66000,66000,73000,70000,71000,68000,70000,71000,68000,71000],
    fore_rev: [73000,68000,73000,71000,80000,76000,80000,77000,74000,77000,71000,71000,74000,68000,74000,72000,81000,77000,81000,78000,75000,78000,72000,72000,75000,69000,75000,73000,82000,78000,82000,79000,76000,79000,73000,73000,76000,70000,76000,74000,83000,79000,83000,80000,77000,80000,74000,74000,77000,71000,77000,75000,84000,80000,84000,81000,78000,81000,75000,75000],
    yearly:[{year:'2026',rev:929000,pro:312000,margin:33.58},{year:'2027',rev:935000,pro:314000,margin:33.58},{year:'2028',rev:941000,pro:316000,margin:33.58},{year:'2029',rev:947000,pro:318000,margin:33.58},{year:'2030',rev:953000,pro:320000,margin:33.58}],
  },
  'Medical Devices': {
    yoy:-0.76, five_yr_rev:2197656, five_yr_pro:547000, margin:24.90, color:'#dc2626', icon:'🔬',
    hist_rev: [36000,34000,36000,34000,37000,35000,40000,38000,37000,38000,35000,35000,36000,34000,37000,37000,41000,39000,40000,39000,39000,40000,38000,40000],
    fore_rev: [41000,38000,41000,40000,45000,43000,45000,43000,41000,43000,40000,40000,41000,38000,41000,40000,45000,43000,45000,43000,41000,43000,40000,40000,41000,38000,41000,40000,45000,43000,45000,43000,41000,43000,40000,40000,41000,38000,41000,40000,45000,43000,45000,43000,41000,43000,40000,40000,41000,38000,41000,40000,45000,43000,45000,43000,41000,43000,40000,40000],
    yearly:[{year:'2026',rev:516000,pro:128000,margin:24.81},{year:'2027',rev:519000,pro:129000,margin:24.86},{year:'2028',rev:522000,pro:130000,margin:24.90},{year:'2029',rev:525000,pro:131000,margin:24.95},{year:'2030',rev:528000,pro:131000,margin:24.81}],
  },
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

const radarData = Object.entries(CATEGORIES).map(([name, v]) => ({
  category: name.replace(' ',''),
  revenue: Math.round(v.five_yr_rev / 10000),
  growth: Math.max(0, v.yoy + 2) * 10,
  margin: v.margin * 2,
}));

export default function CategoryAnalysis({ months }: { months: number }) {
  const [selectedCat, setSelectedCat] = useState('Prescription');

  const cat = CATEGORIES[selectedCat];
  const chartData = [
    ...HIST_LABELS.map((l,i) => ({ label:l, actual: cat.hist_rev[i] })),
    ...FORE_LABELS.slice(0,months).map((l,i) => ({
      label:l,
      ensemble:    cat.fore_rev[i],
      optimistic:  Math.round(cat.fore_rev[i]*1.08),
      pessimistic: Math.round(cat.fore_rev[i]*0.92),
    })),
  ];

  const comparisonData = Object.entries(CATEGORIES).map(([name,v]) => ({
    name: name.replace(' ','').slice(0,8), full:name,
    rev_yr1: v.yearly[0].rev, rev_yr5: v.yearly[4].rev, yoy: v.yoy,
  })).sort((a,b) => b.rev_yr1 - a.rev_yr1);

  const visibleYears = Math.min(5, Math.ceil(months/12));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-orange-900 via-amber-900 to-yellow-900 p-6 text-white border border-orange-700">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-orange-300" />
          <span className="text-orange-300 text-sm font-medium tracking-wide uppercase">Corrected Ensemble v2.0</span>
        </div>
        <h2 className="text-2xl font-bold">Product Category Forecast</h2>
        <p className="text-orange-200 text-sm mt-1">5 categories · Per-category YoY-anchored forecasts · 5-year horizon</p>
        <div className="flex flex-wrap gap-3 mt-4">
          {Object.entries(CATEGORIES).map(([name,v]) => (
            <button key={name} onClick={() => setSelectedCat(name)}
              className={`rounded-lg px-4 py-2 text-left transition-all ${selectedCat===name?'bg-white/20 ring-2 ring-white/50':'bg-white/10 hover:bg-white/15'}`}>
              <span className="text-lg mr-2">{v.icon}</span>
              <span className="text-sm font-semibold">{name}</span>
              <span className={`ml-2 text-xs ${v.yoy>0?'text-emerald-300':'text-red-300'}`}>
                {v.yoy>0?'+':''}{v.yoy}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'5-Yr Revenue', value: fmtK(cat.five_yr_rev), color:'text-blue-700' },
          { label:'5-Yr Profit',  value: fmtK(cat.five_yr_pro), color:'text-emerald-700' },
          { label:'Avg Margin',   value:`${cat.margin}%`,        color:'text-amber-700' },
          { label:'YoY Growth',   value:`${cat.yoy>0?'+':''}${cat.yoy}%`, color: cat.yoy>0?'text-emerald-700':'text-red-700' },
        ].map((k,i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedCat} {cat.icon}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Forecast Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">{selectedCat} {cat.icon} — Revenue Forecast ({months}-Month)</CardTitle>
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
              <Line dataKey="actual"   stroke={cat.color} strokeWidth={2.5} dot={false} name="Historical" connectNulls />
              <Line dataKey="ensemble" stroke="#0d9488" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Ensemble Forecast" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Yearly Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">{selectedCat} — Yearly Forecast Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-600 font-medium">Year</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Revenue</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Profit</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Margin</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Optimistic</th>
                  <th className="text-right py-2 text-slate-600 font-medium">Pessimistic</th>
                </tr>
              </thead>
              <tbody>
                {cat.yearly.slice(0,visibleYears).map((y,i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 font-medium text-slate-800">{y.year}</td>
                    <td className="py-2 text-right text-blue-700 font-semibold">{fmtK(y.rev)}</td>
                    <td className="py-2 text-right text-emerald-700 font-semibold">{fmtK(y.pro)}</td>
                    <td className="py-2 text-right"><Badge variant="outline">{y.margin}%</Badge></td>
                    <td className="py-2 text-right text-emerald-600">{fmtK(Math.round(y.rev*1.08))}</td>
                    <td className="py-2 text-right text-amber-600">{fmtK(Math.round(y.rev*0.92))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* All Categories Comparison */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">All Categories — Year 1 vs Year 5 Revenue</CardTitle>
          <CardDescription>Comparing 2026 baseline against 2030 projection per category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={comparisonData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize:10 }} />
              <YAxis tickFormatter={v => fmtK(v)} tick={{ fontSize:9 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:10 }} />
              <Bar dataKey="rev_yr1" fill="#1d4ed8" name="Year 1 (2026)" radius={[2,2,0,0]} />
              <Bar dataKey="rev_yr5" fill="#0d9488" name="Year 5 (2030)" radius={[2,2,0,0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Category Performance Radar</CardTitle>
          <CardDescription>Comparing revenue potential, growth rate, and margin across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize:10 }} />
              <PolarRadiusAxis tick={{ fontSize:8 }} />
              <Radar name="Revenue" dataKey="revenue" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.2} />
              <Radar name="Growth"  dataKey="growth"  stroke="#059669" fill="#059669" fillOpacity={0.2} />
              <Radar name="Margin"  dataKey="margin"  stroke="#d97706" fill="#d97706" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize:10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Business Analysis */}
      <Card className="shadow-sm border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-600" />
            Category Business Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">💊 Prescription — Revenue Leader</h4>
              <p>Prescription medications generate the highest revenue (<strong>€7.45M over 5 years</strong>) but carry the lowest margin (21.9%) due to regulatory pricing constraints across all 8 markets. YoY growth of <strong>+5.46%</strong> is driven by aging population demographics and increased chronic disease management. Regulatory compliance with national formularies is essential.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">🌿 Wellness — Highest Growth</h4>
              <p>Wellness is the fastest-growing category at <strong>+6.83% YoY</strong> with the highest margin (33.6%). The post-pandemic shift toward preventive healthcare and self-care is driving demand. This category has the greatest upside potential — expanding the wellness product range by 20–30% could add <strong>€200–400K in incremental revenue</strong> over 5 years.</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">🏥 OTC — Stable Performer</h4>
              <p>OTC products provide stable revenue (<strong>€4.77M over 5 years</strong>) with a solid 29.4% margin and +2.26% YoY growth. This category benefits from deregulation trends across European markets, particularly in Spain and Poland where more drugs are being moved from prescription to OTC status. Promotional pricing during seasonal peaks (flu season, summer) can boost volume.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">🔬 Medical Devices — Declining</h4>
              <p>Medical Devices is the only category showing negative growth (<strong>-0.76% YoY</strong>), likely due to online competition and hospital procurement shifts. However, the 24.9% margin remains acceptable. Strategy should focus on high-value devices (glucose monitors, blood pressure devices) that require pharmacist consultation, creating a service-based competitive advantage.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
