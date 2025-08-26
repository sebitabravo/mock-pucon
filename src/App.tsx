import React from 'react';
import { DashboardProvider } from './contexts/DashboardContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ui/ErrorBoundary';

/**
 * === ULTRA-MINIMAL APP.TSX ===
 * 
 * Arquitectura empresarial:
 * - Patrón Provider para estado global
 * - Componentes separados por responsabilidad
 * - Configuración centralizada
 * - TypeScript completo
 * - Rendimiento optimizado
 */

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <Layout />
      </DashboardProvider>
    </ErrorBoundary>
  );
};

export default App;