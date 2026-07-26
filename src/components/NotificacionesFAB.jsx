import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiBell, FiClock, FiCheck, FiInfo, FiInbox } from 'react-icons/fi';
import api from '../services/api';

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

export default function NotificacionesFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);

  const unreadCount = alertas.filter((a) => !a.leida).length;

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/notificaciones');
      setAlertas(response.data);
    } catch (err) {
      console.error('Error al cargar notificaciones del coordinador:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAlertas();
    }
  }, [isOpen, fetchAlertas]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notificaciones/leer-todas');
      setAlertas((prev) => prev.map((a) => ({ ...a, leida: true })));
    } catch (err) {
      console.error('Error al marcar notificaciones como leídas:', err);
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await api.patch(`/notificaciones/${id}/leer`);
      setAlertas((prev) => prev.map((a) => a.id_notificacion === id ? { ...a, leida: true } : a));
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
    }
  };

  return (
    <div className="fixed bottom-22 right-6 z-40" ref={popoverRef}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white border border-gray-150 shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative"
        title="Notificaciones"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 space-y-3 origin-bottom-right z-50 transition-all duration-200">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Notificaciones</h4>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-[#407754] font-bold hover:underline cursor-pointer"
              >
                Marcar leídas
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-[#407754] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : alertas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-gray-400">
                <FiInbox className="w-8 h-8" />
                <p className="text-xs font-semibold">Sin notificaciones</p>
              </div>
            ) : (
              alertas.map((alerta) => (
                <div
                  key={alerta.id_notificacion}
                  onClick={() => !alerta.leida && markOneAsRead(alerta.id_notificacion)}
                  className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-colors flex gap-2 cursor-pointer ${
                    alerta.leida
                      ? 'bg-white border-gray-100 text-gray-500'
                      : 'bg-green-50 border-green-100 text-gray-800'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {alerta.tipo === 'warning' || alerta.tipo === 'error' ? (
                      <FiInfo className="text-amber-500 w-3.5 h-3.5" />
                    ) : (
                      <FiCheck className="text-[#407754] w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className={alerta.leida ? 'font-normal' : 'font-semibold'}>{alerta.mensaje}</p>
                    <span className="text-[9px] text-gray-400 font-medium flex items-center gap-1">
                      <FiClock className="w-2.5 h-2.5" /> {timeAgo(alerta.created_at)}
                    </span>
                  </div>
                  {!alerta.leida && (
                    <span className="mt-1.5 w-2 h-2 bg-[#407754] rounded-full shrink-0"></span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="text-center pt-1 border-t border-gray-50">
            <span className="text-[10px] text-gray-400 font-medium">STIMI · Notificaciones en tiempo real</span>
          </div>
        </div>
      )}
    </div>
  );
}
