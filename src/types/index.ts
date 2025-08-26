// === TIPOS PRINCIPALES DE LA APLICACIÓN ===
import React from 'react';

// Tipos de datos
export type MetricDataPoint = {
  time: Date;
  station1: number;
  station2: number;
};

export type MetricType = 'flujo' | 'nivel' | 'caudal' | 'velocidad';
export type Theme = 'light' | 'dark' | 'system';
export type TimeRange = '1h' | '6h' | '24h' | '30m';
export type StationName = 'station1' | 'station2';
export type TrendDirection = 'up' | 'down' | 'stable';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

// Tipos de métricas
export interface MetricConfig {
  unit: string;
  icon: React.ComponentType<any>;
  tooltip: string;
}

export interface MetricValue {
  station1: number;
  station2: number;
}

export interface Metrics {
  flujo: MetricValue;
  nivel: MetricValue;
  caudal: MetricValue;
  velocidad: MetricValue;
}

// Tipos de componentes
export interface SparklineData {
  value: number;
  time: Date;
}

export interface ChartData {
  station1: SparklineData[];
  station2: SparklineData[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Tipos de props para componentes
export interface MetricCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  unit: string;
  tooltipContent: string;
  colorClass?: string;
  trend?: TrendDirection;
  stationName?: string;
  sparklineData?: SparklineData[];
  sparklineColor?: string;
}

export interface CustomTooltipProps {
  title: string;
  content: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  icon?: React.ComponentType<any>;
  value?: number;
  unit?: string;
  trend?: TrendDirection;
}

export interface TimeFlowChartProps {
  data: MetricDataPoint[];
  metric: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  unit: string;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
}

export interface FullscreenChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MetricDataPoint[];
  metric: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  unit: string;
}

// Re-exportar tipos de reportes
export * from './reports';
