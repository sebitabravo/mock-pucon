// Utilidades para el manejo de mapas
import { Icon } from 'leaflet';

// Crear icono personalizado para estaciones
export const createStationIcon = (status: string, stationId: string) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return '#10b981'; // Verde
      case 'warning':
        return '#f59e0b'; // Amarillo
      case 'error':
        return '#ef4444'; // Rojo
      case 'offline':
        return '#6b7280'; // Gris
      default:
        return '#6b7280';
    }
  };

  const color = getStatusColor(status);
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
        <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
        <text x="16" y="20" text-anchor="middle" fill="${color}" font-size="12" font-weight="bold">
          ${stationId.slice(-1)}
        </text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Obtener color según estado
export const getStationStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
      return '#10b981';
    case 'warning':
      return '#f59e0b';
    case 'error':
      return '#ef4444';
    case 'offline':
      return '#6b7280';
    default:
      return '#6b7280';
  }
};

// Obtener icono según estado
export const getStationStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'offline':
      return '⚫';
    default:
      return '❓';
  }
};

// Obtener texto del estado
export const getStationStatusText = (status: string) => {
  switch (status) {
    case 'operational':
      return 'Operacional';
    case 'warning':
      return 'Advertencia';
    case 'error':
      return 'Error';
    case 'offline':
      return 'Fuera de línea';
    default:
      return 'Desconocido';
  }
};

// Tipos de mapa disponibles
export const mapTypes = [
  {
    id: 'street',
    name: 'Calles',
    description: 'Mapa de calles estándar con detalles urbanos',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  {
    id: 'satellite',
    name: 'Satelital',
    description: 'Vista satelital de alta resolución',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  },
  {
    id: 'topographic',
    name: 'Topográfico',
    description: 'Mapa topográfico con curvas de nivel y relieve',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
  },
  {
    id: 'terrain',
    name: 'Terreno',
    description: 'Vista de terreno con sombreado de relieve',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  }
];
