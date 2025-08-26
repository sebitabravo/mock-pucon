import React, { lazy, Suspense } from 'react';
import SkeletonCard from '../ui/SkeletonCard';
import SkeletonChart from '../ui/SkeletonChart';

// Lazy loading de componentes pesados
const RioClaroStationsMap = lazy(() => import('../maps/RioClaroWeatherMap'));
const FullscreenChartModal = lazy(() => import('../modals/FullscreenChartModal'));
const ReportsPanel = lazy(() => import('../sidebar/ReportsPanel'));

// Wrapper con Suspense para el mapa
export const LazyRioClaroStationsMap: React.FC = () => (
  <Suspense fallback={<SkeletonChart />}>
    <RioClaroStationsMap />
  </Suspense>
);

// Wrapper con Suspense para el modal
export const LazyFullscreenChartModal: React.FC<any> = (props) => (
  <Suspense fallback={null}>
    <FullscreenChartModal {...props} />
  </Suspense>
);

// Wrapper con Suspense para el panel de reportes
export const LazyReportsPanel: React.FC<any> = (props) => (
  <Suspense fallback={<SkeletonCard />}>
    <ReportsPanel {...props} />
  </Suspense>
);