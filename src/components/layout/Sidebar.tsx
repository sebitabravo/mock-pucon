import React from 'react';
import { Waves, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { TEXTOS_INTERFACE } from '../../config/constants';
import { getMetricIcon } from '../../utils/metricUtils';
import CustomTooltip from '../ui/CustomTooltip';
import type { MetricType } from '../../types';

const Sidebar: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const { isAsideCollapsed, selectedMetric, showReportsPanel } = state;

  const metrics: MetricType[] = ['flujo', 'nivel', 'caudal', 'velocidad'];

  const handleMetricChange = (metric: MetricType) => {
    dispatch({ type: 'SET_METRIC', payload: metric });
  };

  return (
    <aside className={`${isAsideCollapsed ? 'w-16' : 'w-20 lg:w-64'} bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-800 ${isAsideCollapsed ? 'p-3' : 'p-4 lg:p-6'} flex flex-col transition-all duration-300 h-screen sticky top-0 z-50`}>
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-help">
            <Waves className="w-8 h-8 text-cyan-500" />
            {!isAsideCollapsed && <h1 className="text-xl font-bold hidden lg:block">Variables</h1>}
          </div>

          {/* Tooltip específico para el logo */}
          <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 w-64 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-[99999] pointer-events-none border border-gray-700 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">Variables - Sistema de Monitoreo</h4>
            </div>
            <p className="text-gray-300 leading-relaxed text-xs">Panel de control para monitorear las variables hidrológicas del Río Claro en Pucón. Selecciona una variable para ver datos detallados en tiempo real.</p>
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ASIDE' })}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
          >
            {isAsideCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Tooltip específico para botón de colapso */}
          <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 w-48 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl py-2 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-[99999] pointer-events-none border border-gray-700 dark:border-slate-600">
            <p className="font-bold text-sm text-white mb-1">{isAsideCollapsed ? "Expandir Panel" : "Colapsar Panel"}</p>
            <p className="text-gray-300 text-xs">{isAsideCollapsed ? "Mostrar etiquetas completas" : "Mostrar solo iconos"}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-3 mb-6">
        {metrics.map(metric => {
          const Icon = getMetricIcon(metric);
          const metricInfo = TEXTOS_INTERFACE.metricas[metric];
          
          return (
            <div key={metric} className="relative group">
              <button 
                onClick={() => handleMetricChange(metric)} 
                className={`flex items-center ${isAsideCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-colors duration-200 w-full ${
                  selectedMetric === metric 
                    ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isAsideCollapsed && <span className="hidden lg:block capitalize">{metricInfo.nombre}</span>}
              </button>

              {/* Tooltip específico para aside */}
              <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 w-64 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-[99999] pointer-events-none border border-gray-700 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white">Monitoreo de {metricInfo.nombre}</h4>
                </div>
                <p className="text-gray-300 leading-relaxed text-xs">{metricInfo.descripcion}</p>
                <div className="mt-2 pt-2 border-t border-gray-700 dark:border-slate-600">
                  <p className="text-gray-400 text-xs">
                    💡 <span className="italic">Haz clic para cambiar la vista principal</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Línea separadora */}
      <div className="border-t border-gray-200 dark:border-slate-700 mb-4"></div>

      {/* Botón de Reportes */}
      <div className="mb-6">
        <div className="relative group">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_REPORTS' })}
            className={`flex items-center ${isAsideCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-colors duration-200 w-full ${
              showReportsPanel 
                ? 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' 
                : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            {!isAsideCollapsed && <span className="hidden lg:block font-medium">Reportes</span>}
          </button>

          {/* Tooltip para reportes */}
          <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 w-64 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-[99999] pointer-events-none border border-gray-700 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-sm text-white">Sistema de Reportes</h4>
            </div>
            <p className="text-gray-300 text-xs mb-2">Genera reportes profesionales con análisis IA avanzado de todas las variables monitoreadas.</p>
            <div className="text-xs text-purple-300">
              • Formatos: PDF, Excel, CSV<br/>
              • Análisis inteligente incluido<br/>
              • Gráficos y estadísticas
            </div>
          </div>
        </div>
      </div>

      {/* Estado del Sistema */}
      {!isAsideCollapsed && (
        <div className="mt-auto hidden lg:block">
          <div className="bg-gray-100 dark:bg-slate-800/50 p-4 rounded-xl text-center mx-2">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{TEXTOS_INTERFACE.dashboard.estadoSistema}</p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">Todos los sensores operativos</p>
          </div>
        </div>
      )}

      {isAsideCollapsed && (
        <div className="mt-auto flex justify-center">
          <CustomTooltip
            title="Estado del Sistema"
            content="Todos los sensores están operativos y funcionando correctamente"
            position="right"
          >
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse cursor-help"></div>
          </CustomTooltip>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;