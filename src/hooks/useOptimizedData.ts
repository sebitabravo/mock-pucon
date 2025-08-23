import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// Tipos locales (temporalmente hasta que se refactorice)
type MetricDataPoint = {
  time: Date;
  station1: number;
  station2: number;
};
type MetricType = 'flujo' | 'nivel' | 'caudal' | 'velocidad';
type TimeRange = '1h' | '6h' | '24h' | '30m';

// Hook para debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para estado persistente
export const usePersistentState = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setState(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [state, setValue];
};

// Generador de datos optimizado con cache
const generateFullDayData = (): MetricDataPoint[] => {
  const data = [];
  const now = new Date();
  // Generar datos para las últimas 24 horas (1440 minutos)
  for (let i = 1440; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time,
      station1: 100 + Math.sin(i / 100) * 15 + Math.random() * 10 - 5,
      station2: 105 + Math.cos(i / 80) * 15 + Math.random() * 10 - 5,
    });
  }
  return data;
};

// Hook optimizado para datos con cache
export const useOptimizedData = () => {
  const [fullData, setFullData] = useState<MetricDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFullData(generateFullDayData());
      setIsLoading(false);
      lastUpdateRef.current = Date.now();
    };
    loadData();
  }, []);

  // Actualización optimizada cada 3 segundos
  useEffect(() => {
    if (isLoading) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      // Solo actualizar si han pasado al menos 3 segundos
      if (now - lastUpdateRef.current >= 3000) {
        setFullData(prevData => {
          const newTime = new Date();
          const newDataPoint = {
            time: newTime,
            station1: 100 + Math.sin(newTime.getTime() / 100000) * 15 + Math.random() * 10 - 5,
            station2: 105 + Math.cos(newTime.getTime() / 80000) * 15 + Math.random() * 10 - 5,
          };
          lastUpdateRef.current = now;
          return [...prevData.slice(1), newDataPoint];
        });
      }
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading]);

  return { fullData, isLoading };
};

// Hook optimizado para datos de gráficos con memoización
export const useOptimizedChartData = (fullData: MetricDataPoint[], timeRange: TimeRange, isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || fullData.length === 0) return [];
    const now = new Date();
    const minutesAgo = { '30m': 30, '1h': 60, '6h': 360, '24h': 1440 }[timeRange];
    const filterDate = new Date(now.getTime() - minutesAgo * 60000);
    return fullData.filter(d => d.time > filterDate);
  }, [fullData, timeRange, isLoading]);
};

// Hook optimizado para datos más recientes
export const useOptimizedLatestData = (fullData: MetricDataPoint[], isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || fullData.length === 0) return { station1: 0, station2: 0 };
    return fullData[fullData.length - 1];
  }, [fullData, isLoading]);
};

// Hook optimizado para métricas
export const useOptimizedMetrics = (latestData: { station1: number; station2: number }) => {
  return useMemo(() => ({
    flujo: { station1: latestData.station1 * 1.2, station2: latestData.station2 * 1.1 },
    nivel: { station1: latestData.station1 / 50, station2: latestData.station2 / 48 },
    caudal: { station1: latestData.station1 * 15, station2: latestData.station2 * 14 },
    velocidad: { station1: latestData.station1 / 60, station2: latestData.station2 / 58 },
  }), [latestData.station1, latestData.station2]);
};

// Hook optimizado para datos de sparkline
export const useOptimizedSparklineData = (fullData: MetricDataPoint[], selectedMetric: MetricType, isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || fullData.length === 0) return { station1: [], station2: [] };

    const recentData = fullData.slice(-20);
    const multipliers = {
      flujo: { station1: 1.2, station2: 1.1 },
      nivel: { station1: 1/50, station2: 1/48 },
      caudal: { station1: 15, station2: 14 },
      velocidad: { station1: 1/60, station2: 1/58 },
    };

    return {
      station1: recentData.map(d => ({
        value: d.station1 * multipliers[selectedMetric].station1,
        time: d.time
      })),
      station2: recentData.map(d => ({
        value: d.station2 * multipliers[selectedMetric].station2,
        time: d.time
      }))
    };
  }, [fullData, selectedMetric, isLoading]);
};

// Hook optimizado para datos de temperatura
export const useOptimizedTemperatureData = (fullData: MetricDataPoint[], isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || fullData.length === 0) return [];

    const recentData = fullData.slice(-20);
    return recentData.map(d => ({
      value: 12.5 + Math.sin(d.time.getTime() / 1000000) * 2 + Math.random() * 0.5 - 0.25,
      time: d.time
    }));
  }, [fullData, isLoading]);
};
