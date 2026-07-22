import React from 'react';
import { FiUser, FiMail, FiCreditCard, FiHash, FiBriefcase, FiMapPin, FiFileText, FiUsers, FiLock } from 'react-icons/fi';

export default function Perfil() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
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
            <h2 className="text-xl font-bold text-gray-900">Wilson Martínez López</h2>
            <span className="mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Instructor</span>
          </div>

          {/* Security */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiLock className="text-gray-400" /> Seguridad
            </h3>
            <p className="text-xs text-gray-500 mb-4">La última vez que cambiaste tu contraseña fue hace 3 meses.</p>
            <button className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
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
                  <span className="text-sm font-semibold text-gray-900 truncate">Wilson Martínez López</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiMail className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-900 truncate">wilson.martinez@sena.edu.co</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Documento</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiCreditCard className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-900 truncate">Cédula de Ciudadanía</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Número de Documento</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiHash className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-900 truncate">1075312894</span>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Área de Formación</label>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <FiBriefcase className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-900">Sistemas e Informática</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro de Formación</label>
                <div className="flex flex-col justify-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-h-[46px]">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">Centro de Gestión y Desarrollo Sostenible Surcolombiano</span>
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

          {/* Estadísticas */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Estadísticas del Período</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <FiBriefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Fichas Activas</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">3</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Informes Aprobados</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">14</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                  <FiUsers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Aprendices</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">85</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
