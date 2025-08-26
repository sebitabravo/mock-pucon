import React from 'react';
import type { CustomTooltipProps } from '../../types';

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  content,
  children,
  position = 'top',
  icon,
  value,
  unit,
  trend
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

export default CustomTooltip;