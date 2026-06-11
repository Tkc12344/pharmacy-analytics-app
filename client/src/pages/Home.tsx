import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, BarChart3, MapPin, Package, Store,
  Zap, Layers, Activity
} from 'lucide-react';
import RevenueForecasting from '@/pages/RevenueForecasting';
import RegionalAnalysis from '@/pages/RegionalAnalysis';
import CategoryAnalysis from '@/pages/CategoryAnalysis';
import ProductAnalysis from '@/pages/ProductAnalysis';
import PharmacyAnalysis from '@/pages/PharmacyAnalysis';
import PrescriptiveAnalysis from '@/pages/PrescriptiveAnalysis';
import EnsembleForecast from '@/pages/EnsembleForecast';
import MonthRangeSelector from '@/components/MonthRangeSelector';
import LiveDashboard from '@/components/LiveDashboard';
import { useMonthRange } from '@/contexts/MonthRangeContext';
import { useLiveClock } from '@/hooks/useLiveData';

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function Home() {
  const [activeTab, setActiveTab] = useState('live');
  const { months } = useMonthRange();
  const now = useLiveClock();
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg shadow-lg shadow-teal-500/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-none">Pharmacy Analytics</h1>
                <p className="text-xs text-slate-500 mt-0.5">Live Intelligence Platform · 120 Pharmacies · 8 Markets</p>
              </div>
            </div>

            {/* Right: live clock + status */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-teal-300 font-semibold">{timeStr}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                <span className="text-slate-600">|</span>
                <span>v2.0 Ensemble</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MONTH RANGE SELECTOR ────────────────────────────────────────────── */}
      <div className="container pt-4 pb-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <MonthRangeSelector />
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────────────────────── */}
      <section className="container pb-12 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* Tab bar */}
          <TabsList className="flex w-full mb-6 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto gap-0.5">
            <TabsTrigger value="live"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-teal-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <Activity className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger value="overview"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="regional"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <MapPin className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Regional</span>
            </TabsTrigger>
            <TabsTrigger value="category"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Category</span>
            </TabsTrigger>
            <TabsTrigger value="products"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <Package className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="pharmacies"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <Store className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptive"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-amber-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="ensemble"
              className="flex-1 text-xs sm:text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white
                text-slate-400 hover:text-slate-200 transition-colors rounded-lg py-2 px-2 min-w-[70px]">
              <Layers className="w-3.5 h-3.5 mr-1.5 inline" />
              <span className="hidden sm:inline">Ensemble</span>
            </TabsTrigger>
          </TabsList>

          {/* Live dashboard tab */}
          <TabsContent value="live" className="space-y-0 mt-0">
            <LiveDashboard />
          </TabsContent>

          {/* Forecast & analysis tabs — wrapped in dark card for consistency */}
          {[
            { value: 'overview',     Component: RevenueForecasting },
            { value: 'regional',     Component: RegionalAnalysis   },
            { value: 'category',     Component: CategoryAnalysis   },
            { value: 'products',     Component: ProductAnalysis    },
            { value: 'pharmacies',   Component: PharmacyAnalysis   },
            { value: 'prescriptive', Component: PrescriptiveAnalysis },
            { value: 'ensemble',     Component: EnsembleForecast   },
          ].map(({ value, Component }) => (
            <TabsContent key={value} value={value} className="space-y-6 mt-0">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-1">
                <Component months={months} />
              </div>
            </TabsContent>
          ))}

        </Tabs>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>Pharmacy Analytics Platform v2.0 — Corrected Ensemble Model (GB + RF + Ridge)</span>
            <span>Historical: Jan 2024 – Dec 2025 · Forecast: Jan 2026 – Dec 2030</span>
            <span>62,139 transactions · 120 pharmacies · 8 European markets</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
