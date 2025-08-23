import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  unit: string;
  sparklineData: { value: number; time: Date }[];
  sparklineColor: string;
  trend?: string;
  stationName: string;
  colorClass: string;
  isLoading?: boolean;
}

// Variantes de animación
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
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const MetricCard: React.FC<MetricCardProps> = memo(({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  sparklineData,
  sparklineColor,
  trend,
  stationName,
  colorClass,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 flex flex-col justify-center items-center text-center animate-pulse"
      >
        <div className="w-5 h-5 bg-gray-300 dark:bg-slate-600 rounded mb-2"></div>
        <div className="w-16 h-4 bg-gray-300 dark:bg-slate-600 rounded mb-3"></div>
        <div className="w-20 h-8 bg-gray-300 dark:bg-slate-600 rounded mb-3"></div>
        <div className="w-full h-12 bg-gray-300 dark:bg-slate-600 rounded"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/50 flex flex-col justify-center items-center text-center group hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <span className="text-sm font-medium text-gray-600 dark:text-slate-400 capitalize">
            {title}
          </span>
        </div>
        
        <div className="mb-1">
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {stationName}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            <CountUp
              end={value}
              duration={1.5}
              decimals={2}
              preserveValue
            />
            <span className="text-sm font-normal text-gray-500 dark:text-slate-400 ml-1">
              {unit}
            </span>
          </div>
        </div>

        {/* Sparkline optimizado */}
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {trend && (
          <div className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            Tendencia: {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';

export default MetricCard;
