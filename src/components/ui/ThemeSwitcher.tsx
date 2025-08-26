import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import CustomTooltip from './CustomTooltip';
import type { Theme } from '../../types';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const themes: { name: Theme, icon: React.ElementType, description: string }[] = [
    { name: 'light', icon: Sun, description: 'Modo claro - Ideal para uso durante el día con buena iluminación' },
    { name: 'dark', icon: Moon, description: 'Modo oscuro - Reduce la fatiga visual en ambientes con poca luz' },
    { name: 'system', icon: Monitor, description: 'Automático - Se adapta a la configuración de tu sistema operativo' },
  ];
  
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-full">
      {themes.map(t => {
        const Icon = t.icon;
        return (
          <CustomTooltip
            key={t.name}
            title={`Tema ${t.name === 'light' ? 'Claro' : t.name === 'dark' ? 'Oscuro' : 'Automático'}`}
            content={t.description}
            icon={Icon}
            position="bottom"
          >
            <button 
              onClick={() => setTheme(t.name)} 
              className={`p-2 rounded-full transition-colors ${
                theme === t.name 
                  ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow' 
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon size={16} />
            </button>
          </CustomTooltip>
        )
      })}
    </div>
  );
};

export default ThemeSwitcher;