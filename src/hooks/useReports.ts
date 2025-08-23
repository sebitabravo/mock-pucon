import { useState, useCallback } from 'react';
import { ReportConfig, ReportJob, ReportVariable, AIAnalysisResult } from '../types/reports';
import { generatePDFReport, generateExcelReport, generateCSVReport } from '../utils/reportGenerator';

// Variables disponibles para reportes
export const defaultReportVariables: ReportVariable[] = [
  { id: 'flujo', name: 'Flujo', unit: 'm³/s', selected: true, icon: '🌊' },
  { id: 'nivel', name: 'Nivel', unit: 'm', selected: true, icon: '📊' },
  { id: 'caudal', name: 'Caudal', unit: 'L/s', selected: false, icon: '💧' },
  { id: 'velocidad', name: 'Velocidad', unit: 'm/s', selected: false, icon: '💨' },
  { id: 'temperatura', name: 'Temperatura', unit: '°C', selected: false, icon: '🌡️' }
];

export const useReports = () => {
  const [reportJobs, setReportJobs] = useState<ReportJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generar análisis IA simulado
  const generateAIAnalysis = useCallback((config: ReportConfig): AIAnalysisResult => {
    const selectedVariables = config.variables.filter(v => v.selected);
    
    const trends = selectedVariables.map(variable => ({
      variable: variable.name,
      trend: Math.random() > 0.5 ? 'increasing' : Math.random() > 0.5 ? 'decreasing' : 'stable' as const,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      description: `Análisis de tendencia para ${variable.name} basado en datos históricos y patrones estacionales.`
    }));

    const alerts = selectedVariables
      .filter(() => Math.random() > 0.7) // 30% chance de alerta por variable
      .map(variable => ({
        type: Math.random() > 0.5 ? 'warning' : 'critical' as const,
        message: `Se detectaron valores anómalos en ${variable.name} durante el período seleccionado.`,
        variable: variable.name
      }));

    return {
      summary: `Análisis inteligente de ${selectedVariables.length} variables durante el período ${config.dateRange.startDate.toLocaleDateString()} - ${config.dateRange.endDate.toLocaleDateString()}. Se procesaron datos de 2 estaciones de monitoreo con algoritmos de machine learning para detectar patrones y anomalías.`,
      trends,
      recommendations: [
        'Considerar aumentar la frecuencia de monitoreo durante períodos de alta variabilidad.',
        'Implementar alertas automáticas para valores que excedan los umbrales establecidos.',
        'Realizar calibración de sensores basada en los patrones detectados.',
        'Evaluar la correlación entre variables para optimizar el sistema de monitoreo.'
      ],
      alerts
    };
  }, []);

  // Generar reporte
  const generateReport = useCallback(async (config: ReportConfig): Promise<string> => {
    const jobId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newJob: ReportJob = {
      id: jobId,
      config,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setReportJobs(prev => [newJob, ...prev]);
    setIsGenerating(true);

    try {
      // Simular proceso de generación
      const updateProgress = (progress: number, status: ReportJob['status'] = 'generating') => {
        setReportJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, progress, status } : job
        ));
      };

      // Fase 1: Recopilando datos
      updateProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fase 2: Procesando análisis
      updateProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Fase 3: Generando análisis IA (si está habilitado)
      if (config.aiAnalysis) {
        updateProgress(60);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Fase 4: Generando archivo
      updateProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generar el archivo según el formato
      let downloadUrl: string;
      const aiAnalysis = config.aiAnalysis ? generateAIAnalysis(config) : undefined;

      switch (config.format) {
        case 'pdf':
          downloadUrl = await generatePDFReport(config, aiAnalysis);
          break;
        case 'excel':
          downloadUrl = await generateExcelReport(config, aiAnalysis);
          break;
        case 'csv':
          downloadUrl = await generateCSVReport(config, aiAnalysis);
          break;
        default:
          throw new Error('Formato no soportado');
      }

      // Completar
      updateProgress(100, 'completed');
      setReportJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed', completedAt: new Date(), downloadUrl }
          : job
      ));

      return jobId;
    } catch (error) {
      setReportJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'error', error: error instanceof Error ? error.message : 'Error desconocido' }
          : job
      ));
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateAIAnalysis]);

  // Descargar reporte
  const downloadReport = useCallback((jobId: string) => {
    const job = reportJobs.find(j => j.id === jobId);
    if (job?.downloadUrl) {
      const link = document.createElement('a');
      link.href = job.downloadUrl;
      link.download = `reporte_${job.config.format}_${job.createdAt.toISOString().split('T')[0]}.${job.config.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [reportJobs]);

  // Eliminar reporte
  const deleteReport = useCallback((jobId: string) => {
    setReportJobs(prev => prev.filter(job => job.id !== jobId));
  }, []);

  // Limpiar reportes completados
  const clearCompletedReports = useCallback(() => {
    setReportJobs(prev => prev.filter(job => job.status !== 'completed'));
  }, []);

  return {
    reportJobs,
    isGenerating,
    generateReport,
    downloadReport,
    deleteReport,
    clearCompletedReports,
    defaultReportVariables
  };
};
