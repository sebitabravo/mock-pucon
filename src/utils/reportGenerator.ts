import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ReportConfig, AIAnalysisResult } from '../types/reports';

// Extender el tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Generar datos mock para el reporte
const generateMockData = (config: ReportConfig) => {
  const data = [];
  const startDate = new Date(config.dateRange.startDate);
  const endDate = new Date(config.dateRange.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const row: any = {
      fecha: date.toLocaleDateString('es-CL'),
      hora: date.toLocaleTimeString('es-CL')
    };

    config.variables.filter(v => v.selected).forEach(variable => {
      // Generar datos simulados realistas
      let baseValue = 100;
      let variation = 20;
      
      switch (variable.id) {
        case 'flujo':
          baseValue = 100 + Math.sin(i / 10) * 15;
          break;
        case 'nivel':
          baseValue = 2.5 + Math.cos(i / 8) * 0.5;
          break;
        case 'caudal':
          baseValue = 1500 + Math.sin(i / 12) * 200;
          break;
        case 'velocidad':
          baseValue = 1.8 + Math.cos(i / 6) * 0.3;
          break;
        case 'temperatura':
          baseValue = 12.5 + Math.sin(i / 15) * 3;
          break;
      }
      
      row[`${variable.name}_Estacion1`] = (baseValue + Math.random() * variation - variation/2).toFixed(2);
      row[`${variable.name}_Estacion2`] = (baseValue * 1.05 + Math.random() * variation - variation/2).toFixed(2);
    });

    data.push(row);
  }
  
  return data;
};

// Generar reporte PDF
export const generatePDFReport = async (config: ReportConfig, aiAnalysis?: AIAnalysisResult): Promise<string> => {
  const pdf = new jsPDF();
  const data = generateMockData(config);
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(6, 182, 212); // Cyan color
  pdf.text('Reporte de Monitoreo Hídrico', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Río Claro - Pucón`, 20, 40);
  pdf.text(`Período: ${config.dateRange.startDate.toLocaleDateString('es-CL')} - ${config.dateRange.endDate.toLocaleDateString('es-CL')}`, 20, 50);
  pdf.text(`Generado: ${new Date().toLocaleString('es-CL')}`, 20, 60);

  let yPosition = 80;

  // Variables incluidas
  pdf.setFontSize(14);
  pdf.setTextColor(6, 182, 212);
  pdf.text('Variables Monitoreadas:', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  config.variables.filter(v => v.selected).forEach(variable => {
    pdf.text(`• ${variable.name} (${variable.unit})`, 25, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Análisis IA si está disponible
  if (aiAnalysis) {
    pdf.setFontSize(14);
    pdf.setTextColor(6, 182, 212);
    pdf.text('Análisis Inteligente:', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    // Resumen
    const summaryLines = pdf.splitTextToSize(aiAnalysis.summary, 170);
    pdf.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 5 + 10;

    // Tendencias
    if (aiAnalysis.trends.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(6, 182, 212);
      pdf.text('Tendencias Detectadas:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      aiAnalysis.trends.forEach(trend => {
        const trendIcon = trend.trend === 'increasing' ? '↗️' : trend.trend === 'decreasing' ? '↘️' : '→';
        pdf.text(`${trendIcon} ${trend.variable}: ${trend.trend} (${(trend.confidence * 100).toFixed(0)}% confianza)`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }

    // Alertas
    if (aiAnalysis.alerts.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(239, 68, 68); // Red color
      pdf.text('Alertas:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      aiAnalysis.alerts.forEach(alert => {
        const alertIcon = alert.type === 'critical' ? '🚨' : '⚠️';
        pdf.text(`${alertIcon} ${alert.message}`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }

    // Nueva página si es necesario
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }
  }

  // Tabla de datos
  if (data.length > 0) {
    const columns = Object.keys(data[0]);
    const rows = data.map(row => columns.map(col => row[col]));
    
    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [6, 182, 212] },
      margin: { top: 20 }
    });
  }

  // Generar blob y URL
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  
  return url;
};

// Generar reporte Excel
export const generateExcelReport = async (config: ReportConfig, aiAnalysis?: AIAnalysisResult): Promise<string> => {
  const data = generateMockData(config);
  const workbook = XLSX.utils.book_new();
  
  // Hoja de datos
  const dataSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, dataSheet, 'Datos');
  
  // Hoja de análisis IA si está disponible
  if (aiAnalysis) {
    const analysisData = [
      ['ANÁLISIS INTELIGENTE'],
      [''],
      ['Resumen:', aiAnalysis.summary],
      [''],
      ['TENDENCIAS:'],
      ...aiAnalysis.trends.map(trend => [
        trend.variable,
        trend.trend,
        `${(trend.confidence * 100).toFixed(0)}%`,
        trend.description
      ]),
      [''],
      ['ALERTAS:'],
      ...aiAnalysis.alerts.map(alert => [
        alert.type,
        alert.variable,
        alert.message
      ]),
      [''],
      ['RECOMENDACIONES:'],
      ...aiAnalysis.recommendations.map(rec => ['', rec])
    ];
    
    const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData);
    XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Análisis IA');
  }
  
  // Generar archivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  return url;
};

// Generar reporte CSV
export const generateCSVReport = async (config: ReportConfig, aiAnalysis?: AIAnalysisResult): Promise<string> => {
  const data = generateMockData(config);
  
  let csvContent = Papa.unparse(data);
  
  // Agregar análisis IA si está disponible
  if (aiAnalysis) {
    csvContent += '\n\n--- ANÁLISIS INTELIGENTE ---\n';
    csvContent += `Resumen,${aiAnalysis.summary}\n\n`;
    
    csvContent += 'TENDENCIAS\n';
    csvContent += 'Variable,Tendencia,Confianza,Descripción\n';
    aiAnalysis.trends.forEach(trend => {
      csvContent += `${trend.variable},${trend.trend},${(trend.confidence * 100).toFixed(0)}%,${trend.description}\n`;
    });
    
    csvContent += '\nALERTAS\n';
    csvContent += 'Tipo,Variable,Mensaje\n';
    aiAnalysis.alerts.forEach(alert => {
      csvContent += `${alert.type},${alert.variable},${alert.message}\n`;
    });
    
    csvContent += '\nRECOMENDACIONES\n';
    aiAnalysis.recommendations.forEach(rec => {
      csvContent += `${rec}\n`;
    });
  }
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  return url;
};
