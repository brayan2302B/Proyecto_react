import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiBell, 
  FiCalendar, 
  FiKey, 
  FiCpu, 
  FiSettings,
  FiInfo,
  FiMonitor
} from 'react-icons/fi';
import { toast } from 'sonner';
import api from '../../services/api';
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
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [darkMode, setDarkMode] = useState(localStorage.getItem('stimi_dark_mode') === 'true');
  const [idioma, setIdioma] = useState(localStorage.getItem('stimi_idioma') || 'es');

  // Cargar preferencias desde el backend al montar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/personas/me/settings');
        const prefs = res.data;
        if (prefs.notif_pendientes !== undefined) setNotifPendientes(Boolean(prefs.notif_pendientes));
        if (prefs.notif_nuevos !== undefined) setNotifNuevos(Boolean(prefs.notif_nuevos));
        if (prefs.notif_aprobacion !== undefined) setNotifAprobacion(Boolean(prefs.notif_aprobacion));
        if (prefs.notif_correo !== undefined) setNotifCorreo(Boolean(prefs.notif_correo));
      } catch (err) {
        console.error('No se pudieron cargar las preferencias:', err);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      // Persistir periodo
      updatePeriodo({
        mesActivo: periodoActivo,
        fechaLimite: `${fechaLimite}T23:59:00`,
        habilitado: !bloquearEnvios
      });
      // Persistir apariencia
      localStorage.setItem('stimi_dark_mode', darkMode);
      localStorage.setItem('stimi_idioma', idioma);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Persistir preferencias en backend
      await api.put('/personas/me/settings', {
        notif_pendientes: notifPendientes,
        notif_nuevos: notifNuevos,
        notif_aprobacion: notifAprobacion,
        notif_correo: notifCorreo,
      });
      toast.success('Configuración guardada correctamente');
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      toast.error('No se pudo guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  // ── Caché del navegador ─────────────────────────────────────────────────────
  const handleClearCache = async () => {
    const confirmed = window.confirm(
      '¿Deseas eliminar la caché local del navegador?\n\nEsta acción limpiará datos temporales almacenados en tu dispositivo. Tu sesión se mantendrá activa.'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('stimi_token');
      const userStored = localStorage.getItem('stimi_user');
      localStorage.clear();
      if (token) localStorage.setItem('stimi_token', token);
      if (userStored) localStorage.setItem('stimi_user', userStored);

      sessionStorage.clear();

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      toast.success('✅ Caché local eliminada correctamente. Recargando...', {
        duration: 2000,
      });

      setTimeout(() => window.location.reload(), 1800);
    } catch (err) {
      console.error('Error al limpiar caché:', err);
      toast.error('No se pudo limpiar la caché completamente');
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

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

      {/* Apariencia e Idioma Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
          <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
            <FiMonitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Apariencia e Idioma</h3>
            <p className="text-xs text-gray-400">Personaliza la interfaz del sistema para el coordinador</p>
          </div>
        </div>

        <div className="space-y-4">
          <SwitchItem 
            label="Modo Oscuro (Dark Mode)"
            desc="Cambia la apariencia del sistema a colores oscuros"
            checked={darkMode}
            onChange={(val) => {
              setDarkMode(val);
              if (val) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }}
          />
          <div className="flex flex-col gap-1 max-w-sm mt-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Idioma del Sistema</label>
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all cursor-pointer"
            >
              <option value="es">Español (Colombia)</option>
              <option value="en">English (US)</option>
            </select>
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
          <p className="text-[10px] text-gray-500 mb-4">Acciones sobre datos locales de tu sesión</p>
          <button
            type="button"
            id="btn-clear-cache-coordinador"
            onClick={handleClearCache}
            className="px-4 py-2 border border-red-300 hover:bg-red-100 bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            🗑️ Eliminar caché local del navegador
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
