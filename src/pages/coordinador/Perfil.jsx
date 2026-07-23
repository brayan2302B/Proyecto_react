import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiMail, FiCreditCard, FiHash, FiBriefcase, FiMapPin, FiLock } from 'react-icons/fi';
import { toast } from 'sonner';
import PageContainer from '../../components/PageContainer';

export default function PerfilCoordinador() {
  const { user } = useAuth();

  // Get data from authenticated session
  const nombreCompleto = user?.nombreCompleto || 'Ana María González';
  const email = user?.email || 'coordinador@sena.edu.co';
  const documento = user?.documento || '52887643';
  const centro = user?.centro || 'Centro de Servicios y Gestión Empresarial - Regional Antioquia';
  const vinculacion = user?.vinculacion || 'Contratista - Desde Febrero 2024';
  const area = 'Coordinación Académica';
  const regional = 'Regional Antioquia';

  const handleCambiarContrasena = () => {
    toast.info('Funcionalidad de cambio de contraseña simulada');
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
            <span className="mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">COORDINADOR</span>
          </div>

          {/* Security */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiLock className="text-gray-400" /> Seguridad
            </h3>
            <p className="text-xs text-gray-500 mb-4">La última vez que cambiaste tu contraseña fue hace 3 meses.</p>
            <button 
              onClick={handleCambiarContrasena}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
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
                  <span className="text-sm font-semibold text-gray-700 truncate">Cédula de Ciudadanía</span>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Área de formación / Dependencia</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiBriefcase className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{area}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro / Sede</label>
                <div className="flex flex-col justify-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-h-[46px]">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">{centro}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Regional o ubicación</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiMapPin className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{regional}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  );
}
