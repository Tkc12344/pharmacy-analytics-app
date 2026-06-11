import { createContext, useContext, useState, ReactNode } from 'react';

interface MonthRangeContextType {
  months: number;
  setMonths: (m: number) => void;
}

const MonthRangeContext = createContext<MonthRangeContextType>({
  months: 60,
  setMonths: () => {},
});

export function MonthRangeProvider({ children }: { children: ReactNode }) {
  const [months, setMonths] = useState(60);
  return (
    <MonthRangeContext.Provider value={{ months, setMonths }}>
      {children}
    </MonthRangeContext.Provider>
  );
}

export function useMonthRange() {
  return useContext(MonthRangeContext);
}
