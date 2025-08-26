import React, { memo } from 'react';
import MetricCard from '../ui/MetricCard';
import TimeFlowChart from '../charts/TimeFlowChart';
import ComparisonGauge from '../charts/ComparisonGauge';
import TemperatureCard from '../ui/TemperatureCard';
import SkeletonCard from '../ui/SkeletonCard';
import SkeletonChart from '../ui/SkeletonChart';
import SkeletonGauge from '../ui/SkeletonGauge';
import { VISUAL_CONFIG } from '../../config/constants';
import type { MetricDataPoint, MetricType, ChartData, SparklineData, MetricConfig } from '../../types';

interface DashboardGridProps {
  isLoading: boolean;
  chartData: MetricDataPoint[];
  metrics: Record<string, { station1: number; station2: number }>;
  sparklineData: ChartData;
  temperatureData: SparklineData[];
  selectedMetric: MetricType;
  metricConfig: MetricConfig;
}

// Removido itemVariants ya que no se usa en este componente

const DashboardGrid: React.FC<DashboardGridProps> = ({
  isLoading,
  chartData,
  metrics,
  sparklineData,
  temperatureData,
  selectedMetric,
  metricConfig
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading ? (
        <>
          <SkeletonChart />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonGauge />
          <SkeletonCard />
        </>
      ) : (
        <>
          <TimeFlowChart
            data={chartData}
            metric={selectedMetric}
            unit={metricConfig.unit}
          />
          <MetricCard
            icon={metricConfig.icon}
            title={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
            value={metrics[selectedMetric]?.station1 || 0}
            unit={metricConfig.unit}
            tooltipContent={metricConfig.tooltip}
            colorClass="text-emerald-500 dark:text-emerald-400"
            trend="stable"
            stationName="Estación 1"
            sparklineData={sparklineData.station1}
            sparklineColor={VISUAL_CONFIG.colors.station1}
          />
          <MetricCard
            icon={metricConfig.icon}
            title={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
            value={metrics[selectedMetric]?.station2 || 0}
            unit={metricConfig.unit}
            tooltipContent={metricConfig.tooltip}
            colorClass="text-sky-500 dark:text-sky-400"
            trend="up"
            stationName="Estación 2"
            sparklineData={sparklineData.station2}
            sparklineColor={VISUAL_CONFIG.colors.station2}
          />
          <ComparisonGauge 
            data={metrics} 
            dataKey={selectedMetric} 
            title={`Comparativa de ${selectedMetric}`} 
            tooltipContent={`Visualización comparativa del ${selectedMetric} entre la Estación 1 (verde) y la Estación 2 (azul).`} 
          />
          <TemperatureCard temperatureData={temperatureData} />
        </>
      )}
    </div>
  );
};

export default memo(DashboardGrid);