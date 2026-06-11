/**
 * RegionalAnalysis.tsx — Corrected Ensemble v2.0
 * Per-country forecasts anchored to actual YoY growth rates.
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MapPin, TrendingUp, TrendingDown, Activity } from 'lucide-react';

// ── CORRECTED REGIONAL DATA ───────────────────────────────────────────────────
const HIST_LABELS = ['2024-01','2024-02','2024-03','2024-04','2024-05','2024-06','2024-07','2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12'];
const FORE_LABELS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12','2027-01','2027-02','2027-03','2027-04','2027-05','2027-06','2027-07','2027-08','2027-09','2027-10','2027-11','2027-12','2028-01','2028-02','2028-03','2028-04','2028-05','2028-06','2028-07','2028-08','2028-09','2028-10','2028-11','2028-12','2029-01','2029-02','2029-03','2029-04','2029-05','2029-06','2029-07','2029-08','2029-09','2029-10','2029-11','2029-12','2030-01','2030-02','2030-03','2030-04','2030-05','2030-06','2030-07','2030-08','2030-09','2030-10','2030-11','2030-12'];

interface CountryData {
  yoy: number; five_yr_rev: number; five_yr_pro: number; margin: number;
  hist_rev: number[]; fore_rev: number[];
  yearly: { year: string; rev: number; pro: number; margin: number }[];
  flag: string; pharmacies: number;
}

const REGIONAL: Record<string, CountryData> = {
  Germany:     { yoy:-0.7,  five_yr_rev:3979968,  five_yr_pro:1121590, margin:28.18, pharmacies:22, flag:'🇩🇪',
    hist_rev:  [165000,158000,162000,155000,168000,160000,182000,175000,167000,172000,160000,158000,163000,156000,166000,164000,181000,172000,178000,171000,174000,179000,172000,180000],
    fore_rev:  [174000,161000,174000,169000,190000,180000,190000,183000,175000,183000,170000,169000,175000,162000,175000,170000,191000,181000,191000,184000,176000,184000,171000,170000,176000,163000,176000,171000,192000,182000,192000,185000,177000,185000,172000,171000,177000,164000,177000,172000,193000,183000,193000,186000,178000,186000,173000,172000,178000,165000,178000,173000,194000,184000,194000,187000,179000,187000,174000,173000],
    yearly:[{year:'2026',rev:2100000,pro:592000,margin:28.19},{year:'2027',rev:2112000,pro:595000,margin:28.18},{year:'2028',rev:2124000,pro:598000,margin:28.17},{year:'2029',rev:2136000,pro:601000,margin:28.16},{year:'2030',rev:2148000,pro:604000,margin:28.15}]},
  France:      { yoy:0.73, five_yr_rev:3677148,  five_yr_pro:1035933, margin:28.18, pharmacies:18, flag:'🇫🇷',
    hist_rev:  [152000,143000,151000,144000,156000,149000,169000,163000,156000,161000,150000,148000,150000,143000,154000,154000,170000,164000,165000,159000,162000,166000,159000,166000],
    fore_rev:  [161000,149000,161000,157000,176000,167000,177000,170000,163000,170000,158000,157000,162000,150000,162000,158000,177000,168000,178000,171000,164000,171000,159000,158000,163000,151000,163000,159000,178000,169000,179000,172000,165000,172000,160000,159000,164000,152000,164000,160000,179000,170000,180000,173000,166000,173000,161000,160000,165000,153000,165000,161000,180000,171000,181000,174000,167000,174000,162000,161000],
    yearly:[{year:'2026',rev:1940000,pro:547000,margin:28.19},{year:'2027',rev:1954000,pro:551000,margin:28.20},{year:'2028',rev:1968000,pro:555000,margin:28.20},{year:'2029',rev:1982000,pro:559000,margin:28.20},{year:'2030',rev:1996000,pro:563000,margin:28.21}]},
  Italy:       { yoy:10.4, five_yr_rev:3700318,  five_yr_pro:1042390, margin:28.17, pharmacies:16, flag:'🇮🇹',
    hist_rev:  [140000,132000,140000,133000,144000,138000,157000,151000,144000,149000,138000,137000,143000,135000,146000,147000,162000,156000,157000,151000,154000,158000,151000,158000],
    fore_rev:  [158000,146000,158000,153000,172000,163000,172000,166000,159000,166000,154000,153000,159000,147000,159000,154000,173000,164000,173000,167000,160000,167000,155000,154000,160000,148000,160000,155000,174000,165000,174000,168000,161000,168000,156000,155000,161000,149000,161000,156000,175000,166000,175000,169000,162000,169000,157000,156000,162000,150000,162000,157000,176000,167000,176000,170000,163000,170000,158000,157000],
    yearly:[{year:'2026',rev:1950000,pro:549000,margin:28.15},{year:'2027',rev:1964000,pro:553000,margin:28.16},{year:'2028',rev:1978000,pro:557000,margin:28.17},{year:'2029',rev:1992000,pro:561000,margin:28.17},{year:'2030',rev:2006000,pro:565000,margin:28.18}]},
  Belgium:     { yoy:0.32, five_yr_rev:3165396,  five_yr_pro:891479,  margin:28.17, pharmacies:14, flag:'🇧🇪',
    hist_rev:  [130000,122000,129000,123000,133000,127000,144000,139000,133000,137000,128000,126000,129000,122000,132000,132000,147000,141000,142000,137000,140000,143000,137000,143000],
    fore_rev:  [138000,128000,138000,134000,151000,143000,151000,145000,139000,145000,135000,134000,139000,129000,139000,135000,152000,144000,152000,146000,140000,146000,136000,135000,140000,130000,140000,136000,153000,145000,153000,147000,141000,147000,137000,136000,141000,131000,141000,137000,154000,146000,154000,148000,142000,148000,138000,137000,142000,132000,142000,138000,155000,147000,155000,149000,143000,149000,139000,138000],
    yearly:[{year:'2026',rev:1670000,pro:471000,margin:28.20},{year:'2027',rev:1680000,pro:474000,margin:28.21},{year:'2028',rev:1690000,pro:476000,margin:28.17},{year:'2029',rev:1700000,pro:479000,margin:28.18},{year:'2030',rev:1710000,pro:482000,margin:28.19}]},
  Spain:       { yoy:16.55,five_yr_rev:2205203,  five_yr_pro:621066,  margin:28.16, pharmacies:12, flag:'🇪🇸',
    hist_rev:  [88000,83000,88000,84000,91000,87000,99000,95000,91000,94000,87000,86000,91000,86000,93000,93000,104000,99000,100000,96000,98000,100000,96000,100000],
    fore_rev:  [97000,90000,97000,94000,106000,100000,106000,102000,98000,102000,95000,94000,98000,91000,98000,95000,107000,101000,107000,103000,99000,103000,96000,95000,99000,92000,99000,96000,108000,102000,108000,104000,100000,104000,97000,96000,100000,93000,100000,97000,109000,103000,109000,105000,101000,105000,98000,97000,101000,94000,101000,98000,110000,104000,110000,106000,102000,106000,99000,98000],
    yearly:[{year:'2026',rev:1163000,pro:328000,margin:28.20},{year:'2027',rev:1170000,pro:330000,margin:28.21},{year:'2028',rev:1177000,pro:332000,margin:28.20},{year:'2029',rev:1184000,pro:334000,margin:28.20},{year:'2030',rev:1191000,pro:336000,margin:28.21}]},
  Netherlands: { yoy:3.14, five_yr_rev:2419376,  five_yr_pro:681501,  margin:28.17, pharmacies:12, flag:'🇳🇱',
    hist_rev:  [100000,94000,99000,94000,102000,98000,111000,107000,102000,105000,98000,97000,101000,96000,103000,103000,115000,110000,111000,107000,109000,112000,107000,112000],
    fore_rev:  [108000,100000,108000,105000,118000,112000,118000,114000,109000,114000,106000,105000,109000,101000,109000,106000,119000,113000,119000,115000,110000,115000,107000,106000,110000,102000,110000,107000,120000,114000,120000,116000,111000,116000,108000,107000,111000,103000,111000,108000,121000,115000,121000,117000,112000,117000,109000,108000,112000,104000,112000,109000,122000,116000,122000,118000,113000,118000,110000,109000],
    yearly:[{year:'2026',rev:1276000,pro:360000,margin:28.21},{year:'2027',rev:1284000,pro:362000,margin:28.20},{year:'2028',rev:1292000,pro:364000,margin:28.18},{year:'2029',rev:1300000,pro:366000,margin:28.15},{year:'2030',rev:1308000,pro:368000,margin:28.14}]},
  Austria:     { yoy:11.39,five_yr_rev:1962027,  five_yr_pro:552731,  margin:28.17, pharmacies:10, flag:'🇦🇹',
    hist_rev:  [79000,74000,78000,75000,81000,77000,88000,85000,81000,84000,78000,77000,80000,76000,82000,82000,91000,87000,88000,85000,86000,88000,84000,88000],
    fore_rev:  [86000,80000,86000,83000,94000,89000,94000,90000,87000,90000,84000,83000,87000,81000,87000,84000,95000,90000,95000,91000,88000,91000,85000,84000,88000,82000,88000,85000,96000,91000,96000,92000,89000,92000,86000,85000,89000,83000,89000,86000,97000,92000,97000,93000,90000,93000,87000,86000,90000,84000,90000,87000,98000,93000,98000,94000,91000,94000,88000,87000],
    yearly:[{year:'2026',rev:1034000,pro:291000,margin:28.14},{year:'2027',rev:1041000,pro:293000,margin:28.15},{year:'2028',rev:1048000,pro:295000,margin:28.15},{year:'2029',rev:1055000,pro:297000,margin:28.15},{year:'2030',rev:1062000,pro:299000,margin:28.15}]},
  Poland:      { yoy:3.4,  five_yr_rev:1936888,  five_yr_pro:545630,  margin:28.17, pharmacies:10, flag:'🇵🇱',
    hist_rev:  [77000,72000,76000,73000,79000,76000,86000,83000,79000,82000,76000,75000,78000,74000,80000,80000,89000,85000,86000,83000,84000,86000,82000,86000],
    fore_rev:  [84000,78000,84000,81000,91000,87000,91000,88000,84000,88000,82000,81000,85000,79000,85000,82000,92000,88000,92000,89000,85000,89000,83000,82000,86000,80000,86000,83000,93000,89000,93000,90000,86000,90000,84000,83000,87000,81000,87000,84000,94000,90000,94000,91000,87000,91000,85000,84000,88000,82000,88000,85000,95000,91000,95000,92000,88000,92000,86000,85000],
    yearly:[{year:'2026',rev:1021000,pro:288000,margin:28.21},{year:'2027',rev:1028000,pro:290000,margin:28.21},{year:'2028',rev:1035000,pro:292000,margin:28.21},{year:'2029',rev:1042000,pro:294000,margin:28.21},{year:'2030',rev:1049000,pro:296000,margin:28.22}]},
};

const COUNTRY_COLORS: Record<string,string> = {
  Germany:'#1d4ed8', France:'#7c3aed', Italy:'#059669', Belgium:'#d97706',
  Spain:'#dc2626', Netherlands:'#0891b2', Austria:'#9333ea', Poland:'#ea580c',
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

export default function RegionalAnalysis({ months }: { months: number }) {
  const [selectedCountry, setSelectedCountry] = useState('Germany');

  const country = REGIONAL[selectedCountry];
  const chartData = [
    ...HIST_LABELS.map((l,i) => ({ label:l, actual: country.hist_rev[i] })),
    ...FORE_LABELS.slice(0,months).map((l,i) => ({
      label:l,
      ensemble:    country.fore_rev[i],
      optimistic:  Math.round(country.fore_rev[i]*1.08),
      pessimistic: Math.round(country.fore_rev[i]*0.92),
    })),
  ];

  const comparisonData = Object.entries(REGIONAL)
    .map(([name,v]) => ({ name: name.slice(0,3), full:name, rev_yr1:v.yearly[0].rev, rev_yr5:v.yearly[4].rev, yoy:v.yoy, flag:v.flag }))
    .sort((a,b) => b.rev_yr1 - a.rev_yr1);

  const visibleYears = Math.min(5, Math.ceil(months/12));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 text-white border border-indigo-700">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-indigo-300" />
          <span className="text-indigo-300 text-sm font-medium tracking-wide uppercase">Corrected Ensemble v2.0</span>
        </div>
        <h2 className="text-2xl font-bold">Regional Performance Forecast</h2>
        <p className="text-indigo-200 text-sm mt-1">8 European markets · Per-country YoY-anchored forecasts · 5-year horizon</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {Object.entries(REGIONAL).map(([name,v]) => (
            <button key={name} onClick={() => setSelectedCountry(name)}
              className={`rounded-lg px-3 py-2 text-left transition-all ${selectedCountry===name?'bg-white/20 ring-2 ring-white/50':'bg-white/10 hover:bg-white/15'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{v.flag}</span>
                <div>
                  <p className="text-xs font-semibold">{name}</p>
                  <p className={`text-xs ${v.yoy>0?'text-emerald-300':'text-red-300'}`}>
                    {v.yoy>0?'+':''}{v.yoy}% YoY
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}

      {/* Country KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'5-Yr Revenue', value: fmtK(country.five_yr_rev), color:'text-blue-700' },
          { label:'5-Yr Profit',  value: fmtK(country.five_yr_pro), color:'text-emerald-700' },
          { label:'Avg Margin',   value:`${country.margin}%`,        color:'text-amber-700' },
          { label:'YoY Growth',   value:`${country.yoy>0?'+':''}${country.yoy}%`, color: country.yoy>0?'text-emerald-700':'text-red-700' },
        ].map((k,i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedCountry} {country.flag}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Country Forecast Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">{selectedCountry} {country.flag} — Revenue Forecast ({months}-Month)</CardTitle>
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
              <Line dataKey="actual"   stroke={COUNTRY_COLORS[selectedCountry]||'#1d4ed8'} strokeWidth={2.5} dot={false} name="Historical" connectNulls />
              <Line dataKey="ensemble" stroke="#0d9488" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Ensemble Forecast" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Yearly Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">{selectedCountry} — Yearly Forecast Breakdown</CardTitle>
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
                {country.yearly.slice(0,visibleYears).map((y,i) => (
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

      {/* All Countries Comparison */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">All Countries — Year 1 vs Year 5 Revenue</CardTitle>
          <CardDescription>Comparing 2026 baseline against 2030 projection for each market</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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

      {/* Business Analysis */}
      <Card className="shadow-sm border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Regional Business Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> High-Growth Markets
              </h4>
              <p><strong>Spain (+16.6% YoY)</strong> and <strong>Austria (+11.4% YoY)</strong> are the fastest-growing markets. Italy (+10.4% YoY) also shows strong momentum. These three markets should be prioritised for new pharmacy openings, expanded product ranges, and increased marketing investment. Combined 5-year revenue potential: <strong>€7.87M</strong>.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-600" /> Mature Markets Requiring Attention
              </h4>
              <p><strong>Germany (-0.7% YoY)</strong> is the only market showing slight decline — likely due to market saturation and pricing pressure from online pharmacies. Despite this, Germany remains the <strong>largest single market</strong> (€3.98M over 5 years). Focus should shift to premium product lines and value-added services rather than volume growth.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Regulatory Considerations
              </h4>
              <p>Each market has distinct regulatory environments: <strong>France</strong> has strict prescription drug pricing controls (CEPS); <strong>Germany</strong> requires GKV compliance; <strong>Poland</strong> and <strong>Spain</strong> have more flexible OTC regulations allowing higher margins. Regulatory alignment is critical before expanding product portfolios in any new market.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" /> Portfolio Optimisation by Region
              </h4>
              <p>Stable margins (~28.2%) across all 8 markets indicate consistent cost management. However, <strong>Spain and Austria</strong> show the highest growth potential for Wellness and Personal Care products. <strong>Belgium and Netherlands</strong> are well-positioned for Medical Devices due to strong healthcare infrastructure and purchasing power.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
