import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';
import CountUp from 'react-countup';
import CustomTooltip from './CustomTooltip';
import Sparkline from './Sparkline';
import type { SparklineData } from '../../types';

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

interface TemperatureCardProps {
  temperatureData: SparklineData[];
}

const TemperatureCard: React.FC<TemperatureCardProps> = ({ temperatureData }) => {
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

export default TemperatureCard;