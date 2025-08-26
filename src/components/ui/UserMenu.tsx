import React, { useState } from 'react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { USER_CONFIG } from '../../config/constants';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { defaultUser } = USER_CONFIG;
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700/50 p-2 rounded-full transition-all duration-300"
      >
        <img 
          src={defaultUser.avatar} 
          alt={defaultUser.name} 
          className="w-8 h-8 rounded-full border-2 border-emerald-400 object-cover" 
        />
        <div className="text-left hidden md:block">
          <p className="font-semibold text-sm text-gray-800 dark:text-white">{defaultUser.name}</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            {defaultUser.status}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-slate-700 py-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
            <User size={16} /> Perfil
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
            <Settings size={16} /> Ajustes
          </a>
          <hr className="border-gray-200 dark:border-slate-700 my-1"/>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700">
            <LogOut size={16} /> Cerrar Sesión
          </a>
        </div>
      )}
    </div>
  );
};

export default UserMenu;