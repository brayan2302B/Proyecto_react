import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiClock, FiX, FiInbox } from 'react-icons/fi';
import api from '../services/api';

const iconMap = {
  success: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
  warning: <FiAlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <FiAlertCircle className="w-5 h-5 text-blue-500" />,
  error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
};

const bgMap = {
  success: 'bg-emerald-50',
  warning: 'bg-amber-50',
  info: 'bg-blue-50',
  error: 'bg-red-50',
};

/** Converts an ISO timestamp to a human-readable relative time string */
function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  return new Date(isoStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export default function NotificacionesPanel({ isOpen, onClose, anchorRef, onUnreadChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.leida).length;

  // Sync unread count to parent layout
  useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [unreadCount, onUnreadChange]);

  // Fetch notifications from the real backend
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/notificaciones');
      setNotifications(response.data);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      // Silently fail — don't crash the panel
    } finally {
      setLoading(false);
    }
  }, []);

  // Load when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

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

  const markAllRead = async () => {
    try {
      await api.patch('/notificaciones/leer-todas');
      setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (err) {
      console.error('Error al marcar notificaciones como leídas:', err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.patch(`/notificaciones/${id}/leer`);
      setNotifications(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n));
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
    }
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
              Marcar leídas
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-8 h-8 border-3 border-[#407754] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 font-medium">Cargando notificaciones...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <FiInbox className="w-10 h-10" />
            <p className="text-sm font-semibold">Sin notificaciones</p>
            <p className="text-xs">No tienes notificaciones por el momento</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id_notificacion}
              onClick={() => !notif.leida && markOneRead(notif.id_notificacion)}
              className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notif.leida ? 'bg-green-50/30' : ''
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${bgMap[notif.tipo] || bgMap.info}`}>
                {iconMap[notif.tipo] || iconMap.info}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!notif.leida ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {notif.mensaje}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  {timeAgo(notif.created_at)}
                </p>
              </div>
              {!notif.leida && (
                <span className="mt-2 w-2 h-2 bg-[#407754] rounded-full shrink-0"></span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">STIMI · Notificaciones en tiempo real</p>
      </div>
    </div>
  );
}
