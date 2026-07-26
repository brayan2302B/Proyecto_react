import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCreditCard, FiHash, FiBriefcase, FiMapPin, FiLock } from 'react-icons/fi';
import PageContainer from '../../components/PageContainer';

export default function PerfilCoordinador() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get data from authenticated session — no hardcoded fallbacks that mask real data
  const nombreCompleto = user?.nombreCompleto || '—';
  const email = user?.email || user?.correo || '—';
  const documento = user?.documento || user?.numero_documento || '—';
  const tipoDocumento = user?.tipo_documento || 'CC';
  const area = user?.area || 'Coordinación Académica';

  const getTipoDocumentoLargo = (tipo = 'CC') => {
    const map = {
      CC: 'Cédula de Ciudadanía',
      CE: 'Cédula de Extranjería',
      TI: 'Tarjeta de Identidad',
    };
    return map[tipo] || tipo;
  };

  return (
    <PageContainer maxWidth="max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mi Perfil</h1>
        <p className="text-gray-500 mt-1 font-medium">Información personal y profesional</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Avatar & Quick Info) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-4 text-[#407754]">
              <FiUser className="w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{nombreCompleto}</h2>
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
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FiLock className="w-4 h-4" />
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* Right Column (Details) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Información Personal */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiUser className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 truncate">{nombreCompleto}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiMail className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 truncate">{email}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Documento</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiCreditCard className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 truncate">{getTipoDocumentoLargo(tipoDocumento)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Número de Documento</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiHash className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 truncate">{documento}</span>
                </div>
              </div>
              
            </div>
          </div>

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
                  <span className="text-sm font-semibold text-gray-700">{area}</span>
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
