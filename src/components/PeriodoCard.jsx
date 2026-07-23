import React, { useState } from 'react';
import { FiUnlock, FiLock, FiFileText, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { usePeriodo } from './PeriodoContext';
import { toast } from 'sonner';

export default function PeriodoCard({ isEditable = false }) {
  const { periodoInfo, updatePeriodo } = usePeriodo();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [mesActivo, setMesActivo] = useState(periodoInfo.mesActivo);
  const [fechaLimite, setFechaLimite] = useState(periodoInfo.fechaLimite.split('T')[0]);
  const [habilitado, setHabilitado] = useState(periodoInfo.habilitado);

  const handleSave = () => {
    updatePeriodo({
      mesActivo,
      fechaLimite: `${fechaLimite}T23:59:00`,
      habilitado
    });
    setIsEditing(false);
    toast.success('Período de carga actualizado correctamente');
  };

  const handleCancel = () => {
    // Reset to current context values
    setMesActivo(periodoInfo.mesActivo);
    setFechaLimite(periodoInfo.fechaLimite.split('T')[0]);
    setHabilitado(periodoInfo.habilitado);
    setIsEditing(false);
  };

  // Helper to format date nicely
  const formatFriendlyDate = (isoString) => {
    if (!isoString) return '';
    const datePart = isoString.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return datePart;
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parts[2];
    return `${day} de ${month} de ${year}`;
  };

  const activeBadgeColor = periodoInfo.habilitado ? 'bg-[#407754] text-white' : 'bg-red-600 text-white';
  const activeBadgeLabel = periodoInfo.habilitado ? 'Activo' : 'Cerrado';
  const ActiveIcon = periodoInfo.habilitado ? FiUnlock : FiLock;

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 text-green-100 opacity-50">
        <ActiveIcon className="w-48 h-48" />
      </div>

      <div className="flex flex-1 items-start sm:items-center gap-5 relative z-10 w-full">
        <div className="bg-white p-3 rounded-full shadow-sm shrink-0 relative z-10">
          <ActiveIcon className="w-8 h-8 text-[#407754]" />
        </div>
        
        <div className="relative z-10 flex-1 w-full">
          {isEditing ? (
            <div className="space-y-3 w-full max-w-xl">
              <h4 className="font-bold text-gray-900 text-sm">Editar Período de Carga</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Mes Activo</label>
                  <select
                    value={mesActivo}
                    onChange={(e) => setMesActivo(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] transition-all"
                  >
                    <option value="Julio 2026">Julio 2026</option>
                    <option value="Agosto 2026">Agosto 2026</option>
                    <option value="Septiembre 2026">Septiembre 2026</option>
                    <option value="Octubre 2026">Octubre 2026</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Fecha Límite</label>
                  <input
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1 justify-end">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer h-9">
                    <input
                      type="checkbox"
                      checked={habilitado}
                      onChange={(e) => setHabilitado(e.target.checked)}
                      className="w-4 h-4 text-[#407754] bg-white border-gray-300 rounded focus:ring-[#407754] focus:ring-2"
                    />
                    Habilitado
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {isEditable ? 'Período de Carga Académica' : 'Sistema Habilitado para Carga de Informes'}
                </h2>
                <span className={`${activeBadgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
                  {activeBadgeLabel}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Período de carga: <strong className="text-gray-900">{periodoInfo.mesActivo}</strong> <span className="mx-2 text-gray-300">|</span> 
                Fecha límite: <strong className="text-gray-900 text-red-600">{formatFriendlyDate(periodoInfo.fechaLimite)}</strong>
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                  Formato GTH-F-062 V10 (GC)
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                  Formato GF (Gestión Financiera)
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 flex gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
        {isEditable && (
          isEditing ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <FiX className="w-4 h-4" /> Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#407754] hover:bg-[#335f43] text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 hover:shadow-md"
              >
                <FiCheck className="w-4 h-4" /> Guardar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full md:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 hover:shadow-sm"
            >
              <FiEdit2 className="w-4 h-4 text-[#407754]" /> Editar Período
            </button>
          )
        )}
        
        {!isEditable && (
          <div className="hidden lg:flex flex-col gap-2">
            {/* Format download references if wanted */}
            <span className="text-[10px] font-bold text-[#407754]/80 text-right">Formatos vigentes</span>
          </div>
        )}
      </div>
    </div>
  );
}
