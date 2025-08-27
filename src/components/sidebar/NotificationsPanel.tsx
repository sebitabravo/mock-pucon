import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
}

// Notificaciones hardcodeadas para la demo
const DEMO_NOTIFICATIONS: SimpleNotification[] = [
  {
    id: '1',
    type: 'critical',
    title: '🚨 NIVEL CRÍTICO - Estación 1',
    message: 'El nivel del agua ha alcanzado 3.2m, superando el umbral crítico. Evacuar zona de riesgo.',
    time: 'hace 5 minutos'
  },
  {
    id: '2',
    type: 'warning',
    title: '⚠️ Sensor Desconectado',
    message: 'El sensor de caudal en Estación 2 no responde. Verificar conectividad.',
    time: 'hace 15 minutos'
  },
  {
    id: '3',
    type: 'info',
    title: '🌧️ Pronóstico de Lluvia',
    message: 'Se esperan precipitaciones en las próximas 6 horas. Monitorear niveles.',
    time: 'hace 2 horas'
  },
  {
    id: '4',
    type: 'success',
    title: '✅ Sistema Actualizado',
    message: 'Actualización exitosa del sistema de monitoreo v2.1.0.',
    time: 'hace 6 horas'
  }
];

interface SimpleNotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleNotificationsPanel: React.FC<SimpleNotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificaciones</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{notifications.length}</span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border ${getColors(notif.type)}`}>
              <div className="flex items-start gap-3">
                {getIcon(notif.type)}
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white">{notif.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notif.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{notif.time}</span>
                    <button 
                      onClick={() => removeNotification(notif.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <p className="text-xs text-gray-500 text-center">Sistema de Monitoreo Río Claro - Pucón</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleNotificationsPanel;
