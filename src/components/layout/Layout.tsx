import React from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../../contexts/DashboardContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Layout: React.FC = () => {
  const { state } = useDashboard();

  return (
    <div className="relative bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white min-h-screen font-sans transition-colors duration-300">
      {/* Fondo con gradiente y patrón */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente radial */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-50/30 via-transparent to-transparent dark:from-cyan-950/20 dark:via-transparent dark:to-transparent"></div>

        {/* Patrón de puntos para modo oscuro */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }}>
        </div>

        {/* Patrón geométrico para modo claro */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-0"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      <div className="relative flex z-10">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden relative">
          <Header />
          <motion.div
            className="p-4 sm:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MainContent />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;