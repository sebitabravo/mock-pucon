import React from 'react';
import { Minimize2 } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../contexts/DashboardContext';
import { getChartComponent } from '../../utils/chartUtils';
import CustomTooltip from '../ui/CustomTooltip';
import { TIME_RANGES } from '../../config/constants';
import type { FullscreenChartModalProps, TimeRange } from '../../types';

const FullscreenChartModal: React.FC<FullscreenChartModalProps> = ({
  isOpen,
  data,
  metric,
  unit
}) => {
  const { state, dispatch } = useDashboard();
  const { timeRange } = state;

  const onClose = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  const setTimeRange = (range: TimeRange) => {
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
            Análisis Detallado - {metric} ({unit})
          </h2>
          <div className="flex items-center gap-4">
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
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <ResponsiveContainer width="100%" height="100%">
            {getChartComponent(metric, data, unit)}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FullscreenChartModal;