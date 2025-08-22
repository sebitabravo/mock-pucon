import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar, PolarAngleAxis, LineChart, Line, BarChart, Bar } from 'recharts';
import { ChevronDown, Bell, Waves, Wind, Thermometer, Droplets, BarChart2, User, Settings, LogOut, Sun, Moon, Monitor, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { RioClaroStationsMap } from './components/maps';

// --- TIPOS DE DATOS (TYPESCRIPT) ---
type MetricDataPoint = {
  time: Date;
  station1: number;
  station2: number;
};
type MetricType = 'flujo' | 'nivel' | 'caudal' | 'velocidad';
type Theme = 'light' | 'dark' | 'system';
type TimeRange = '1h' | '6h' | '24h' | '30m';


// --- HOOK PERSONALIZADO PARA GESTIONAR EL TEMA ---
const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setThemeState];
};


// --- DATOS DE EJEMPLO (MOCK DATA) ---
const generateFullDayData = (): MetricDataPoint[] => {
  const data = [];
  const now = new Date();
  // Generar datos para las últimas 24 horas (1440 minutos)
  for (let i = 1440; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time,
      station1: 100 + Math.sin(i / 100) * 15 + Math.random() * 10 - 5,
      station2: 105 + Math.cos(i / 80) * 15 + Math.random() * 10 - 5,
    });
  }
  return data;
};

// --- VARIANTES DE ANIMACIÓN ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// --- COMPONENTES DE LA UI ---

// Componente Sparkline para mini-gráficos
const Sparkline = ({ data, color = '#06b6d4', height = 40 }: {
  data: { value: number; time: Date }[];
  color?: string;
  height?: number;
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Modal de Pantalla Completa para Gráfico
const FullscreenChartModal = ({
  isOpen,
  onClose,
  data,
  metric,
  timeRange,
  setTimeRange,
  unit
}: {
  isOpen: boolean;
  onClose: () => void;
  data: MetricDataPoint[];
  metric: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  unit: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
            Análisis Detallado - {metric} ({unit})
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
              {(['30m', '1h', '6h', '24h'] as TimeRange[]).map(range => {
                const rangeDescriptions = {
                  '30m': 'Últimos 30 minutos - Vista detallada para monitoreo inmediato',
                  '1h': 'Última hora - Ideal para detectar cambios recientes',
                  '6h': 'Últimas 6 horas - Análisis de tendencias a corto plazo',
                  '24h': 'Últimas 24 horas - Vista completa del comportamiento diario'
                };

                return (
                  <CustomTooltip
                    key={range}
                    title={`Rango de Tiempo: ${range}`}
                    content={rangeDescriptions[range]}
                    position="bottom"
                  >
                    <button onClick={() => setTimeRange(range)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeRange === range ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'}`}>
                      {range}
                    </button>
                  </CustomTooltip>
                );
              })}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <ResponsiveContainer width="100%" height="100%">
            {getChartComponent(metric, data, unit)}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Tarjeta de Temperatura con gráfico
const TemperatureCard = ({ temperatureData }: { temperatureData: { value: number; time: Date }[] }) => {
  const currentTemp = temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].value : 12.5;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 flex flex-col justify-center items-center text-center group"
    >
      <CustomTooltip
        title="Temperatura del Agua"
        content="Temperatura promedio del agua del río medida por sensores termométricos en ambas estaciones. La temperatura del agua es crucial para el ecosistema acuático y puede indicar cambios estacionales o contaminación térmica."
        icon={Thermometer}
        value={currentTemp}
        unit="°C"
        trend="stable"
      >
        <div className="flex items-center gap-2 mb-2 cursor-help">
          <Thermometer className="w-6 h-6 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform"/>
          <p className="text-gray-500 dark:text-slate-400 font-semibold group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors">Temp. del Agua</p>
        </div>
      </CustomTooltip>

      {/* Mini gráfico de temperatura */}
      {temperatureData.length > 0 && (
        <div className="w-full mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
          <Sparkline
            data={temperatureData}
            color="#f97316"
            height={35}
          />
        </div>
      )}

      <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
        <CountUp
          end={currentTemp}
          duration={1.5}
          decimals={1}
          preserveValue={true}
        /> °C
      </p>
      <p className="text-xs text-gray-400 dark:text-slate-500">Promedio de ambas estaciones</p>
    </motion.div>
  );
};

// Componente Skeleton para estado de carga
const SkeletonCard = () => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 flex flex-col justify-between"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-20"></div>
      <div className="h-5 w-5 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
    </div>
    <div>
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-24 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-12"></div>
    </div>
  </motion.div>
);

const SkeletonChart = () => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 col-span-1 md:col-span-2 lg:col-span-4 h-96 flex flex-col"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-48"></div>
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-8 w-12 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
    <div className="flex-grow bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
  </motion.div>
);

const SkeletonGauge = () => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 h-full flex flex-col"
  >
    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-32 mb-4"></div>
    <div className="flex-grow flex items-center justify-center">
      <div className="h-48 w-48 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
    </div>
  </motion.div>
);

// Tooltip Personalizado para UI
const CustomTooltip = ({
  title,
  content,
  children,
  position = 'top',
  icon,
  value,
  unit,
  trend
}: {
  title: string;
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ElementType;
  value?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}) => {
  const Icon = icon;
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2'
  };

  // Clases especiales para tooltips del aside que no deben solaparse
  const asidePositionClasses = {
    right: 'left-full ml-4 top-1/2 transform -translate-y-1/2'
  };

  const getTrendColor = (trend?: string) => {
    switch(trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  // Usar posicionamiento especial para aside si es necesario
  const finalPositionClasses = position === 'right' && (title.includes('Monitoreo de') || title.includes('Variables'))
    ? asidePositionClasses.right
    : positionClasses[position];

  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${finalPositionClasses} w-72 max-w-xs sm:max-w-sm bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-[99999] pointer-events-none border border-gray-700 dark:border-slate-600`}>
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
          <h4 className="font-bold text-sm text-white">{title}</h4>
          {trend && (
            <span className={`text-xs ${getTrendColor(trend)} font-medium`}>
              {getTrendIcon(trend)} {trend}
            </span>
          )}
        </div>

        {value !== undefined && (
          <div className="mb-2 p-2 bg-gray-800/50 dark:bg-slate-700/50 rounded-lg">
            <span className="text-cyan-400 font-bold text-lg">{value.toFixed(1)}</span>
            {unit && <span className="text-gray-400 ml-1">{unit}</span>}
          </div>
        )}

        <p className="text-gray-300 leading-relaxed">{content}</p>

        <div className="mt-2 pt-2 border-t border-gray-700 dark:border-slate-600">
          <p className="text-gray-400 text-xs">
            💡 <span className="italic">Pasa el cursor para más detalles</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Tooltip Personalizado para Gráficos
const CustomChartTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-gray-200 dark:border-slate-700 rounded-lg p-3 shadow-xl max-w-xs">
        <p className="text-gray-600 dark:text-slate-400 text-xs font-medium mb-2 text-center">
          {new Date(label).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <div className="flex items-center justify-between gap-4">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              >
                {entry.dataKey === 'station1' ? (
                  <Waves className="w-2 h-2 text-white" />
                ) : (
                  <Droplets className="w-2 h-2 text-white" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {entry.dataKey === 'station1' ? 'E1' : 'E2'}
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {entry.value.toFixed(1)} <span className="text-xs font-normal text-gray-500 dark:text-slate-400">{unit || ''}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Tarjeta de Métrica
const MetricCard = ({
  icon: Icon,
  title,
  value,
  unit,
  tooltipContent,
  colorClass = 'text-cyan-500 dark:text-cyan-400',
  trend = 'stable',
  stationName,
  sparklineData,
  sparklineColor
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  unit: string;
  tooltipContent: string;
  colorClass?: string;
  trend?: 'up' | 'down' | 'stable';
  stationName?: string;
  sparklineData?: { value: number; time: Date }[];
  sparklineColor?: string;
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all duration-300 group"
  >
    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-2">
      <CustomTooltip
        title={`${title} - ${stationName || 'Estación'}`}
        content={`${tooltipContent} Valor actual: ${value.toFixed(1)} ${unit}. Esta medición se actualiza cada 3 segundos desde los sensores instalados en el río.`}
        icon={Icon}
        value={value}
        unit={unit}
        trend={trend}
      >
        <span className="cursor-help font-semibold group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors">
          {title}
        </span>
      </CustomTooltip>
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </div>

    {/* Sparkline */}
    {sparklineData && sparklineData.length > 0 && (
      <div className="mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
        <Sparkline
          data={sparklineData}
          color={sparklineColor || (colorClass.includes('emerald') ? '#10b981' : '#0ea5e9')}
          height={30}
        />
      </div>
    )}

    <div>
      <span className={`text-3xl lg:text-4xl font-bold ${colorClass}`}>
        <CountUp
          end={value}
          duration={1.5}
          decimals={1}
          preserveValue={true}
        />
      </span>
      <span className="text-gray-400 dark:text-slate-500 ml-2">{unit}</span>
    </div>
  </motion.div>
);

// Gráfico de Comparación Radial (Gauge)
const ComparisonGauge = ({ data, dataKey, title, tooltipContent }: {
  data: any;
  dataKey: string;
  title: string;
  tooltipContent: string;
}) => {
    const station1Value = data[dataKey]?.station1 || 0;
    const station2Value = data[dataKey]?.station2 || 0;
    const chartData = [
        { name: 'Estación 2', value: station2Value, fill: '#38bdf8' },
        { name: 'Estación 1', value: station1Value, fill: '#34d399' },
    ];
    const max = Math.max(station1Value, station2Value) * 1.3;

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 h-full flex flex-col group"
        >
            <CustomTooltip
                title={`Análisis Comparativo - ${title}`}
                content={`${tooltipContent} Este gráfico radial permite comparar visualmente los valores entre ambas estaciones. La estación con mayor valor se muestra en el arco exterior.`}
                icon={BarChart2}
                position="top"
            >
                <h3 className="text-gray-600 dark:text-slate-400 font-semibold cursor-help group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors">{title}</h3>
            </CustomTooltip>
            <div className="flex-grow flex items-center justify-center -mt-4">
                <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart innerRadius="30%" outerRadius="100%" data={chartData} startAngle={180} endAngle={0} barSize={20}>
                        <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" cornerRadius={10} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.75rem',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{color: '#4b5563'}}/>
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

// Función para determinar el tipo de gráfico según la métrica
const getChartComponent = (metric: string, data: MetricDataPoint[], unit: string) => {
  const chartProps = {
    data,
    margin: { top: 5, right: 20, left: -10, bottom: 0 }
  };

  switch (metric) {
    case 'flujo':
      // Área para flujo (representa volumen continuo)
      return (
        <AreaChart {...chartProps}>
          <defs>
            <linearGradient id="colorStation1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorStation2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} />
          <YAxis stroke="#9ca3af" fontSize={12} label={{ value: 'm³/s', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '12px' } }} />
          <Tooltip content={<CustomChartTooltip unit={unit} />} cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }} />
          <Legend />
          <Area type="monotone" dataKey="station1" name="Estación 1" stroke="#34d399" fillOpacity={1} fill="url(#colorStation1)" />
          <Area type="monotone" dataKey="station2" name="Estación 2" stroke="#38bdf8" fillOpacity={1} fill="url(#colorStation2)" />
        </AreaChart>
      );

    case 'nivel':
      // Barras para nivel (representa altura discreta)
      return (
        <BarChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} />
          <YAxis stroke="#9ca3af" fontSize={12} label={{ value: 'm', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '12px' } }} />
          <Tooltip content={<CustomChartTooltip unit={unit} />} cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }} />
          <Legend />
          <Bar dataKey="station1" name="Estación 1" fill="#34d399" opacity={0.8} />
          <Bar dataKey="station2" name="Estación 2" fill="#38bdf8" opacity={0.8} />
        </BarChart>
      );

    case 'caudal':
      // Líneas para caudal (representa flujo preciso)
      return (
        <LineChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} />
          <YAxis stroke="#9ca3af" fontSize={12} label={{ value: 'L/s', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '12px' } }} />
          <Tooltip content={<CustomChartTooltip unit={unit} />} cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }} />
          <Legend />
          <Line type="monotone" dataKey="station1" name="Estación 1" stroke="#34d399" strokeWidth={3} dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }} />
          <Line type="monotone" dataKey="station2" name="Estación 2" stroke="#38bdf8" strokeWidth={3} dot={{ fill: '#38bdf8', strokeWidth: 2, r: 4 }} />
        </LineChart>
      );

    case 'velocidad':
      // Área suave para velocidad (representa movimiento continuo)
      return (
        <AreaChart {...chartProps}>
          <defs>
            <linearGradient id="colorStation1Velocity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorStation2Velocity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} />
          <YAxis stroke="#9ca3af" fontSize={12} label={{ value: 'm/s', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '12px' } }} />
          <Tooltip content={<CustomChartTooltip unit={unit} />} cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }} />
          <Legend />
          <Area type="basis" dataKey="station1" name="Estación 1" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorStation1Velocity)" />
          <Area type="basis" dataKey="station2" name="Estación 2" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorStation2Velocity)" />
        </AreaChart>
      );

    default:
      return null;
  }
};

// Gráfico Principal de Flujo en el Tiempo
const TimeFlowChart = ({ data, metric, timeRange, setTimeRange, unit, isFullscreen, setIsFullscreen }: {
  data: MetricDataPoint[];
  metric: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  unit: string;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 col-span-1 md:col-span-2 lg:col-span-4 h-96 flex flex-col"
  >
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
          Monitoreo de {metric} en Tiempo Real
          <span className="text-sm font-normal text-gray-500 dark:text-slate-400 ml-2">({unit})</span>
        </h3>
        <div className="flex items-center gap-2">
          <CustomTooltip
            title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
            content={isFullscreen ? "Volver a la vista normal del dashboard" : "Expandir el gráfico a pantalla completa para mejor análisis"}
            position="bottom"
          >
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </CustomTooltip>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
            {(['30m', '1h', '6h', '24h'] as TimeRange[]).map(range => {
                const rangeDescriptions = {
                    '30m': 'Últimos 30 minutos - Vista detallada para monitoreo inmediato',
                    '1h': 'Última hora - Ideal para detectar cambios recientes',
                    '6h': 'Últimas 6 horas - Análisis de tendencias a corto plazo',
                    '24h': 'Últimas 24 horas - Vista completa del comportamiento diario'
                };

                return (
                    <CustomTooltip
                        key={range}
                        title={`Rango de Tiempo: ${range}`}
                        content={rangeDescriptions[range]}
                        position="bottom"
                    >
                        <button onClick={() => setTimeRange(range)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeRange === range ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'}`}>
                            {range}
                        </button>
                    </CustomTooltip>
                );
            })}
          </div>
        </div>
    </div>
    <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {getChartComponent(metric, data, unit)}
        </ResponsiveContainer>
    </div>
  </motion.div>
);

// Menú de Usuario
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700/50 p-2 rounded-full transition-all duration-300">
        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1" alt="Luis Loyola" className="w-8 h-8 rounded-full border-2 border-emerald-400 object-cover" />
        <div className="text-left hidden md:block">
          <p className="font-semibold text-sm text-gray-800 dark:text-white">Luis Loyola</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>En línea</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-slate-700 py-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"><User size={16} /> Perfil</a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"><Settings size={16} /> Ajustes</a>
          <hr className="border-gray-200 dark:border-slate-700 my-1"/>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"><LogOut size={16} /> Cerrar Sesión</a>
        </div>
      )}
    </div>
  );
};

// Selector de Tema
const ThemeSwitcher = ({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) => {
    const themes: { name: Theme, icon: React.ElementType, description: string }[] = [
        { name: 'light', icon: Sun, description: 'Modo claro - Ideal para uso durante el día con buena iluminación' },
        { name: 'dark', icon: Moon, description: 'Modo oscuro - Reduce la fatiga visual en ambientes con poca luz' },
        { name: 'system', icon: Monitor, description: 'Automático - Se adapta a la configuración de tu sistema operativo' },
    ];
    return (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-full">
            {themes.map(t => {
                const Icon = t.icon;
                return (
                    <CustomTooltip
                        key={t.name}
                        title={`Tema ${t.name === 'light' ? 'Claro' : t.name === 'dark' ? 'Oscuro' : 'Automático'}`}
                        content={t.description}
                        icon={Icon}
                        position="bottom"
                    >
                        <button onClick={() => setTheme(t.name)} className={`p-2 rounded-full transition-colors ${theme === t.name ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700/50'}`}>
                            <Icon size={16} />
                        </button>
                    </CustomTooltip>
                )
            })}
        </div>
    )
}

// --- COMPONENTE PRINCIPAL DE LA APP ---
export default function App() {
  const [fullData, setFullData] = useState<MetricDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('flujo');
  const [timeRange, setTimeRange] = useState<TimeRange>('30m');
  const [theme, setTheme] = useTheme();
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simular carga inicial de datos
  useEffect(() => {
    const loadData = async () => {
      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFullData(generateFullDayData());
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Simula la actualización de datos en tiempo real cada 3 segundos.
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setFullData(prevData => {
        const now = new Date();
        const newDataPoint = {
          time: now,
          station1: 100 + Math.sin(now.getTime() / 100000) * 15 + Math.random() * 10 - 5,
          station2: 105 + Math.cos(now.getTime() / 80000) * 15 + Math.random() * 10 - 5,
        };
        return [...prevData.slice(1), newDataPoint];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Filtra los datos según el rango de tiempo seleccionado
  const chartData = useMemo(() => {
    if (isLoading || fullData.length === 0) return [];
    const now = new Date();
    const minutesAgo = { '30m': 30, '1h': 60, '6h': 360, '24h': 1440 }[timeRange];
    const filterDate = new Date(now.getTime() - minutesAgo * 60000);
    return fullData.filter(d => d.time > filterDate);
  }, [fullData, timeRange, isLoading]);

  const latestData = useMemo(() => {
    if (isLoading || fullData.length === 0) return { station1: 0, station2: 0 };
    return fullData[fullData.length - 1];
  }, [fullData, isLoading]);

  // Métricas calculadas para mostrar en las tarjetas.
  const metrics = useMemo(() => ({
    flujo: { station1: latestData.station1 * 1.2, station2: latestData.station2 * 1.1 },
    nivel: { station1: latestData.station1 / 50, station2: latestData.station2 / 48 },
    caudal: { station1: latestData.station1 * 15, station2: latestData.station2 * 14 },
    velocidad: { station1: latestData.station1 / 60, station2: latestData.station2 / 58 },
  }), [latestData]);

  // Datos para sparklines (últimos 20 puntos)
  const sparklineData = useMemo(() => {
    if (isLoading || fullData.length === 0) return { station1: [], station2: [] };

    const recentData = fullData.slice(-20);
    const multipliers = {
      flujo: { station1: 1.2, station2: 1.1 },
      nivel: { station1: 1/50, station2: 1/48 },
      caudal: { station1: 15, station2: 14 },
      velocidad: { station1: 1/60, station2: 1/58 },
    };

    return {
      station1: recentData.map(d => ({
        value: d.station1 * multipliers[selectedMetric].station1,
        time: d.time
      })),
      station2: recentData.map(d => ({
        value: d.station2 * multipliers[selectedMetric].station2,
        time: d.time
      }))
    };
  }, [fullData, selectedMetric, isLoading]);

  // Datos de temperatura (simulados basados en promedio de estaciones)
  const temperatureData = useMemo(() => {
    if (isLoading || fullData.length === 0) return [];

    const recentData = fullData.slice(-20);
    return recentData.map(d => ({
      value: 12.5 + Math.sin(d.time.getTime() / 1000000) * 2 + Math.random() * 0.5 - 0.25,
      time: d.time
    }));
  }, [fullData, isLoading]);

  const handleMetricChange = useCallback((metric: MetricType) => { setSelectedMetric(metric); }, []);

  const metricConfig = {
    flujo: { unit: 'm³/s', icon: Waves, tooltip: "El flujo representa el volumen de agua que pasa por una sección del río en un segundo. Un flujo alto puede indicar crecidas." },
    nivel: { unit: 'm', icon: BarChart2, tooltip: "El nivel mide la altura del agua del río sobre un punto de referencia. Niveles altos son señal de alerta por posibles desbordes." },
    caudal: { unit: 'L/s', icon: Droplets, tooltip: "El caudal es la cantidad de agua que fluye. Es crucial para la gestión de recursos hídricos y la prevención de inundaciones." },
    velocidad: { unit: 'm/s', icon: Wind, tooltip: "La velocidad del agua. Una velocidad alta, combinada con un nivel alto, aumenta el poder erosivo y el riesgo del río." },
  };

  return (
    <div className="relative bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white min-h-screen font-sans transition-colors duration-300">
      {/* Fondo con gradiente y patrón */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente radial */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-50/30 via-transparent to-transparent dark:from-cyan-950/20 dark:via-transparent dark:to-transparent"></div>

        {/* Patrón de puntos para modo oscuro */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }}>
        </div>

        {/* Patrón geométrico para modo claro */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-0"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>
      <div className="relative flex z-10">
        {/* --- ASIDE / BARRA LATERAL --- */}
        <aside className={`${isAsideCollapsed ? 'w-16' : 'w-20 lg:w-64'} bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-800 ${isAsideCollapsed ? 'p-3' : 'p-4 lg:p-6'} flex flex-col transition-all duration-300 h-screen sticky top-0`}>
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
                onClick={() => setIsAsideCollapsed(!isAsideCollapsed)}
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
            {(Object.keys(metricConfig) as MetricType[]).map(metric => {
              const { icon: Icon, tooltip } = metricConfig[metric];
              return (
                <div key={metric} className="relative group">
                  <button onClick={() => handleMetricChange(metric)} className={`flex items-center ${isAsideCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-colors duration-200 w-full ${selectedMetric === metric ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                    {!isAsideCollapsed && <span className="hidden lg:block capitalize">{metric}</span>}
                  </button>

                  {/* Tooltip específico para aside con mejor posicionamiento */}
                  <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 w-64 bg-gray-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-[99999] pointer-events-none border border-gray-700 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-bold text-sm text-white">Monitoreo de {metric.charAt(0).toUpperCase() + metric.slice(1)}</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-xs">{tooltip}</p>
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
          {!isAsideCollapsed && (
            <div className="mt-auto hidden lg:block">
              <div className="bg-gray-100 dark:bg-slate-800/50 p-4 rounded-xl text-center mx-2">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Estado del Sistema</p>
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

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <header className="flex flex-wrap gap-4 justify-between items-start mb-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">Sensorificación Río Claro - Pucón</h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">Dashboard de monitoreo en tiempo real.</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
              <CustomTooltip
                title="Notificaciones del Sistema"
                content="Alertas y notificaciones sobre el estado de los sensores, niveles críticos del río y actualizaciones del sistema. Actualmente tienes 3 notificaciones pendientes."
                icon={Bell}
                position="bottom"
              >
                <button className="relative text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white animate-pulse">3</span>
                </button>
              </CustomTooltip>
              <UserMenu />
            </div>
          </header>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <>
                <SkeletonChart />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonGauge />
                <SkeletonCard />
              </>
            ) : (
              <>
                <TimeFlowChart
                  data={chartData}
                  metric={selectedMetric}
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                  unit={metricConfig[selectedMetric].unit}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                />
                <MetricCard
                  icon={metricConfig[selectedMetric].icon}
                  title={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                  value={metrics[selectedMetric].station1}
                  unit={metricConfig[selectedMetric].unit}
                  tooltipContent={metricConfig[selectedMetric].tooltip}
                  colorClass="text-emerald-500 dark:text-emerald-400"
                  trend="stable"
                  stationName="Estación 1"
                  sparklineData={sparklineData.station1}
                  sparklineColor="#10b981"
                />
                <MetricCard
                  icon={metricConfig[selectedMetric].icon}
                  title={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                  value={metrics[selectedMetric].station2}
                  unit={metricConfig[selectedMetric].unit}
                  tooltipContent={metricConfig[selectedMetric].tooltip}
                  colorClass="text-sky-500 dark:text-sky-400"
                  trend="up"
                  stationName="Estación 2"
                  sparklineData={sparklineData.station2}
                  sparklineColor="#0ea5e9"
                />
                <ComparisonGauge data={metrics} dataKey={selectedMetric} title={`Comparativa de ${selectedMetric}`} tooltipContent={`Visualización comparativa del ${selectedMetric} entre la Estación 1 (verde) y la Estación 2 (azul).`} />
                <TemperatureCard temperatureData={temperatureData} />
              </>
            )}
          </motion.div>

          {/* Mapa Climático - Nueva sección */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RioClaroStationsMap />
          </motion.div>
        </main>
      </div>

      {/* Modal de Pantalla Completa */}
      <FullscreenChartModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        data={chartData}
        metric={selectedMetric}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        unit={metricConfig[selectedMetric].unit}
      />
    </div>
  );
}