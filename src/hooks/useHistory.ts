import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prediction } from '../services/classifier';

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

export function useHistory() {
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

  return { records, loaded, add, clear };
}
