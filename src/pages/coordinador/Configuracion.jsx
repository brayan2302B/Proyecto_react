import React, { useState } from 'react';
import { 
  FiSettings, 
  FiKey, 
  FiLock, 
  FiCpu, 
  FiBell, 
  FiCalendar, 
  FiFileText, 
  FiInfo 
} from 'react-icons/fi';
import { toast } from 'sonner';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [notifPendientes, setNotifPendientes] = useState(true);
  const [notifNuevos, setNotifNuevos] = useState(true);
  const [notifAprobacion, setNotifAprobacion] = useState(false);
  const [notifCorreo, setNotifCorreo] = useState(true);

  const [periodoActivo, setPeriodoActivo] = useState('Julio 2026');
  const [fechaLimite, setFechaLimite] = useState('2026-08-05');
  const [bloquearEnvios, setBloquearEnvios] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Configuración guardada correctamente en el sistema');
  };

  const handleCancel = () => {
    toast.info('Se han descartado los cambios en la configuración');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'firma', label: 'Firma Digital', icon: FiKey },
    { id: 'seguridad', label: 'Seguridad', icon: FiLock },
    { id: 'sistema', label: 'Sistema', icon: FiCpu }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
        <p className="text-sm text-gray-500">Gestione los parámetros generales de STIMI, plazos de entrega y notificaciones</p>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-gray-150 flex gap-4 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-sena-green text-sena-green' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              
              {/* Notificaciones Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                  <FiBell className="text-sena-green" /> Alertas y Notificaciones en Tiempo Real
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-700 block">Informes pendientes de revisión</span>
                      <span className="text-[10px] text-gray-400 block">Alertar semanalmente sobre reportes de instructores sin validar</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifPendientes}
                      onChange={(e) => setNotifPendientes(e.target.checked)}
                      className="w-4 h-4 text-sena-green bg-gray-100 border-gray-300 rounded focus:ring-sena-green focus:ring-2"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-700 block">Nuevos informes recibidos</span>
                      <span className="text-[10px] text-gray-400 block">Notificar instantáneamente cuando un instructor realice un envío</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifNuevos}
                      onChange={(e) => setNotifNuevos(e.target.checked)}
                      className="w-4 h-4 text-sena-green bg-gray-100 border-gray-300 rounded focus:ring-sena-green focus:ring-2"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-700 block">Usuarios pendientes de aprobación</span>
                      <span className="text-[10px] text-gray-400 block">Notificar sobre nuevas solicitudes de registro en la plataforma</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifAprobacion}
                      onChange={(e) => setNotifAprobacion(e.target.checked)}
                      className="w-4 h-4 text-sena-green bg-gray-100 border-gray-300 rounded focus:ring-sena-green focus:ring-2"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-700 block">Notificaciones por correo electrónico</span>
                      <span className="text-[10px] text-gray-400 block">Enviar una copia de las alertas del sistema al correo institucional</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifCorreo}
                      onChange={(e) => setNotifCorreo(e.target.checked)}
                      className="w-4 h-4 text-sena-green bg-gray-100 border-gray-300 rounded focus:ring-sena-green focus:ring-2"
                    />
                  </label>
                </div>
              </div>

              {/* Períodos de Carga Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                  <FiCalendar className="text-sena-green" /> Períodos de Carga y Plazos de Entrega
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Mes Activo de Presentación</label>
                    <select
                      value={periodoActivo}
                      onChange={(e) => setPeriodoActivo(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                    >
                      <option value="Julio 2026">Julio 2026</option>
                      <option value="Agosto 2026">Agosto 2026</option>
                      <option value="Septiembre 2026">Septiembre 2026</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha Límite Ordinaria</label>
                    <input
                      type="date"
                      value={fechaLimite}
                      onChange={(e) => setFechaLimite(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 justify-center pt-4 md:pt-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bloquearEnvios}
                        onChange={(e) => setBloquearEnvios(e.target.checked)}
                        className="w-4 h-4 text-sena-green bg-gray-100 border-gray-300 rounded focus:ring-sena-green focus:ring-2"
                      />
                      Bloquear envíos extemporáneos
                    </label>
                    <span className="text-[9px] text-gray-400 block pl-6">Impide el envío una vez superada la fecha límite ordinaria</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'firma' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FiKey className="text-sena-green" /> Parámetros de Firma Digital y Cifrado
              </h3>
              <p className="text-xs text-gray-500 max-w-2xl">
                Configure las llaves de seguridad GPG o firma digital automatizada en PDF para el aval final de las carpetas mensuales.
              </p>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 max-w-2xl">
                <FiInfo className="w-5 h-5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold">Módulo en modo Demostración</p>
                  <p className="text-[10px] text-amber-700">El gestor de firmas digitales utiliza firmas autocertificadas por defecto. Puede integrar firmas digitales registradas de la ONAC en producción.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FiLock className="text-sena-green" /> Políticas de Seguridad e Inactividad
              </h3>
              <p className="text-xs text-gray-500">
                Ajuste la expiración de las sesiones de los instructores y las restricciones de contraseñas de seguridad.
              </p>
            </div>
          )}

          {activeTab === 'sistema' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FiCpu className="text-sena-green" /> Configuración Interna de Servidores y API
              </h3>
              <p className="text-xs text-gray-500">
                Monitoree el estado del backend simulado y los límites de tamaño máximo para cargas de archivos PDF (por defecto 15MB).
              </p>
            </div>
          )}

          {/* Form Actions footer */}
          <div className="flex gap-3 justify-end border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md shadow-sm"
            >
              Guardar configuración
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
