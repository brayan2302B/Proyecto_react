import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTrendingUp, FiUnlock, FiAlertCircle, FiFolder, FiFileText, FiChevronRight, FiSettings, FiBell } from 'react-icons/fi';
import logoSena from '../../assets/logo-sena.png';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Control del Instructor</h1>
        <p className="text-gray-500 mt-1 font-medium">Sistema STIMI - Regional Huila, Centro de Gestión y Desarrollo Sostenible Surcolombiano</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Period Banner */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm flex items-start sm:items-center gap-5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 text-green-100 opacity-50">
              <FiUnlock className="w-48 h-48" />
            </div>

            <div className="bg-white p-3 rounded-full shadow-sm shrink-0 relative z-10">
              <FiUnlock className="w-8 h-8 text-[#407754]" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900">Sistema Habilitado para Carga de Informes</h2>
                <span className="bg-[#407754] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Activo</span>
              </div>
              <p className="text-gray-600 text-sm">
                Período de carga: <strong className="text-gray-900">Julio 2026</strong> <span className="mx-2 text-gray-300">|</span> 
                Fecha límite: <strong className="text-gray-900 text-red-600">31 de Julio de 2026</strong>
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                  Formato GTH-F-062 V10 (GC)
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                  Formato GF (Gestión Financiera)
                </span>
              </div>
              </div>
            </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Informes Enviados</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-xl text-amber-500">
                <FiClock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pendientes (Julio)</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Cumplimiento Anual</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
            </div>
          </div>

          {/* Report Status */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Estado de Informes del Mes Actual</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GC Card */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                    <FiFileText className="w-6 h-6" />
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    Pendiente
                  </span>
                </div>
                <h4 className="font-bold text-gray-900">Gestión Contractual (GC)</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">Formato GTH-F-062 V10</p>
                <button 
                  onClick={() => navigate('/instructor/informes', { state: { openModal: true, reportType: 'GC' } })}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2"
                >
                  Cargar informe
                </button>
              </div>

              {/* GF Card */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                    <FiFileText className="w-6 h-6" />
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    Pendiente
                  </span>
                </div>
                <h4 className="font-bold text-gray-900">Gestión Financiera (GF)</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">Documento de pago</p>
                <button 
                  onClick={() => navigate('/instructor/informes', { state: { openModal: true, reportType: 'GF' } })}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2"
                >
                  Cargar informe
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCheckCircle className="text-green-500 w-4 h-4" />
                <span>Último período validado: <strong>Junio 2026</strong></span>
              </div>
              <button className="text-sm font-semibold text-[#407754] hover:underline flex items-center">
                Ver historial <FiChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Reminders & Alerts */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiBell className="w-5 h-5 text-gray-400" /> Recordatorios
            </h3>
            
            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-red-900">Cierre de período</h4>
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Urgente</span>
                    </div>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Tienes 2 informes pendientes. Recuerda que la plataforma cierra el 31 de Julio a las 23:59.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/instructor/periodo-actual', { state: { openModal: true, reportType: 'GC' } })}
                className="w-full flex items-center p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <FiFileText className="w-5 h-5" />
                </div>
                <span className="ml-3 font-semibold text-sm">Cargar Informe GC</span>
                <FiChevronRight className="ml-auto w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              
              <button 
                onClick={() => navigate('/instructor/periodo-actual', { state: { openModal: true, reportType: 'GF' } })}
                className="w-full flex items-center p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <FiFileText className="w-5 h-5" />
                </div>
                <span className="ml-3 font-semibold text-sm">Cargar Informe GF</span>
                <FiChevronRight className="ml-auto w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => navigate('/instructor/informes')}
                className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors group"
              >
                <div className="bg-gray-100 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <FiFolder className="w-5 h-5" />
                </div>
                <span className="ml-3 font-semibold text-sm">Mis Informes (Historial)</span>
                <FiChevronRight className="ml-auto w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Institucional */}
      <footer className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <img src={logoSena} alt="Logo SENA" className="w-16 h-16 object-contain opacity-80" />
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">Servicio Nacional de Aprendizaje - SENA</h4>
          <p className="text-sm text-gray-500 mt-1">Regional Huila • Centro de Gestión y Desarrollo Sostenible Surcolombiano • Sede Yamboro</p>
        </div>
        <div className="flex flex-col gap-2 items-center md:items-end">
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Instructor</span>
        </div>
      </footer>

    </div>
  );
}
