// Tipos principales de la aplicación
export type MetricDataPoint = {
  time: Date;
  station1: number;
  station2: number;
};

export type MetricType = 'flujo' | 'nivel' | 'caudal' | 'velocidad';
export type Theme = 'light' | 'dark' | 'system';
export type TimeRange = '1h' | '6h' | '24h' | '30m';

// Re-exportar tipos de reportes
export * from './reports';
