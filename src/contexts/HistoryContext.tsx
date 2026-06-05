import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Prediction } from '../services/classifier';

const KEY = '@plantdoctor/history';

export interface ScanRecord {
  id: string;
  uri: string;
  crop: string;
  name: string;
  healthy: boolean;
  severity: string;
  confidence: number;
  date: number;
}

interface HistoryContextValue {
  records: ScanRecord[];
  loaded: boolean;
  add: (uri: string, p: Prediction) => ScanRecord;
  clear: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => setRecords(raw ? JSON.parse(raw) : []))
      .catch(() => setRecords([]))
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback(async (next: ScanRecord[]) => {
    setRecords(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const add = useCallback(
    (uri: string, p: Prediction) => {
      const rec: ScanRecord = {
        id: `${Date.now()}`,
        uri,
        crop: p.info.crop,
        name: p.info.name,
        healthy: p.info.healthy,
        severity: p.info.severity,
        confidence: p.confidence,
        date: Date.now(),
      };
      persist([rec, ...records].slice(0, 100));
      return rec;
    },
    [records, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return (
    <HistoryContext.Provider value={{ records, loaded, add, clear }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryContext(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistoryContext must be used within HistoryProvider');
  return ctx;
}
