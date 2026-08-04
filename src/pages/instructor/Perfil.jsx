import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiCreditCard, 
  FiHash, 
  FiBriefcase, 
  FiMapPin, 
  FiLock,
  FiUploadCloud,
  FiAlertCircle,
  FiEdit2,
  FiSave,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';

export default function Perfil() {
  const { user, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');

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

  const handleSignatureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, cargue una imagen válida (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El tamaño de la firma excede el límite de 5 MB');
      return;
    }

    const formData = new FormData();
    formData.append('firma', file);

    setUploadingSignature(true);
    const toastId = toast.loading('Subiendo firma digital...');

    try {
      const response = await api.post('/personas/me/firma', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const signaturePath = response.data.firma_digital_ruta;
      updateLocalUser({ firma_digital_ruta: signaturePath });
      toast.success('¡Firma digital subida y asociada correctamente!', { id: toastId });
    } catch (err) {
      console.error('Error al subir firma:', err);
      const errMsg = err.response?.data?.message || 'Error al conectar con el servidor';
      toast.error(`No se pudo subir la firma: ${errMsg}`, { id: toastId });
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nombreCompleto.trim()) {
      toast.error('El nombre completo es requerido');
      return;
    }
    if (!email.trim()) {
      toast.error('El correo electrónico es requerido');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Actualizando datos de perfil...');

    try {
      const payload = {
        nombreCompleto: nombreCompleto.trim(),
        email: email.trim(),
        tipoDocumento,
        numeroDocumento: numeroDocumento.trim(),
      };

      await api.patch(`/personas/${user.id_usuario}`, payload);

      updateLocalUser({
        nombreCompleto: payload.nombreCompleto,
        email: payload.email,
        correo: payload.email,
        tipo_documento: payload.tipoDocumento,
        documento: payload.numeroDocumento,
        numero_documento: payload.numeroDocumento,
      });

      toast.success('¡Perfil de instructor actualizado exitosamente!', { id: toastId });
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
  const displayEmail = user?.email || user?.correo || '—';
  const displayDoc = user?.documento || user?.numero_documento || '—';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mi Perfil</h1>
          <p className="text-gray-500 mt-1 font-medium">Información personal y profesional registrada en el sistema</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#407754] hover:bg-[#346244] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
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
              className="flex items-center gap-1.5 px-5 py-2 bg-[#407754] hover:bg-[#346244] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Avatar & Quick Info) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-4 text-[#407754] relative overflow-hidden">
              <FiUser className="w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{displayNombre}</h2>
            <span className="mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {user?.rol || 'Instructor'}
            </span>
          </div>

          {/* Firma Digital Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-900 mb-3 w-full text-left">Firma Digital</h3>
            
            {user?.firma_digital_ruta ? (
              <div className="mb-4 text-center w-full">
                <p className="text-[10px] text-gray-400 mb-1.5 font-bold uppercase tracking-wider">Firma Registrada:</p>
                <div className="border border-gray-150 rounded-2xl p-3 bg-gray-50 max-w-full overflow-hidden flex items-center justify-center">
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${user.firma_digital_ruta}`} 
                    alt="Firma Digital" 
                    className="max-h-24 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x100?text=Firma+Digital';
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold p-4 rounded-2xl w-full text-center flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>No tiene una firma digital registrada en su cuenta.</span>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="firma-upload-input"
              onChange={handleSignatureChange}
              disabled={uploadingSignature}
            />
            <label 
              htmlFor="firma-upload-input"
              className={`w-full py-2.5 bg-[#407754] hover:bg-[#346244] text-white font-bold text-sm rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm ${
                uploadingSignature ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiUploadCloud className="w-4 h-4" />
              {uploadingSignature ? 'Subiendo...' : (user?.firma_digital_ruta ? 'Actualizar Firma' : 'Cargar Firma')}
            </label>
          </div>

          {/* Security */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiLock className="text-gray-400" /> Seguridad
            </h3>
            <p className="text-xs text-gray-500 mb-4">Puede cambiar su contraseña de acceso institucional cuando lo requiera.</p>
            <button
              onClick={() => navigate('/instructor/configuracion', { state: { tab: 'seguridad' } })}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-xl border border-gray-200 transition-colors cursor-pointer"
            >
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
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {displayNombre}
                    </span>
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
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {displayEmail}
                    </span>
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
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {getTipoDocumentoLargo(user?.tipo_documento)}
                    </span>
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
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {displayDoc}
                    </span>
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
                  className="px-5 py-2 bg-[#407754] hover:bg-[#346244] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Área de Formación</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiBriefcase className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-900">
                    {user?.area || 'Sin Área Asignada'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro de Formación</label>
                <div className="flex flex-col justify-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-h-[46px]">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    Centro de Gestión y Desarrollo Sostenible Surcolombiano
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Regional</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiMapPin className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-900">Regional Huila</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
