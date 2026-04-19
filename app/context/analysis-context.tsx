'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnalysisResult {
  stats: any;
  coaching: any;
}

interface AnalysisContextType {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType>({
  result: null,
  setResult: () => {},
});

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<AnalysisResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('r6_analysis');
    if (stored) {
      try { setResultState(JSON.parse(stored)); } catch {}
    }
    setLoaded(true);
  }, []);

  const setResult = (r: AnalysisResult | null) => {
    setResultState(r);
    if (r) {
      sessionStorage.setItem('r6_analysis', JSON.stringify(r));
    } else {
      sessionStorage.removeItem('r6_analysis');
    }
  };

  return (
    <AnalysisContext.Provider value={{ result, setResult }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
