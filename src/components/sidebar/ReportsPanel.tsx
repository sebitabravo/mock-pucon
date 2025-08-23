import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Table, 
  BarChart3, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Brain,
  Sparkles
} from 'lucide-react';
import { ReportConfig, ReportFormat, ReportVariable } from '../../types/reports';
import { useReports, defaultReportVariables } from '../../hooks/useReports';

interface ReportsPanelProps {
  className?: string;
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({ className = "" }) => {
  const { 
    reportJobs, 
    isGenerating, 
    generateReport, 
    downloadReport, 
    deleteReport,
    clearCompletedReports 
  } = useReports();

  const [variables, setVariables] = useState<ReportVariable[]>(defaultReportVariables);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    endDate: new Date()
  });
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(true);

  // Formatos disponibles
  const formats: { value: ReportFormat; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      value: 'pdf', 
      label: 'PDF', 
      icon: <FileText className="w-4 h-4" />, 
      description: 'Documento profesional con gráficos' 
    },
    { 
      value: 'excel', 
      label: 'Excel', 
      icon: <Table className="w-4 h-4" />, 
      description: 'Hoja de cálculo para análisis' 
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: <BarChart3 className="w-4 h-4" />, 
      description: 'Datos tabulares simples' 
    }
  ];

  // Toggle variable selection
  const toggleVariable = useCallback((variableId: string) => {
    setVariables(prev => prev.map(v => 
      v.id === variableId ? { ...v, selected: !v.selected } : v
    ));
  }, []);

  // Generar reporte
  const handleGenerateReport = useCallback(async () => {
    const selectedVariables = variables.filter(v => v.selected);
    if (selectedVariables.length === 0) {
      alert('Selecciona al menos una variable para el reporte');
      return;
    }

    const config: ReportConfig = {
      variables,
      format: selectedFormat,
      dateRange,
      includeCharts,
      includeAnalysis,
      aiAnalysis
    };

    try {
      await generateReport(config);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte. Inténtalo de nuevo.');
    }
  }, [variables, selectedFormat, dateRange, includeCharts, includeAnalysis, aiAnalysis, generateReport]);

  // Obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'generating':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const selectedCount = variables.filter(v => v.selected).length;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Download className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Sistema de Reportes
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Genera reportes profesionales con análisis IA
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Selección de Variables */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 text-sm">
            Variables a Incluir ({selectedCount}/5)
          </h4>
          <div className="space-y-2">
            {variables.map(variable => (
              <label
                key={variable.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={variable.selected}
                  onChange={() => toggleVariable(variable.id)}
                  className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-lg">{variable.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {variable.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    {variable.unit}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-gray-200 dark:border-slate-700"></div>

        {/* Formato de Reporte */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 text-sm">
            Formato de Salida
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {formats.map(format => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  selectedFormat === format.value
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-700 dark:text-slate-300'
                }`}
                title={format.description}
              >
                <div className="flex justify-center mb-1">
                  {format.icon}
                </div>
                <div className="text-xs font-medium">
                  {format.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rango de Fechas */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 text-sm">
            Período de Datos
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  startDate: new Date(e.target.value) 
                }))}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  endDate: new Date(e.target.value) 
                }))}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Opciones Avanzadas */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 text-sm">
            Opciones Avanzadas
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Incluir gráficos
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAnalysis}
                onChange={(e) => setIncludeAnalysis(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Incluir análisis estadístico
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={aiAnalysis}
                onChange={(e) => setAiAnalysis(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
              />
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-purple-500" />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  Análisis IA avanzado
                </span>
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </div>
            </label>
          </div>
        </div>

        {/* Botón Generar */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating || selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>Generar Reporte IA</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Lista de Reportes */}
        {reportJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                Reportes Recientes
              </h4>
              <button
                onClick={clearCompletedReports}
                className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              >
                Limpiar completados
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {reportJobs.slice(0, 5).map(job => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    {getStatusIcon(job.status)}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">
                        {job.config.format.toUpperCase()} • {job.config.variables.filter(v => v.selected).length} variables
                      </div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">
                        {job.createdAt.toLocaleTimeString('es-CL')}
                      </div>
                      {job.status === 'generating' && (
                        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1 mt-1">
                          <div 
                            className="bg-cyan-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {job.status === 'completed' && (
                        <button
                          onClick={() => downloadReport(job.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded text-cyan-600 dark:text-cyan-400"
                          title="Descargar"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReport(job.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPanel;
