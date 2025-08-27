import React, { useState } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useTheme } from '../../hooks/useTheme';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import UserMenu from '../ui/UserMenu';
import CustomTooltip from '../ui/CustomTooltip';
import SimpleNotificationsPanel from '../sidebar/NotificationsPanel';
import { APP_CONFIG } from '../../config/constants';

const Header: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const [theme, setTheme] = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Simulamos 4 notificaciones para la demo
  const notificationCount = 4;

  return (
    <header className="flex flex-wrap gap-4 justify-between items-start p-4 sm:p-6 lg:p-8 pb-0">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
          {APP_CONFIG.name}
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">
          {APP_CONFIG.description}
        </p>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Filtro de Fechas Global */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2">
          <Calendar className="w-4 h-4 text-cyan-500" />
          <div className="flex items-center gap-2 text-sm">
            <input
              type="date"
              value={state.globalDateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => dispatch({
                type: 'SET_DATE_RANGE',
                payload: {
                  ...state.globalDateRange,
                  startDate: new Date(e.target.value)
                }
              })}
              className="bg-transparent border-none text-gray-700 dark:text-slate-300 text-xs focus:outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={state.globalDateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => dispatch({
                type: 'SET_DATE_RANGE',
                payload: {
                  ...state.globalDateRange,
                  endDate: new Date(e.target.value)
                }
              })}
              className="bg-transparent border-none text-gray-700 dark:text-slate-300 text-xs focus:outline-none"
            />
          </div>
        </div>

        <ThemeSwitcher theme={theme} setTheme={setTheme} />

        <CustomTooltip
          title="Notificaciones del Sistema"
          content={`Sistema de alertas preventivas del Río Claro. Tienes ${notificationCount} notificaciones pendientes (2 críticas).`}
          icon={Bell}
          position="bottom"
        >
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            <Bell className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-medium bg-red-500 animate-pulse">
              {notificationCount}
            </span>
          </button>
        </CustomTooltip>

        <UserMenu />
      </div>

      {/* Panel de Notificaciones */}
      <SimpleNotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </header>
  );
};

export default Header;
