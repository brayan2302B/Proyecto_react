import React, { useState, useRef, useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiClock, FiX } from 'react-icons/fi';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    text: 'Tu informe GF de Junio fue validado por coordinación.',
    time: 'Hace 10 min',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    text: 'Recuerda: el período de carga cierra el 31 de julio a las 23:59.',
    time: 'Hace 1 hora',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    text: 'Tu informe GC de Julio fue cargado exitosamente como borrador.',
    time: 'Hace 3 horas',
    read: false,
  },
  {
    id: 4,
    type: 'info',
    text: 'Se ha habilitado el período de carga de informes para Julio 2026.',
    time: 'Hace 1 día',
    read: true,
  },
  {
    id: 5,
    type: 'success',
    text: 'Tu informe GC de Junio fue validado por coordinación.',
    time: 'Hace 3 días',
    read: true,
  },
  {
    id: 6,
    type: 'warning',
    text: 'Tienes 2 informes pendientes de carga para este mes.',
    time: 'Hace 5 días',
    read: true,
  },
];

const iconMap = {
  success: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
  warning: <FiAlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <FiAlertCircle className="w-5 h-5 text-blue-500" />,
};

const bgMap = {
  success: 'bg-emerald-50',
  warning: 'bg-amber-50',
  info: 'bg-blue-50',
};

export default function NotificacionesPanel({ isOpen, onClose, anchorRef, onUnreadChange }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sync unread count to parent
  useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [unreadCount, onUnreadChange]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute bottom-full right-0 mb-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Centro de Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-xs text-[#407754] font-semibold hover:underline"
            >
              Marcar leídos
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
              !notif.read ? 'bg-green-50/30' : ''
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${bgMap[notif.type]}`}>
              {iconMap[notif.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {notif.text}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {notif.time}
              </p>
            </div>
            {!notif.read && (
              <span className="mt-2 w-2 h-2 bg-[#407754] rounded-full shrink-0"></span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">STIMI Alertas en tiempo real</p>
      </div>
    </div>
  );
}
