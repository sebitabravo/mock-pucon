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

const SkeletonCard: React.FC = () => (
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

export default SkeletonCard;