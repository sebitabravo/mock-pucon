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

const SkeletonGauge: React.FC = () => (
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

export default SkeletonGauge;