import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiBell, 
  FiCalendar, 
  FiKey, 
  FiCpu, 
  FiSettings,
  FiInfo
} from 'react-icons/fi';
import { toast } from 'sonner';
import { usePeriodo } from '../../components/PeriodoContext';
import { useAuth } from '../../hooks/useAuth';
import PageContainer from '../../components/PageContainer';
import SettingsTabs from '../../components/SettingsTabs';
import FirmaDigitalManager from '../../components/FirmaDigitalManager';

export default function Configuracion() {
  const { user } = useAuth();
  const { periodoInfo, updatePeriodo } = usePeriodo();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'general');
  const [saving, setSaving] = useState(false);

  // Form states - Notifications
  const [notifPendientes, setNotifPendientes] = useState(true);
  const [notifNuevos, setNotifNuevos] = useState(true);
  const [notifAprobacion, setNotifAprobacion] = useState(false);
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [firmaData, setFirmaData] = useState(null); // Estado para la firma final

  // Form states - Periodo
  const [periodoActivo, setPeriodoActivo] = useState(periodoInfo.mesActivo);
  const [fechaLimite, setFechaLimite] = useState(periodoInfo.fechaLimite.split('T')[0]);
  const [bloquearEnvios, setBloquearEnvios] = useState(!periodoInfo.habilitado);

  // Sync state if context changes
  useEffect(() => {
    setPeriodoActivo(periodoInfo.mesActivo);
    setFechaLimite(periodoInfo.fechaLimite.split('T')[0]);
    setBloquearEnvios(!periodoInfo.habilitado);
  }, [periodoInfo]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updatePeriodo({
        mesActivo: periodoActivo,
        fechaLimite: `${fechaLimite}T23:59:00`,
        habilitado: !bloquearEnvios
      });
      setSaving(false);
      toast.success('Configuración de coordinación guardada correctamente');
    }, 800);
  };

  const handleCancel = () => {
    setPeriodoActivo(periodoInfo.mesActivo);
    setFechaLimite(periodoInfo.fechaLimite.split('T')[0]);
    setBloquearEnvios(!periodoInfo.habilitado);
    setNotifPendientes(true);
    setNotifNuevos(true);
    setNotifAprobacion(false);
    setNotifCorreo(true);
    toast.info('Se han descartado los cambios en la configuración');
  };

  // Switch wrapper component for clean render
  const SwitchItem = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="space-y-0.5">
        <span className="text-xs font-bold text-gray-700 block">{label}</span>
        <span className="text-[10px] text-gray-400 block leading-tight">{desc}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#407754] focus:ring-offset-2 cursor-pointer ${
          checked ? 'bg-[#407754]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Notifications Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
          <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
            <FiBell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Alertas y Notificaciones</h3>
            <p className="text-xs text-gray-400">Parámetros generales de alerta del panel</p>
          </div>
        </div>

        <div className="space-y-1">
          <SwitchItem 
            label="Informes pendientes de revisión"
            desc="Alertar semanalmente sobre reportes de instructores sin validar"
            checked={notifPendientes}
            onChange={setNotifPendientes}
          />
          <SwitchItem 
            label="Nuevos informes recibidos"
            desc="Notificar instantáneamente cuando un instructor realice un envío"
            checked={notifNuevos}
            onChange={setNotifNuevos}
          />
          <SwitchItem 
            label="Usuarios pendientes de aprobación"
            desc="Notificar sobre nuevas solicitudes de registro en la plataforma"
            checked={notifAprobacion}
            onChange={setNotifAprobacion}
          />
          <SwitchItem 
            label="Notificaciones por correo electrónico"
            desc="Enviar una copia de las alertas del sistema al correo institucional"
            checked={notifCorreo}
            onChange={setNotifCorreo}
          />
        </div>
      </div>

      {/* Períodos de Carga Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
          <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
            <FiCalendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Períodos de Carga y Plazos de Entrega</h3>
            <p className="text-xs text-gray-400">Configuración del mes activo y fechas límite de carga de informes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Mes Activo de Presentación</label>
            <select
              value={periodoActivo}
              onChange={(e) => setPeriodoActivo(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Julio 2026">Julio 2026</option>
              <option value="Agosto 2026">Agosto 2026</option>
              <option value="Septiembre 2026">Septiembre 2026</option>
              <option value="Octubre 2026">Octubre 2026</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Fecha Límite Ordinaria</label>
            <input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1 justify-center pt-2 md:pt-4">
            <label className="flex items-center gap-2.5 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={bloquearEnvios}
                onChange={(e) => setBloquearEnvios(e.target.checked)}
                className="w-4.5 h-4.5 text-[#407754] bg-white border-gray-300 rounded focus:ring-[#407754] focus:ring-2 cursor-pointer"
              />
              Bloquear envíos extemporáneos
            </label>
            <span className="text-[9px] text-gray-400 block pl-7">Impide el envío una vez superada la fecha límite ordinaria</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFirmaTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FirmaDigitalManager 
        defaultName={user?.nombreCompleto} 
        defaultRole="Coordinador Académico"
        onFirmaSave={(data) => setFirmaData(data)}
      />
    </div>
  );

  const renderSistemaTab = () => {
    const infoItems = [
      { label: 'Versión del Sistema', value: 'v1.2.0' },
      { label: 'Regional', value: 'Antioquia' },
      { label: 'Centro de Formación', value: 'Centro de Servicios y Gestión Empresarial' },
      { label: 'Sede Principal', value: 'Complejo Central' },
      { label: 'Rol de Usuario', value: 'Coordinador Académico' },
      { label: 'Última Actualización', value: '23 de Julio de 2026' }
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Info Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
            <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
              <FiCpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Información del Sistema</h3>
              <p className="text-xs text-gray-400">Detalles de despliegue y ubicación del usuario</p>
            </div>
          </div>

          <div className="space-y-3.5 max-w-xl">
            {infoItems.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500 font-semibold">{item.label}</span>
                <span className="text-xs font-extrabold text-gray-800 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acerca de STIMI Card */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-sm font-extrabold text-blue-900 mb-2">Acerca de STIMI</h4>
          <p className="text-xs text-blue-800 leading-relaxed max-w-2xl mb-4">
            STIMI (Sistema de Trazabilidad Mensual de Informes) es la plataforma oficial de seguimiento académico y contractual para instructores de la Regional Antioquia.
          </p>
          <div className="flex gap-2">
            <span className="bg-[#407754] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">GC - Gestión Contractual</span>
            <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">GF - Gestión Financiera</span>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 shadow-sm">
          <h4 className="text-sm font-extrabold text-red-700 mb-1">Zona de Peligro</h4>
          <p className="text-[10px] text-gray-500 mb-4">Acciones irreversibles sobre los datos del sistema</p>
          <button
            type="button"
            onClick={() => toast.warning('Esta acción destructiva simulada está deshabilitada temporalmente.')}
            className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reestablecer todos los períodos
          </button>
        </div>
      </div>
    );
  };

  return (
    <PageContainer maxWidth="max-w-5xl">
      <SettingsTabs
        title="Configuración del Sistema"
        subtitle="Personaliza el sistema de coordinación de SITMI"
        saving={saving}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSave}
        onCancel={handleCancel}
        renderGeneralTab={renderGeneralTab}
        renderFirmaTab={renderFirmaTab}
        renderSistemaTab={renderSistemaTab}
      />
    </PageContainer>
  );
}
