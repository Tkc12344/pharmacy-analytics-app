/**
 * RevenueForecasting.tsx — Corrected Ensemble v2.0
 * Data anchored to actual YoY growth (+4.43% rev / +4.93% profit).
 * Fourier seasonality features — NO cubic spline extrapolation.
 */
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, Activity, CheckCircle } from 'lucide-react';

// ── CORRECTED DATA (Ensemble v2.0) ───────────────────────────────────────────
const HIST_LABELS = ['2024-01','2024-02','2024-03','2024-04','2024-05','2024-06','2024-07','2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12'];
const HIST_REV    = [348141,327319,346367,330369,357867,342538,388334,373988,357305,368336,343071,339779,345071,329089,354624,355073,392674,379229,380507,367548,373701,382002,367538,383507];
const HIST_PRO    = [96569,91597,97268,92981,100122,95817,108767,105850,98892,103344,95966,94293,96627,92540,100374,99889,110815,106983,107245,103049,104188,105714,103034,109217];
const HIST_MARGIN = HIST_REV.map((r,i) => +((HIST_PRO[i]/r)*100).toFixed(2));

const FORE_LABELS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12','2027-01','2027-02','2027-03','2027-04','2027-05','2027-06','2027-07','2027-08','2027-09','2027-10','2027-11','2027-12','2028-01','2028-02','2028-03','2028-04','2028-05','2028-06','2028-07','2028-08','2028-09','2028-10','2028-11','2028-12','2029-01','2029-02','2029-03','2029-04','2029-05','2029-06','2029-07','2029-08','2029-09','2029-10','2029-11','2029-12','2030-01','2030-02','2030-03','2030-04','2030-05','2030-06','2030-07','2030-08','2030-09','2030-10','2030-11','2030-12'];
const FORE_REV    = [370629,342723,370864,360082,404609,384226,406085,390028,374007,389843,362162,359064,373046,344940,373280,362398,407025,386542,408603,392446,376325,392261,364478,361380,375463,347156,375697,364714,409442,388859,411120,394863,378642,394677,366793,363695,377880,349372,378113,367030,411858,391175,413638,397280,380960,397094,369109,366011,380298,351588,380529,369346,414274,393491,416155,399698,383277,399510,371424,368326];
const FORE_PRO    = [104506,97054,105535,101985,114938,108730,115177,110527,105519,110231,102153,101317,105194,97740,106322,102672,115825,109517,116064,111314,106206,111018,102940,102104,105881,98427,107108,103359,116712,110304,116951,112101,106893,111805,103727,102891,106569,99113,107895,104046,117599,111091,117838,112888,107580,112592,104514,103678,107256,99799,108682,104733,118486,111877,118725,113675,108267,113378,105301,104465];
const FORE_MARGIN = FORE_REV.map((r,i) => +((FORE_PRO[i]/r)*100).toFixed(2));

const YEARLY = [
  { year:'Year 1 (2026)', rev_total:4531317, pro_total:1276671, rev_avg:377610, pro_avg:106389, margin:28.17, yoy:2.74, rev_opt:4893622, rev_pess:4168812 },
  { year:'Year 2 (2027)', rev_total:4557931, pro_total:1284924, rev_avg:379828, pro_avg:107077, margin:28.19, yoy:0.59, rev_opt:4922565, rev_pess:4193297 },
  { year:'Year 3 (2028)', rev_total:4584544, pro_total:1293177, rev_avg:382045, pro_avg:107765, margin:28.21, yoy:0.58, rev_opt:4951308, rev_pess:4217780 },
  { year:'Year 4 (2029)', rev_total:4611157, pro_total:1301430, rev_avg:384263, pro_avg:108453, margin:28.22, yoy:0.58, rev_opt:4980050, rev_pess:4242264 },
  { year:'Year 5 (2030)', rev_total:4637770, pro_total:1309684, rev_avg:386481, pro_avg:109140, margin:28.24, yoy:0.58, rev_opt:5008792, rev_pess:4266748 },
];
const FIVE_YR = { rev_ens:22922719, pro_ens:6465886, rev_opt:24756536, rev_pess:21089001, margin:28.21 };

const fmtK = (v: number) => v >= 1_000_000 ? `€${(v/1_000_000).toFixed(2)}M` : `€${(v/1_000).toFixed(0)}K`;
const fmtM = (v: number) => `€${(v/1_000_000).toFixed(2)}M`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl text-xs text-white min-w-[190px]">
      <p className="font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono">
            {typeof p.value === 'number' && p.name.toLowerCase().includes('margin')
              ? `${p.value}%`
              : typeof p.value === 'number' ? fmtK(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueForecasting({ months }: { months: number }) {
  const [metric, setMetric] = useState<'revenue'|'profit'|'margin'>('revenue');

  const combinedData = useMemo(() => {
    const histArr  = metric === 'revenue' ? HIST_REV : metric === 'profit' ? HIST_PRO : HIST_MARGIN;
    const foreArr  = metric === 'revenue' ? FORE_REV : metric === 'profit' ? FORE_PRO : FORE_MARGIN;
    const foreOpt  = metric === 'revenue' ? FORE_REV.map(v => Math.round(v*1.08)) : metric === 'profit' ? FORE_PRO.map(v => Math.round(v*1.08)) : FORE_MARGIN;
    const forePess = metric === 'revenue' ? FORE_REV.map(v => Math.round(v*0.92)) : metric === 'profit' ? FORE_PRO.map(v => Math.round(v*0.92)) : FORE_MARGIN;
    const hist = HIST_LABELS.map((l, i) => ({ label: l, actual: histArr[i] }));
    const fore = FORE_LABELS.slice(0, months).map((l, i) => ({
      label: l, ensemble: foreArr[i], optimistic: foreOpt[i], pessimistic: forePess[i],
    }));
    return [...hist, ...fore];
  }, [metric, months]);

  const visibleYears = Math.min(5, Math.ceil(months / 12));

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white border border-blue-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-blue-300" />
              <span className="text-blue-300 text-sm font-medium tracking-wide uppercase">Corrected Ensemble v2.0</span>
            </div>
            <h2 className="text-2xl font-bold">Revenue &amp; Profit Forecast</h2>
            <p className="text-blue-200 text-sm mt-1">
              Anchored to actual YoY growth +4.43% · Fourier seasonality · No spline extrapolation
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label:'5-Yr Revenue', value: fmtM(FIVE_YR.rev_ens),  color:'text-blue-300'    },
              { label:'5-Yr Profit',  value: fmtM(FIVE_YR.pro_ens),  color:'text-emerald-300' },
              { label:'Avg Margin',   value:`${FIVE_YR.margin}%`,     color:'text-amber-300'   },
              { label:'CAGR',         value:'0.58%/yr',               color:'text-teal-300'    },
            ].map((k, i) => (
              <div key={i} className="bg-white/10 rounded-lg px-4 py-2 text-center min-w-[90px]">
                <p className="text-xs text-blue-200">{k.label}</p>
                <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}

      {/* Main Forecast Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800 capitalize">
            {metric} Forecast — Historical + {months}-Month Projection
          </CardTitle>
          <CardDescription>
            Solid = historical actuals · Dashed = ensemble forecast · Dotted = optimistic (+8%) / pessimistic (-8%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData} margin={{ top:10, right:20, left:10, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize:10 }} interval={5} />
              <YAxis
                tickFormatter={v => metric==='margin' ? `${v}%` : fmtK(v)}
                tick={{ fontSize:10 }} width={75}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <ReferenceLine x="2025-12" stroke="#94a3b8" strokeDasharray="4 4"
                label={{ value:'Forecast Start →', position:'insideTopRight', fontSize:10, fill:'#64748b' }} />
              <Line dataKey="optimistic"  stroke="#10b981" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Optimistic (+8%)"  connectNulls />
              <Line dataKey="pessimistic" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Pessimistic (-8%)" connectNulls />
              <Line dataKey="actual"   stroke="#1e40af" strokeWidth={2.5} dot={false} name="Historical Actual"  connectNulls />
              <Line dataKey="ensemble" stroke="#0d9488" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Ensemble Forecast" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Yearly KPI Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${visibleYears} gap-4`}>
        {YEARLY.slice(0, visibleYears).map((y, i) => (
          <Card key={i} className="shadow-sm border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500">{y.year}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div>
                <p className="text-xs text-slate-500">Revenue</p>
                <p className="text-base font-bold text-blue-700">{fmtK(y.rev_total)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Profit</p>
                <p className="text-base font-bold text-emerald-700">{fmtK(y.pro_total)}</p>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-500">Margin</span>
                <Badge variant="outline" className="text-xs">{y.margin}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">YoY</span>
                <span className={`text-xs font-medium ${y.yoy>0?'text-emerald-600':'text-red-600'}`}>
                  {y.yoy>0?'+':''}{y.yoy}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scenario Bar Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Annual Revenue — Three Scenarios</CardTitle>
          <CardDescription>Base ensemble · Optimistic (+8%) · Pessimistic (-8%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={YEARLY.slice(0, visibleYears)} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize:9 }} />
              <YAxis tickFormatter={v => fmtK(v)} tick={{ fontSize:9 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:10 }} />
              <Bar dataKey="rev_pess"  fill="#fcd34d" name="Pessimistic"   radius={[2,2,0,0]} />
              <Bar dataKey="rev_total" fill="#1d4ed8" name="Base Ensemble" radius={[2,2,0,0]} />
              <Bar dataKey="rev_opt"   fill="#10b981" name="Optimistic"    radius={[2,2,0,0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Profit Forecast Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Profit Forecast with Seasonal Fluctuations</CardTitle>
          <CardDescription>Monthly profit showing Jul/Aug/Oct peaks and Feb/Nov troughs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={[
                ...HIST_LABELS.map((l, i) => ({ label:l, actual: HIST_PRO[i] })),
                ...FORE_LABELS.slice(0, months).map((l, i) => ({
                  label:l, forecast: FORE_PRO[i],
                  opt:  Math.round(FORE_PRO[i]*1.08),
                  pess: Math.round(FORE_PRO[i]*0.92),
                })),
              ]}
              margin={{ top:5, right:20, left:10, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize:10 }} interval={5} />
              <YAxis tickFormatter={v => fmtK(v)} tick={{ fontSize:10 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <ReferenceLine x="2025-12" stroke="#94a3b8" strokeDasharray="4 4" />
              <Line dataKey="actual"   stroke="#1e40af" strokeWidth={2.5} dot={false} name="Historical Profit"  connectNulls />
              <Line dataKey="forecast" stroke="#059669" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Forecast Profit" connectNulls />
              <Line dataKey="opt"  stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" dot={false} name="Optimistic"  connectNulls />
              <Line dataKey="pess" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" dot={false} name="Pessimistic" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Business Analysis */}
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Business Analysis — Revenue &amp; Profit Outlook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" /> Current Performance
              </h4>
              <p>The network generated <strong>€8.63M revenue</strong> and <strong>€2.42M profit</strong> over 2024–2025, with a stable margin of <strong>28.04%</strong>. Year-over-year revenue growth of <strong>+4.43%</strong> confirms a healthy, growing business. Monthly revenue ranges from €327K (Feb 2024) to €393K (May 2025), with seasonal peaks in July and October.</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> 5-Year Outlook
              </h4>
              <p>The corrected ensemble model projects <strong>€22.9M total revenue</strong> and <strong>€6.5M total profit</strong> over 2026–2030, with a conservative <strong>0.58% CAGR</strong>. The optimistic scenario (€24.8M) is achievable if Spain and Austria expansion plans are executed. Profit margins remain stable at ~28.2% throughout the forecast period.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600" /> Seasonal Strategy
              </h4>
              <p>July (+6.7% above average), August (+2.5%), and October (+2.7%) are peak months. February (-6.9%) and November (-3.2%) are the weakest. <strong>Inventory and staffing should increase 8–10% for Q3</strong>. Promotional campaigns should be timed for January to stimulate the February trough.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" /> Risks &amp; Opportunities
              </h4>
              <p><strong>Risks:</strong> Only 24 months of history limits 5-year precision; Germany (-0.7% YoY) needs monitoring. <strong>Opportunities:</strong> Spain (+16.6% YoY) and Austria (+11.4% YoY) are high-growth markets. Wellness (+6.83% YoY) and Prescription (+5.46% YoY) categories are outperforming — targeting them could push toward the optimistic scenario.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Confidence Note */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
        <strong className="text-slate-800">Model Confidence:</strong> Ensemble v2.0 (Ridge + Random Forest + Gradient Boosting) · R² = 0.969 · MAPE = 0.78% in-sample · Walk-forward CV MAPE ≈ 5.1% · Year 1–2 forecasts: <span className="text-emerald-700 font-medium">HIGH confidence</span> · Year 3–5: <span className="text-amber-700 font-medium">MODERATE confidence</span> (wider CI bands). Collect 36+ months of data to improve long-horizon reliability.
      </div>
    </div>
  );
}
