import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiBell, 
  FiCpu, 
  FiSettings,
  FiGlobe,
  FiMonitor
} from 'react-icons/fi';
import { toast } from 'sonner';
import api from '../../services/api';
import PageContainer from '../../components/PageContainer';
import SettingsTabs from '../../components/SettingsTabs';

export default function Configuracion() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'general');
  const [saving, setSaving] = useState(false);

  // Toggle states for notifications
  const [notifPendientes, setNotifPendientes] = useState(true);
  const [notifEvidencias, setNotifEvidencias] = useState(true);
  const [notifSeguimiento, setNotifSeguimiento] = useState(true);
  const [notifCorreo, setNotifCorreo] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Cargar preferencias desde el backend al montar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/personas/me/settings');
        const prefs = res.data;
        if (prefs.notif_pendientes !== undefined) setNotifPendientes(Boolean(prefs.notif_pendientes));
        if (prefs.notif_evidencias !== undefined) setNotifEvidencias(Boolean(prefs.notif_evidencias));
        if (prefs.notif_seguimiento !== undefined) setNotifSeguimiento(Boolean(prefs.notif_seguimiento));
        if (prefs.notif_correo !== undefined) setNotifCorreo(Boolean(prefs.notif_correo));
      } catch (err) {
        console.error('No se pudieron cargar las preferencias:', err);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/personas/me/settings', {
        notif_pendientes: notifPendientes,
        notif_evidencias: notifEvidencias,
        notif_seguimiento: notifSeguimiento,
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

  const handleCancel = () => {
    setNotifPendientes(true);
    setNotifEvidencias(true);
    setNotifSeguimiento(true);
    setNotifCorreo(false);
    toast.info('Se han descartado los cambios en la configuración');
  };

  // ── Caché del navegador ─────────────────────────────────────────────────────
  const handleClearCache = async () => {
    const confirmed = window.confirm(
      '¿Deseas eliminar la caché local del navegador?\n\nEsta acción limpiará datos temporales almacenados en tu dispositivo. Tu sesión se mantendrá activa.'
    );
    if (!confirmed) return;

    try {
      // 1. Limpiar localStorage preservando la sesión activa
      const token = localStorage.getItem('stimi_token');
      const user = localStorage.getItem('stimi_user');
      localStorage.clear();
      if (token) localStorage.setItem('stimi_token', token);
      if (user) localStorage.setItem('stimi_user', user);

      // 2. Limpiar sessionStorage completo
      sessionStorage.clear();

      // 3. Limpiar Cache API (Service Worker caches)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      toast.success('✅ Caché local eliminada correctamente. Recargando...', {
        duration: 2000,
      });

      // 4. Recargar la página tras un breve delay para que el toast sea visible
      setTimeout(() => window.location.reload(), 1800);
    } catch (err) {
      console.error('Error al limpiar caché:', err);
      toast.error('No se pudo limpiar la caché completamente');
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

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
            <h3 className="text-sm font-bold text-gray-900">Alertas de Notificaciones</h3>
            <p className="text-xs text-gray-400">Personaliza las alertas que deseas recibir</p>
          </div>
        </div>

        <div className="space-y-1">
          <SwitchItem 
            label="Alertas de informes pendientes"
            desc="Recibir recordatorios sobre informes GC/GF del mes actual pendientes de subir"
            checked={notifPendientes}
            onChange={setNotifPendientes}
          />
          <SwitchItem 
            label="Alertas de evidencias"
            desc="Notificar cuando el plan de formación requiera nuevas evidencias"
            checked={notifEvidencias}
            onChange={setNotifEvidencias}
          />
          <SwitchItem 
            label="Alertas de seguimiento a aprendices"
            desc="Recordatorios semanales sobre el registro de novedades de los aprendices"
            checked={notifSeguimiento}
            onChange={setNotifSeguimiento}
          />
          <SwitchItem 
            label="Notificaciones por correo electrónico"
            desc="Enviar copia del resumen de notificaciones al correo institucional"
            checked={notifCorreo}
            onChange={setNotifCorreo}
          />
        </div>
      </div>

      {/* Appearance Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
          <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
            <FiMonitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Apariencia e Idioma</h3>
            <p className="text-xs text-gray-400">Preferencias de visualización regional</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Tema visual</label>
            <select 
              disabled 
              className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-400 outline-none cursor-not-allowed"
            >
              <option>Claro (Predeterminado del Sistema)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <FiGlobe className="w-3.5 h-3.5" /> Idioma preferido
            </label>
            <select 
              disabled 
              className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-400 outline-none cursor-not-allowed"
            >
              <option>Español (Colombia)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );



  const renderSistemaTab = () => {
    const infoItems = [
      { label: 'Versión del Sistema', value: 'v1.2.0' },
      { label: 'Regional', value: 'Huila' },
      { label: 'Centro de Formación', value: 'Centro de Gestión y Desarrollo Sostenible Surcolombiano' },
      { label: 'Rol de Usuario', value: 'Instructor Contratista' },
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
              <p className="text-xs text-gray-400">Detalles técnicos del entorno</p>
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
            STIMI (Sistema de Trazabilidad Mensual de Informes) permite a los instructores cargar y realizar el seguimiento de sus entregables mensuales GC y GF de manera ágil y digitalizada.
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
            id="btn-clear-cache-instructor"
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
        title="Configuración"
        subtitle="Personaliza el sistema de instructor de SITMI"
        saving={saving}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSave}
        onCancel={handleCancel}
        renderGeneralTab={renderGeneralTab}
        renderSistemaTab={renderSistemaTab}
      />
    </PageContainer>
  );
}
