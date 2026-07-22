import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiClock, FiCheck, FiInfo } from 'react-icons/fi';

const MOCK_ALERTAS = [
  {
    id: 'a-1',
    texto: 'Wilson Martínez cargó su informe GC (Gestión Contractual)',
    tiempo: 'Hace 10 min',
    tipo: 'info',
    leido: false
  },
  {
    id: 'a-2',
    texto: 'Diana Carolina Ruiz cargó su informe GF (Gestión Financiera)',
    tiempo: 'Hace 1 hora',
    tipo: 'info',
    leido: false
  },
  {
    id: 'a-3',
    texto: 'Alerta: Informe de Ana María Gómez fue rechazado por firma faltante',
    tiempo: 'Hace 3 horas',
    tipo: 'warning',
    leido: false
  },
  {
    id: 'a-4',
    texto: 'Período de carga de informes para Julio 2026 habilitado',
    tiempo: 'Hace 1 día',
    tipo: 'success',
    leido: true
  },
  {
    id: 'a-5',
    texto: 'Nuevo usuario Instructor registrado: Diana Carolina Ruiz',
    tiempo: 'Hace 2 días',
    tipo: 'success',
    leido: true
  }
];

export default function NotificacionesFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertas, setAlertas] = useState(MOCK_ALERTAS);
  const popoverRef = useRef(null);

  const unreadCount = alertas.filter((a) => !a.leido).length;

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

  const markAllAsRead = () => {
    setAlertas((prev) => prev.map((a) => ({ ...a, leido: true })));
  };

  return (
    <div className="fixed bottom-22 right-6 z-40" ref={popoverRef}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white border border-gray-150 shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
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
        <div className="absolute bottom-14 right-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 space-y-3 animate-fade-in origin-bottom-right z-50 transition-all duration-200 transform scale-100">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Centro de Notificaciones</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] text-sena-green font-bold hover:underline cursor-pointer"
              >
                Marcar leídos
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {alertas.map((alerta) => (
              <div 
                key={alerta.id}
                className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-colors flex gap-2 ${
                  alerta.leido 
                    ? 'bg-white border-gray-100 text-gray-500' 
                    : 'bg-sena-green-light border-green-100 text-gray-850'
                }`}
              >
                <div className="mt-0.5">
                  {alerta.tipo === 'warning' ? (
                    <FiInfo className="text-red-500 w-3.5 h-3.5" />
                  ) : (
                    <FiCheck className="text-sena-green w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className={alerta.leido ? 'font-normal' : 'font-semibold'}>{alerta.texto}</p>
                  <span className="text-[9px] text-gray-400 font-medium block flex items-center gap-1">
                    <FiClock /> {alerta.tiempo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-1 border-t border-gray-50">
            <span className="text-[10px] text-gray-400 font-medium">STIMI Alertas en tiempo real</span>
          </div>
        </div>
      )}
    </div>
  );
}
