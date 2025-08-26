import { Waves, BarChart2, Droplets, Wind } from 'lucide-react';
import type { MetricType } from '../types';

export const getMetricIcon = (metric: MetricType) => {
  const iconMap = {
    flujo: Waves,
    nivel: BarChart2,
    caudal: Droplets,
    velocidad: Wind,
  };
  return iconMap[metric];
};