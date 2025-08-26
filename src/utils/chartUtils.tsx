import React from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Waves, Droplets } from 'lucide-react';
import type { MetricDataPoint } from '../types';

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

// Función para determinar el tipo de gráfico según la métrica
export const getChartComponent = (metric: string, data: MetricDataPoint[], unit: string) => {
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