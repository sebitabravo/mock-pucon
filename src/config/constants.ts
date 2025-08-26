// === CONFIGURACIÓN CENTRALIZADA ===
// Todas las constantes y configuraciones del dashboard

export const APP_CONFIG = {
  name: 'Sensorificación Río Claro - Pucón',
  description: 'Dashboard de monitoreo en tiempo real',
  version: '2.0.0',
  updateInterval: 3000, // 3 segundos
} as const;

export const VISUAL_CONFIG = {
  // Multiplicadores para cada métrica
  multipliers: {
    flujo: { station1: 1.2, station2: 1.1 },
    nivel: { station1: 1/50, station2: 1/48 },
    caudal: { station1: 15, station2: 14 },
    velocidad: { station1: 1/60, station2: 1/58 },
  },
  // Colores para cada estación
  colors: {
    station1: '#34d399', // emerald-400
    station2: '#38bdf8', // sky-400
    temperature: '#f97316', // orange-500
    background: {
      gradient: 'from-cyan-50/30 via-transparent to-transparent',
      darkGradient: 'from-cyan-950/20 via-transparent to-transparent',
    }
  },
  // Configuración de gráficos
  charts: {
    margin: { top: 5, right: 20, left: -10, bottom: 0 },
    strokeWidth: { line: 3, area: 2 },
    opacity: { area: 0.8, bar: 0.8 },
  }
} as const;

export const TIME_RANGES = {
  '30m': { minutes: 30, label: 'Últimos 30 minutos' },
  '1h': { minutes: 60, label: 'Última hora' },
  '6h': { minutes: 360, label: 'Últimas 6 horas' },
  '24h': { minutes: 1440, label: 'Últimas 24 horas' },
} as const;

export const TEXTOS_INTERFACE = {
  dashboard: {
    titulo: 'Sensorificación Río Claro - Pucón',
    subtitulo: 'Dashboard de monitoreo en tiempo real',
    estadoSistema: 'Todos los sensores operativos',
  },
  metricas: {
    flujo: {
      nombre: 'Flujo',
      unidad: 'm³/s',
      descripcion: 'El flujo representa el volumen de agua que pasa por una sección del río en un segundo. Un flujo alto puede indicar crecidas.',
    },
    nivel: {
      nombre: 'Nivel',
      unidad: 'm',
      descripcion: 'El nivel mide la altura del agua del río sobre un punto de referencia. Niveles altos son señal de alerta por posibles desbordes.',
    },
    caudal: {
      nombre: 'Caudal',
      unidad: 'L/s',
      descripcion: 'El caudal es la cantidad de agua que fluye. Es crucial para la gestión de recursos hídricos y la prevención de inundaciones.',
    },
    velocidad: {
      nombre: 'Velocidad',
      unidad: 'm/s',
      descripcion: 'La velocidad del agua. Una velocidad alta, combinada con un nivel alto, aumenta el poder erosivo y el riesgo del río.',
    },
    temperatura: {
      nombre: 'Temperatura del Agua',
      unidad: '°C',
      descripcion: 'Temperatura promedio del agua del río medida por sensores termométricos en ambas estaciones.',
    }
  },
  estaciones: {
    station1: 'Estación 1',
    station2: 'Estación 2',
  },
  rangos: {
    '30m': 'Últimos 30 minutos - Vista detallada para monitoreo inmediato',
    '1h': 'Última hora - Ideal para detectar cambios recientes',
    '6h': 'Últimas 6 horas - Análisis de tendencias a corto plazo',
    '24h': 'Últimas 24 horas - Vista completa del comportamiento diario',
  }
} as const;

export const ANIMATION_CONFIG = {
  stagger: {
    delayChildren: 0.2,
    staggerChildren: 0.1,
  },
  item: {
    duration: 0.6,
    ease: "easeOut" as const,
  },
  countUp: {
    duration: 1.5,
    decimals: 1,
  }
} as const;

export const USER_CONFIG = {
  defaultUser: {
    name: 'Luis Loyola',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
    status: 'En línea',
  }
} as const;