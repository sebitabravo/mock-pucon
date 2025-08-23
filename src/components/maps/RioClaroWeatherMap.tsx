import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Waves, Droplets, Wind, Thermometer, BarChart2, Activity, MapPin, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Tipos para las estaciones de sensorificación
interface StationData {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  status: 'operational' | 'warning' | 'error' | 'offline';
  lastUpdate: Date;
  sensors: {
    flujo: { value: number; unit: string; status: 'ok' | 'warning' | 'error' };
    nivel: { value: number; unit: string; status: 'ok' | 'warning' | 'error' };
    caudal: { value: number; unit: string; status: 'ok' | 'warning' | 'error' };
    velocidad: { value: number; unit: string; status: 'ok' | 'warning' | 'error' };
    temperatura: { value: number; unit: string; status: 'ok' | 'warning' | 'error' };
  };
  metadata: {
    installationDate: Date;
    model: string;
    firmware: string;
    altitude: number;
  };
}

// Tipos de mapa disponibles
interface MapType {
  id: string;
  name: string;
  description: string;
  url: string;
  attribution: string;
}

// Datos de las estaciones de sensorificación del Río Claro
const generateStationData = (): StationData[] => {
  const now = new Date();

  // Simular diferentes estados de estaciones para demostrar los colores
  const statuses: StationData['status'][] = ['operational', 'operational', 'warning', 'operational'];
  const randomStatus = () => {
    const rand = Math.random();
    if (rand < 0.7) return 'operational';
    if (rand < 0.9) return 'warning';
    if (rand < 0.98) return 'error';
    return 'offline';
  };

  return [
    {
      id: 'station1',
      name: 'Estación 1',
      location: 'Río Pucón Norte',
      coordinates: [-39.2706, -71.9520],
      status: randomStatus(),
      lastUpdate: new Date(now.getTime() - Math.random() * 300000), // Últimos 5 minutos
      sensors: {
        flujo: {
          value: 100 + Math.sin(now.getTime() / 100000) * 15 + Math.random() * 10 - 5,
          unit: 'm³/s',
          status: 'ok'
        },
        nivel: {
          value: (100 + Math.sin(now.getTime() / 100000) * 15 + Math.random() * 10 - 5) / 50,
          unit: 'm',
          status: 'ok'
        },
        caudal: {
          value: (100 + Math.sin(now.getTime() / 100000) * 15 + Math.random() * 10 - 5) * 15,
          unit: 'L/s',
          status: 'ok'
        },
        velocidad: {
          value: (100 + Math.sin(now.getTime() / 100000) * 15 + Math.random() * 10 - 5) / 60,
          unit: 'm/s',
          status: 'ok'
        },
        temperatura: {
          value: 12.5 + Math.sin(now.getTime() / 1000000) * 2 + Math.random() * 0.5 - 0.25,
          unit: '°C',
          status: 'ok'
        }
      },
      metadata: {
        installationDate: new Date('2022-03-15'),
        model: 'HydroSense Pro 3000',
        firmware: 'v2.1.4',
        altitude: 230
      }
    },
    {
      id: 'station2',
      name: 'Estación 2',
      location: 'Río Pucón Sur',
      coordinates: [-39.2856, -71.9420],
      status: randomStatus(),
      lastUpdate: new Date(now.getTime() - Math.random() * 300000), // Últimos 5 minutos
      sensors: {
        flujo: {
          value: 105 + Math.cos(now.getTime() / 80000) * 15 + Math.random() * 10 - 5,
          unit: 'm³/s',
          status: 'ok'
        },
        nivel: {
          value: (105 + Math.cos(now.getTime() / 80000) * 15 + Math.random() * 10 - 5) / 48,
          unit: 'm',
          status: 'ok'
        },
        caudal: {
          value: (105 + Math.cos(now.getTime() / 80000) * 15 + Math.random() * 10 - 5) * 14,
          unit: 'L/s',
          status: 'ok'
        },
        velocidad: {
          value: (105 + Math.cos(now.getTime() / 80000) * 15 + Math.random() * 10 - 5) / 58,
          unit: 'm/s',
          status: 'ok'
        },
        temperatura: {
          value: 12.8 + Math.cos(now.getTime() / 900000) * 2 + Math.random() * 0.5 - 0.25,
          unit: '°C',
          status: 'ok'
        }
      },
      metadata: {
        installationDate: new Date('2022-05-20'),
        model: 'HydroSense Pro 3000',
        firmware: 'v2.1.3',
        altitude: 210
      }
    }
  ];
};

// Tipos de mapa disponibles
const mapTypes: MapType[] = [
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

// Componente para controlar el mapa
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

// Función para obtener el color según el estado de la estación
const getStationStatusColor = (status: StationData['status']) => {
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

// Función para obtener el icono según el estado
const getStationStatusIcon = (status: StationData['status']) => {
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

// Función para obtener el texto del estado
const getStationStatusText = (status: StationData['status']) => {
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

// Componente principal del mapa de estaciones
const RioClaroStationsMap: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [mapCenter] = useState<[number, number]>([-39.2706, -71.9420]);
  const [mapZoom] = useState(12);
  const [selectedMapType, setSelectedMapType] = useState<string>('street');
  const [stationData, setStationData] = useState<StationData[]>([]);

  // Actualizar datos de estaciones cada 3 segundos
  useEffect(() => {
    const updateStations = () => {
      setStationData(generateStationData());
    };

    updateStations(); // Carga inicial
    const interval = setInterval(updateStations, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  // Crear iconos personalizados para cada estación
  const createStationMarker = (station: StationData) => {
    const color = getStationStatusColor(station.status);
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
          <text x="16" y="20" text-anchor="middle" fill="${color}" font-size="12" font-weight="bold">
            ${station.id.slice(-1)}
          </text>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  const currentMapType = mapTypes.find(type => type.id === selectedMapType) || mapTypes[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Mapa de Estaciones - Río Claro
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Monitoreo de sensores hidrológicos en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Actualizado cada 3s</span>
          </div>
        </div>

        {/* Selector de tipo de mapa */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Tipo de mapa:
            </span>
          </div>
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            {mapTypes.map(mapType => (
              <button
                key={mapType.id}
                onClick={() => setSelectedMapType(mapType.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  selectedMapType === mapType.id
                    ? 'bg-white dark:bg-slate-600 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                }`}
                title={mapType.description}
              >
                {mapType.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-96 lg:h-[600px]">
        {/* Mapa */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url={currentMapType.url}
              attribution={currentMapType.attribution}
            />

            {stationData.map((station) => (
              <Marker
                key={station.id}
                position={station.coordinates}
                icon={createStationMarker(station)}
                eventHandlers={{
                  click: () => setSelectedStation(station)
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[280px]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{getStationStatusIcon(station.status)}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{station.name}</h3>
                        <p className="text-sm text-gray-600">{station.location}</p>
                        <p className="text-xs text-gray-500">
                          {getStationStatusText(station.status)} • {station.lastUpdate.toLocaleTimeString('es-CL')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Waves className="w-3 h-3 text-blue-500" />
                        <div>
                          <span className="font-medium">Flujo:</span>
                          <div className="text-gray-700">{station.sensors.flujo.value.toFixed(2)} {station.sensors.flujo.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-3 h-3 text-green-500" />
                        <div>
                          <span className="font-medium">Nivel:</span>
                          <div className="text-gray-700">{station.sensors.nivel.value.toFixed(2)} {station.sensors.nivel.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3 h-3 text-cyan-500" />
                        <div>
                          <span className="font-medium">Caudal:</span>
                          <div className="text-gray-700">{station.sensors.caudal.value.toFixed(1)} {station.sensors.caudal.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-3 h-3 text-purple-500" />
                        <div>
                          <span className="font-medium">Velocidad:</span>
                          <div className="text-gray-700">{station.sensors.velocidad.value.toFixed(2)} {station.sensors.velocidad.unit}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs">
                        <Thermometer className="w-3 h-3 text-orange-500" />
                        <span className="font-medium">Temperatura:</span>
                        <span className="text-gray-700">{station.sensors.temperatura.value.toFixed(1)} {station.sensors.temperatura.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">Altitud: {station.metadata.altitude}m</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Leyenda fija en el mapa - Mejorada */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-cyan-500" />
              <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                Estaciones de Monitoreo
              </h4>
            </div>

            {/* Estados de estaciones */}
            <div className="space-y-2 mb-4">
              <h5 className="text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wide">
                Estados
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { status: 'operational', color: '#10b981', label: 'Operacional', icon: '✅' },
                  { status: 'warning', color: '#f59e0b', label: 'Advertencia', icon: '⚠️' },
                  { status: 'error', color: '#ef4444', label: 'Error', icon: '❌' },
                  { status: 'offline', color: '#6b7280', label: 'Fuera de línea', icon: '⚫' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-slate-800"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensores monitoreados */}
            <div className="border-t border-gray-200 dark:border-slate-600 pt-3">
              <h5 className="text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Sensores
              </h5>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Waves className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600 dark:text-slate-400">Flujo</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart2 className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600 dark:text-slate-400">Nivel</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-500" />
                  <span className="text-gray-600 dark:text-slate-400">Caudal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-purple-500" />
                  <span className="text-gray-600 dark:text-slate-400">Velocidad</span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="border-t border-gray-200 dark:border-slate-600 pt-3 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-slate-400">Actualización:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">Cada 3s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral con detalles */}
        <div className="w-full lg:w-80 bg-gray-50 dark:bg-slate-900 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
            Estaciones de Monitoreo
          </h3>

          <div className="space-y-3">
            {stationData.map((station) => (
              <div
                key={station.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedStation?.id === station.id
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm'
                }`}
                onClick={() => setSelectedStation(station)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                      {station.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {station.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStationStatusIcon(station.status)}</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStationStatusColor(station.status) }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Waves className="w-3 h-3 text-blue-500" />
                      <span className="font-medium">Flujo</span>
                    </div>
                    <div className="font-bold text-gray-800 dark:text-white">
                      {station.sensors.flujo.value.toFixed(1)} {station.sensors.flujo.unit}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <BarChart2 className="w-3 h-3 text-green-500" />
                      <span className="font-medium">Nivel</span>
                    </div>
                    <div className="font-bold text-gray-800 dark:text-white">
                      {station.sensors.nivel.value.toFixed(2)} {station.sensors.nivel.unit}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Actualizado: {station.lastUpdate.toLocaleTimeString('es-CL')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3 text-sm">
              Estado de Estaciones
            </h4>
            <div className="space-y-2">
              {[
                { status: 'operational', color: '#10b981', label: 'Operacional', icon: '✅' },
                { status: 'warning', color: '#f59e0b', label: 'Advertencia', icon: '⚠️' },
                { status: 'error', color: '#ef4444', label: 'Error', icon: '❌' },
                { status: 'offline', color: '#6b7280', label: 'Fuera de línea', icon: '⚫' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="mr-1">{item.icon}</span>
                  <span className="text-gray-600 dark:text-slate-400">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">
                Sensores Monitoreados
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Waves className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600 dark:text-slate-400">Flujo (m³/s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart2 className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600 dark:text-slate-400">Nivel (m)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-500" />
                  <span className="text-gray-600 dark:text-slate-400">Caudal (L/s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-purple-500" />
                  <span className="text-gray-600 dark:text-slate-400">Velocidad (m/s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RioClaroStationsMap;
