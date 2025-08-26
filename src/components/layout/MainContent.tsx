import React from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../../contexts/DashboardContext';
import { useOptimizedData, useOptimizedChartData, useOptimizedLatestData, useOptimizedMetrics, useOptimizedSparklineData, useOptimizedTemperatureData } from '../../hooks/useOptimizedData';
import DashboardGrid from '../dashboard/DashboardGrid';
import { LazyReportsPanel, LazyRioClaroStationsMap, LazyFullscreenChartModal } from './LazyComponents';
import { TEXTOS_INTERFACE } from '../../config/constants';
import { getMetricIcon } from '../../utils/metricUtils';

const MainContent: React.FC = () => {
  const { state, dispatch, getMetrics } = useDashboard();
  const { showReportsPanel, selectedMetric, timeRange, isFullscreen } = state;

  // Hooks optimizados para datos
  const { fullData, isLoading } = useOptimizedData();
  const chartData = useOptimizedChartData(fullData, timeRange, isLoading);
  const latestData = useOptimizedLatestData(fullData, isLoading);
  const metrics = useOptimizedMetrics(latestData);
  const sparklineData = useOptimizedSparklineData(fullData, selectedMetric, isLoading);
  const temperatureData = useOptimizedTemperatureData(fullData, isLoading);

  const metricConfig = {
    [selectedMetric]: {
      unit: TEXTOS_INTERFACE.metricas[selectedMetric].unidad,
      icon: getMetricIcon(selectedMetric),
      tooltip: TEXTOS_INTERFACE.metricas[selectedMetric].descripcion,
    }
  };

  return (
    <>
      {/* Panel de Reportes */}
      {showReportsPanel && (
        <>
          {/* Panel móvil */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => dispatch({ type: 'TOGGLE_REPORTS' })}
          >
            <div 
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_REPORTS' })}
                  className="float-right text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              <LazyReportsPanel />
            </div>
          </div>
          
          {/* Panel desktop */}
          <div className="hidden lg:block fixed right-4 top-4 bottom-4 w-80 z-30">
            <div className="h-full bg-white dark:bg-slate-900 shadow-2xl rounded-lg overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_REPORTS' })}
                  className="float-right text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              <LazyReportsPanel />
            </div>
          </div>
        </>
      )}

      <DashboardGrid
        isLoading={isLoading}
        chartData={chartData}
        metrics={metrics}
        sparklineData={sparklineData}
        temperatureData={temperatureData}
        selectedMetric={selectedMetric}
        metricConfig={metricConfig[selectedMetric]}
      />

      {/* Mapa Climático */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <LazyRioClaroStationsMap />
      </motion.div>

      {/* Modal de Pantalla Completa */}
      <LazyFullscreenChartModal
        isOpen={isFullscreen}
        data={chartData}
        metric={selectedMetric}
        unit={metricConfig[selectedMetric].unit}
      />
    </>
  );
};

export default MainContent;