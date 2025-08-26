import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MetricDataPoint, MetricType, TimeRange, DateRange, Metrics } from '../types';
import { VISUAL_CONFIG } from '../config/constants';

// Estado del dashboard
interface DashboardState {
  selectedMetric: MetricType;
  timeRange: TimeRange;
  globalDateRange: DateRange;
  isAsideCollapsed: boolean;
  isFullscreen: boolean;
  showReportsPanel: boolean;
  data: MetricDataPoint[];
  isLoading: boolean;
}

// Acciones del dashboard
type DashboardAction =
  | { type: 'SET_METRIC'; payload: MetricType }
  | { type: 'SET_TIME_RANGE'; payload: TimeRange }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'TOGGLE_ASIDE' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'TOGGLE_REPORTS' }
  | { type: 'SET_DATA'; payload: MetricDataPoint[] }
  | { type: 'SET_LOADING'; payload: boolean };

// Estado inicial
const initialState: DashboardState = {
  selectedMetric: 'flujo',
  timeRange: '30m',
  globalDateRange: {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  },
  isAsideCollapsed: false,
  isFullscreen: false,
  showReportsPanel: false,
  data: [],
  isLoading: true,
};

// Reducer
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_METRIC':
      return { ...state, selectedMetric: action.payload };
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, globalDateRange: action.payload };
    case 'TOGGLE_ASIDE':
      return { ...state, isAsideCollapsed: !state.isAsideCollapsed };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen };
    case 'TOGGLE_REPORTS':
      return { ...state, showReportsPanel: !state.showReportsPanel };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// Contexto
const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  // Métodos derivados
  getMetrics: (data: MetricDataPoint[]) => Metrics;
} | null>(null);

// Provider
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Función para calcular métricas basadas en los datos
  const getMetrics = (data: MetricDataPoint[]): Metrics => {
    if (data.length === 0) {
      return {
        flujo: { station1: 0, station2: 0 },
        nivel: { station1: 0, station2: 0 },
        caudal: { station1: 0, station2: 0 },
        velocidad: { station1: 0, station2: 0 },
      };
    }

    const latest = data[data.length - 1];
    const { multipliers } = VISUAL_CONFIG;

    return {
      flujo: {
        station1: latest.station1 * multipliers.flujo.station1,
        station2: latest.station2 * multipliers.flujo.station2,
      },
      nivel: {
        station1: latest.station1 * multipliers.nivel.station1,
        station2: latest.station2 * multipliers.nivel.station2,
      },
      caudal: {
        station1: latest.station1 * multipliers.caudal.station1,
        station2: latest.station2 * multipliers.caudal.station2,
      },
      velocidad: {
        station1: latest.station1 * multipliers.velocidad.station1,
        station2: latest.station2 * multipliers.velocidad.station2,
      },
    };
  };

  return (
    <DashboardContext.Provider value={{ state, dispatch, getMetrics }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook personalizado
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};