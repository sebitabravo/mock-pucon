import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useTheme } from '../../hooks/useTheme';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import UserMenu from '../ui/UserMenu';
import CustomTooltip from '../ui/CustomTooltip';
import { APP_CONFIG } from '../../config/constants';

const Header: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const [theme, setTheme] = useTheme();

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
          content="Alertas y notificaciones sobre el estado de los sensores, niveles críticos del río y actualizaciones del sistema. Actualmente tienes 3 notificaciones pendientes."
          icon={Bell}
          position="bottom"
        >
          <button className="relative text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white animate-pulse">3</span>
          </button>
        </CustomTooltip>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;