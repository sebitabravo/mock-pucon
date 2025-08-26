import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../contexts/DashboardContext';
import { getChartComponent } from '../../utils/chartUtils';
import CustomTooltip from '../ui/CustomTooltip';
import { TIME_RANGES } from '../../config/constants';
import type { TimeFlowChartProps, TimeRange } from '../../types';

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const TimeFlowChart: React.FC<TimeFlowChartProps> = ({
  data,
  metric,
  unit
}) => {
  const { state, dispatch } = useDashboard();
  const { timeRange, isFullscreen } = state;

  const setTimeRange = (range: TimeRange) => {
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
  };

  const toggleFullscreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 col-span-1 md:col-span-2 lg:col-span-4 h-96 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
          Monitoreo de {metric} en Tiempo Real
          <span className="text-sm font-normal text-gray-500 dark:text-slate-400 ml-2">({unit})</span>
        </h3>
        <div className="flex items-center gap-2">
          <CustomTooltip
            title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
            content={isFullscreen ? "Volver a la vista normal del dashboard" : "Expandir el gráfico a pantalla completa para mejor análisis"}
            position="bottom"
          >
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </CustomTooltip>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
            {(Object.keys(TIME_RANGES) as TimeRange[]).map(range => (
              <CustomTooltip
                key={range}
                title={`Rango de Tiempo: ${range}`}
                content={TIME_RANGES[range].label}
                position="bottom"
              >
                <button 
                  onClick={() => setTimeRange(range)} 
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    timeRange === range 
                      ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow' 
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {range}
                </button>
              </CustomTooltip>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {getChartComponent(metric, data, unit)}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TimeFlowChart;