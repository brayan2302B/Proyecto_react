import React, { useState } from 'react';
import { FiX, FiSave, FiLock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export default function SettingsTabs({ 
  title, 
  subtitle, 
  onSave, 
  onCancel, 
  saving = false,
  activeTab,
  setActiveTab,
  renderGeneralTab,
  renderFirmaTab,
  renderSistemaTab
}) {
  const { changePassword } = useAuth();
  
  // Security change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'firma', label: 'Firma Digital' },
    { id: 'seguridad', label: 'Seguridad' },
    { id: 'sistema', label: 'Sistema' }
  ];

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    
    setUpdatingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Contraseña actualizada con éxito');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.message || 'Error al actualizar la contraseña');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const renderSeguridadTabContent = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Seguridad de la Cuenta</h3>
              <p className="text-xs text-gray-400">Actualiza tu contraseña periódicamente</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-all"
          >
            {showPasswordForm ? (
              <>Ocultar <FiChevronUp className="w-4.5 h-4.5 text-[#407754]" /></>
            ) : (
              <>Cambiar contraseña <FiChevronDown className="w-4.5 h-4.5 text-[#407754]" /></>
            )}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md transition-all duration-300 animate-in slide-in-from-top-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 font-medium">
              🔑 La contraseña debe tener al menos 8 caracteres e incluir letras y números.
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Contraseña actual</label>
              <input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Nueva contraseña</label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Confirmar contraseña</label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full mt-2 py-2.5 bg-[#407754] hover:bg-[#335f43] text-white text-xs font-bold rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiLock className="w-4 h-4" /> 
              {updatingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-[#407754]">{title}</h2>
        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
      </div>

      {/* Segmented Control Selector Tabs */}
      <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-wrap md:inline-flex gap-1 shadow-inner border border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-initial text-center px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {activeTab === 'general' && renderGeneralTab && renderGeneralTab()}
        {activeTab === 'firma' && renderFirmaTab && renderFirmaTab()}
        {activeTab === 'seguridad' && renderSeguridadTabContent()}
        {activeTab === 'sistema' && renderSistemaTab && renderSistemaTab()}
      </div>

      {/* Fixed Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 py-4 px-6 md:px-8 z-40 flex justify-end gap-3 shadow-md">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
        >
          <FiX className="w-4.5 h-4.5" /> Cancelar
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#407754] hover:bg-[#335f43] text-white text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <FiSave className="w-4.5 h-4.5" /> 
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  );
}
