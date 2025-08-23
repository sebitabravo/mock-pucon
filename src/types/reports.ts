// Tipos para el sistema de reportes
export interface ReportVariable {
  id: string;
  name: string;
  unit: string;
  selected: boolean;
  icon: string;
}

export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ReportConfig {
  variables: ReportVariable[];
  format: ReportFormat;
  dateRange: DateRange;
  includeCharts: boolean;
  includeAnalysis: boolean;
  aiAnalysis: boolean;
}

export interface ReportJob {
  id: string;
  config: ReportConfig;
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  error?: string;
}

export interface AIAnalysisResult {
  summary: string;
  trends: {
    variable: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    description: string;
  }[];
  recommendations: string[];
  alerts: {
    type: 'warning' | 'critical' | 'info';
    message: string;
    variable: string;
  }[];
}
