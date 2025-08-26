import React from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import CustomTooltip from '../ui/CustomTooltip';

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

interface ComparisonGaugeProps {
  data: Record<string, { station1: number; station2: number }>;
  dataKey: string;
  title: string;
  tooltipContent: string;
}

const ComparisonGauge: React.FC<ComparisonGaugeProps> = ({ data, dataKey, title, tooltipContent }) => {
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
        <h3 className="text-gray-600 dark:text-slate-400 font-semibold cursor-help group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors">
          {title}
        </h3>
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

export default ComparisonGauge;