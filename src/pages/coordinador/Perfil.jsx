import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiCreditCard, FiHash, FiBriefcase, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import api from '../../services/api';
import PageContainer from '../../components/PageContainer';

export default function PerfilCoordinador() {
  const { user, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields state initialized from current authenticated user
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');

  // Sync state from authenticated user or state editMode
  useEffect(() => {
    if (user) {
      setNombreCompleto(user.nombreCompleto || '');
      setEmail(user.email || user.correo || '');
      setTipoDocumento(user.tipo_documento || 'CC');
      setNumeroDocumento(user.documento || user.numero_documento || '');
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.editMode) {
      setIsEditing(true);
    }
  }, [location.state]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nombreCompleto.trim()) {
      toast.error('El nombre completo no puede estar vacío');
      return;
    }
    if (!email.trim()) {
      toast.error('El correo electrónico no puede estar vacío');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Actualizando información de perfil...');

    try {
      // Call backend API endpoint PATCH /personas/:id
      const payload = {
        nombreCompleto: nombreCompleto.trim(),
        email: email.trim(),
        tipoDocumento,
        numeroDocumento: numeroDocumento.trim(),
      };

      await api.patch(`/personas/${user.id_usuario}`, payload);

      // Update global context so layout and popovers show new values immediately
      updateLocalUser({
        nombreCompleto: payload.nombreCompleto,
        email: payload.email,
        correo: payload.email,
        tipo_documento: payload.tipoDocumento,
        documento: payload.numeroDocumento,
        numero_documento: payload.numeroDocumento,
      });

      toast.success('¡Perfil actualizado con éxito!', { id: toastId });
      setIsEditing(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      const msg = err.response?.data?.message || 'No se pudo actualizar el perfil';
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setNombreCompleto(user.nombreCompleto || '');
      setEmail(user.email || user.correo || '');
      setTipoDocumento(user.tipo_documento || 'CC');
      setNumeroDocumento(user.documento || user.numero_documento || '');
    }
    setIsEditing(false);
  };

  const getTipoDocumentoLargo = (tipo = 'CC') => {
    const map = {
      CC: 'Cédula de Ciudadanía',
      CE: 'Cédula de Extranjería',
      TI: 'Tarjeta de Identidad',
    };
    return map[tipo] || tipo;
  };

  const displayNombre = user?.nombreCompleto || '—';
  const displayArea = user?.area || 'Coordinación Académica';

  return (
    <PageContainer maxWidth="max-w-5xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mi Perfil</h1>
          <p className="text-gray-500 mt-1 font-medium">Información personal y profesional de la cuenta</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#407754] hover:bg-[#335f43] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <FiEdit2 className="w-4 h-4" />
            Editar Perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <FiX className="w-4 h-4" /> Cancelar
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#407754] hover:bg-[#335f43] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        
        {/* Left Column (Avatar & Quick Info) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-4 text-[#407754]">
              <FiUser className="w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{displayNombre}</h2>
            <span className="mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {user?.rol || 'Coordinador'}
            </span>
          </div>

          {/* Security */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiLock className="text-gray-400" /> Seguridad
            </h3>
            <p className="text-xs text-gray-500 mb-4">Puede cambiar su contraseña de acceso institucional cuando lo requiera.</p>
            <button 
              onClick={() => navigate('/coordinador/configuracion', { state: { tab: 'seguridad' } })}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiLock className="w-4 h-4" />
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* Right Column (Details / Edit Form) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Información Personal */}
          <form onSubmit={handleSaveProfile} className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
              {isEditing && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  Modo Edición Activo
                </span>
              )}
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Nombre Completo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <FiUser className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">{displayNombre}</span>
                  </div>
                )}
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                {isEditing ? (
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <FiMail className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">{email || '—'}</span>
                  </div>
                )}
              </div>

              {/* Tipo de Documento */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Documento</label>
                {isEditing ? (
                  <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white cursor-pointer"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <FiCreditCard className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">{getTipoDocumentoLargo(tipoDocumento)}</span>
                  </div>
                )}
              </div>

              {/* Número de Documento */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Número de Documento</label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <FiHash className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">{numeroDocumento || '—'}</span>
                  </div>
                )}
              </div>
              
            </div>

            {isEditing && (
              <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#407754] hover:bg-[#335f43] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </form>

          {/* Información Profesional */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Información Profesional</h3>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Área de Formación / Dependencia</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiBriefcase className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{displayArea}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro / Sede</label>
                <div className="flex flex-col justify-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-h-[46px]">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">Centro de Gestión y Desarrollo Sostenible Surcolombiano</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Regional</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiMapPin className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">Regional Huila</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  );
}
