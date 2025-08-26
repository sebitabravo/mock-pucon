import React from 'react';
import { motion } from 'framer-motion';

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

const SkeletonChart: React.FC = () => (
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

export default SkeletonChart;