import { useMonthRange } from '@/contexts/MonthRangeContext';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const QUICK = [
  { label: '6M',  value: 6 },
  { label: '1Y',  value: 12 },
  { label: '2Y',  value: 24 },
  { label: '3Y',  value: 36 },
  { label: '5Y',  value: 60 },
];

function monthsToLabel(m: number): string {
  if (m < 12) return `${m} month${m === 1 ? '' : 's'}`;
  const y = Math.floor(m / 12);
  const rem = m % 12;
  if (rem === 0) return `${y} year${y === 1 ? '' : 's'}`;
  return `${y}y ${rem}m`;
}

export default function MonthRangeSelector() {
  const { months, setMonths } = useMonthRange();

  const handleInput = (val: string) => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) setMonths(Math.min(60, Math.max(1, n)));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
      {/* Label */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="p-1.5 bg-teal-500/20 rounded-md">
          <Calendar className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Forecast Horizon</p>
          <p className="text-lg font-bold text-white leading-tight">{monthsToLabel(months)}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="flex-1 w-full sm:w-auto">
        <Slider
          min={1}
          max={60}
          step={1}
          value={[months]}
          onValueChange={([v]) => setMonths(v)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1 px-0.5">
          <span className="text-slate-500">1 month</span>
          <span className="text-slate-500">60 months</span>
        </div>
      </div>

      {/* Numeric input */}
      <div className="flex items-center gap-2 shrink-0">
        <Input
          type="number"
          min={1}
          max={60}
          value={months}
          onChange={(e) => handleInput(e.target.value)}
          className="w-16 text-center font-semibold text-white bg-slate-800 border-slate-700 h-9"
        />
          <span className="text-xs text-slate-400 whitespace-nowrap">months</span>
      </div>

      {/* Quick-select buttons */}
      <div className="flex gap-1.5 shrink-0 flex-wrap">
        {QUICK.map(({ label, value }) => (
          <Button
            key={value}
            size="sm"
            variant={months === value ? 'default' : 'outline'}
            className="h-8 px-3 text-xs font-semibold"
            onClick={() => setMonths(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
