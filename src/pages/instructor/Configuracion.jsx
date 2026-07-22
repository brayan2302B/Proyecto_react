import React, { useState } from 'react';
import { FiBell, FiShield, FiCpu, FiMonitor, FiGlobe, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // Toggle states for notifications
  const [toggles, setToggles] = useState({
    informesPendientes: true,
    evidencias: true,
    seguimiento: true,
    correo: false,
  });

  const toggleKeys = [
    { key: 'informesPendientes', label: 'Alertas de informes pendientes' },
    { key: 'evidencias', label: 'Alertas de evidencias' },
    { key: 'seguimiento', label: 'Alertas de seguimiento a aprendices' },
    { key: 'correo', label: 'Notificaciones por correo electrónico' },
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: FiMonitor },
    { id: 'seguridad', label: 'Seguridad', icon: FiShield },
    { id: 'sistema', label: 'Sistema', icon: FiCpu },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Reusable footer buttons
  const FooterButtons = () => (
    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
      <button className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
        Cancelar
      </button>
      <button 
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-2.5 bg-[#407754] hover:bg-[#346244] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Guardando...
          </>
        ) : (
          'Guardar configuración'
        )}
      </button>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Configuración</h1>
        <p className="text-gray-500 mt-1 font-medium">Personaliza tu experiencia en STIMI</p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#407754] text-white shadow-md shadow-green-900/10' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 overflow-y-auto">
          
          {/* Tab: General */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Notificaciones */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FiBell className="text-gray-400" /> Notificaciones
                </h3>
                <div className="space-y-4">
                  {toggleKeys.map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{label}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={toggles[key]}
                        onClick={() => handleToggle(key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#407754] focus:ring-offset-2 ${
                          toggles[key] ? 'bg-[#407754]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                            toggles[key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apariencia */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FiMonitor className="text-gray-400" /> Apariencia e Idioma
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tema</label>
                    <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#407754] bg-white shadow-sm cursor-not-allowed opacity-80" disabled>
                      <option>Claro (Por defecto)</option>
                      <option>Oscuro (No disponible)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      <FiGlobe className="w-4 h-4 text-gray-400" /> Idioma
                    </label>
                    <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#407754] bg-white shadow-sm cursor-not-allowed opacity-80" disabled>
                      <option>Español (Colombia)</option>
                    </select>
                  </div>
                </div>
              </div>

              <FooterButtons />
            </div>
          )}

          {/* Tab: Seguridad */}
          {activeTab === 'seguridad' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FiShield className="text-gray-400" /> Seguridad de la Cuenta
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-lg leading-relaxed">
                  Actualiza tu contraseña periódicamente para mantener tu cuenta segura. La contraseña debe tener al menos 8 caracteres, incluyendo números y letras.
                </p>
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl max-w-md space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Contraseña Actual</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#407754] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#407754] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirmar Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#407754] outline-none" />
                  </div>
                  <button className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl mt-2 transition-colors">
                    Actualizar Contraseña
                  </button>
                </div>
              </div>

              <FooterButtons />
            </div>
          )}

          {/* Tab: Sistema */}
          {activeTab === 'sistema' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FiCpu className="text-gray-400" /> Información del Sistema
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Versión</p>
                    <p className="font-bold text-gray-900">STIMI v1.0.0</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Rol</p>
                    <p className="font-bold text-gray-900">Instructor</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Última actualización</p>
                    <p className="font-bold text-gray-900">Julio 2026</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-2 sm:col-span-3">
                    <p className="text-xs text-gray-500 mb-1">Sede / Centro</p>
                    <p className="font-bold text-gray-900">Sede Yamboro, Centro de Gestión y Desarrollo Sostenible Surcolombiano (Regional Huila)</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-4">
                <FiInfo className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Acerca de STIMI</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Sistema de Trazabilidad de Informes Mensuales de Instructores. Diseñado para centralizar y agilizar la entrega de formatos.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded shadow-sm">GC - GTH-F-062</span>
                    <span className="bg-white text-emerald-700 text-xs font-bold px-2 py-1 rounded shadow-sm">GF - Gestión Financiera</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FiAlertTriangle /> Zona de Peligro
                </h3>
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-red-900">Restaurar configuración</h4>
                    <p className="text-xs text-red-700 mt-1 max-w-sm">
                      Esta acción restablecerá todas tus preferencias de notificaciones a los valores por defecto.
                    </p>
                  </div>
                  <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap">
                    Restaurar por defecto
                  </button>
                </div>
              </div>

              <FooterButtons />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
