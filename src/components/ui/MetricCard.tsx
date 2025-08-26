import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import CustomTooltip from './CustomTooltip';
import Sparkline from './Sparkline';
import type { MetricCardProps } from '../../types';

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

const MetricCard: React.FC<MetricCardProps> = ({
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

export default MetricCard;