import React, { useEffect, useState } from 'react';
import { instructoresService } from '../../services/instructoresService';
import { informesService } from '../../services/informesService';
import { 
  FiUsers, 
  FiFileText, 
  FiCheckCircle, 
  FiActivity, 
  FiAlertTriangle, 
  FiArrowRight, 
  FiFolder, 
  FiSend 
} from 'react-icons/fi';
import { toast } from 'sonner';

export default function Dashboard() {
  const [instructores, setInstructores] = useState([]);
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [instList, infList] = await Promise.all([
          instructoresService.getInstructores(),
          informesService.getInformes()
        ]);
        setInstructores(instList);
        setInformes(infList);
      } catch (err) {
        toast.error('Error al cargar datos del panel');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSendReminder = async (id, nombre) => {
    setSendingReminder(id);
    try {
      await instructoresService.enviarRecordatorio(id);
      toast.success(`Recordatorio enviado con éxito a ${nombre}`);
    } catch (err) {
      toast.error('No se pudo enviar el recordatorio');
    } finally {
      setSendingReminder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-12 h-12 border-4 border-sena-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Cargando Panel de Coordinación...</p>
      </div>
    );
  }

  // Calculate metrics
  const totalInstructores = instructores.length;
  const totalAprendices = instructores.reduce((acc, curr) => acc + curr.totalAprendices, 0);
  const pendientesRevision = informes.filter(i => i.estado === 'pendiente').length;
  const informesValidados = informes.filter(i => i.estado === 'aprobado').length;
  const cumplimientoPorcentaje = totalInstructores > 0 
    ? Math.round((informesValidados / (totalInstructores * 2)) * 100) // GC + GF = 2 reports per instructor
    : 0;

  // Instructors without reports or with pending submissions (e.g., informesPendientes > 0)
  const instructoresSinInforme = instructores.filter(inst => inst.informesPendientes > 0);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Panel de Coordinación Académica</h2>
        <p className="text-sm text-gray-500">Centro de Servicios y Gestión Empresarial | Período de control activo</p>
      </div>

      {/* Active Period / Periodo de Carga */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Período de carga activo</span>
            <span className="bg-sena-green-light text-sena-green text-xs font-bold px-2.5 py-1 rounded-full">Habilitado</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Julio 2026</h3>
          <p className="text-xs text-red-500 font-medium">Fecha límite de presentación: 05 de Agosto de 2026, 23:59</p>
          <p className="text-xs text-gray-400 max-w-xl">
            Recuerde que los instructores deben estructurar sus carpetas con los archivos debidamente firmados y cargados al repositorio Drive asignado.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a 
            href="#format-gc"
            onClick={(e) => { e.preventDefault(); toast.info('Descargando formato GTH-F-062 GC...'); }}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <FiFileText className="w-4 h-4" /> GTH-F-062 GC (Contractual)
          </a>
          <a 
            href="#format-gf"
            onClick={(e) => { e.preventDefault(); toast.info('Descargando formato GF...'); }}
            className="px-4 py-2.5 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <FiFileText className="w-4 h-4" /> Formato GF (Financiero)
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase">Total Instructores</span>
            <span className="text-3xl font-bold text-gray-800">{totalInstructores}</span>
            <span className="text-xs text-gray-400 block mt-0.5">{totalAprendices} aprendices activos</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <FiFileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase">Pendientes Revisión</span>
            <span className="text-3xl font-bold text-gray-800">{pendientesRevision}</span>
            <span className="text-xs text-amber-500 font-semibold block mt-0.5">Informes recibidos</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-sena-green">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase">Informes Validados</span>
            <span className="text-3xl font-bold text-gray-800">{informesValidados}</span>
            <span className="text-xs text-sena-green font-semibold block mt-0.5">Firma avalada</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
            <FiActivity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase">% Cumplimiento</span>
            <span className="text-3xl font-bold text-gray-800">{cumplimientoPorcentaje}%</span>
            <span className="text-xs text-gray-400 block mt-0.5">De informes aprobados</span>
          </div>
        </div>

      </div>

      {/* Alert Section: Instructores sin Informe */}
      <div className="bg-red-50/70 border border-red-100 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-red-700">
            <FiAlertTriangle className="w-5 h-5" />
            <h4 className="font-bold text-base">Alerta de Cumplimiento: Instructores sin Informe</h4>
          </div>
          <span className="bg-red-100 text-red-800 text-xs font-extrabold px-3 py-1 rounded-full">
            {instructoresSinInforme.length} Pendiente(s) Crítico(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {instructoresSinInforme.map((inst) => (
            <div 
              key={inst.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-red-50 flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-gray-800">{inst.nombre}</h5>
                    <p className="text-xs text-gray-500 font-medium">{inst.area}</p>
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {inst.informesPendientes} Pendiente(s)
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FiActivity className="w-3.5 h-3.5 text-gray-400" />
                    <span>{inst.fichas.length} Ficha(s) | {inst.totalAprendices} Aprendices</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FiFolder className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate max-w-[200px]" title={inst.carpetaRuta}>{inst.carpetaRuta}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-t border-gray-50 pt-3">
                <button
                  disabled={sendingReminder === inst.id}
                  onClick={() => handleSendReminder(inst.id, inst.nombre)}
                  className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-3.5 h-3.5" />
                  {sendingReminder === inst.id ? 'Enviando...' : 'Enviar recordatorio'}
                </button>
                <button 
                  onClick={() => toast.info(`Mostrando detalles de: ${inst.nombre}`)}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 hover:text-gray-900"
                >
                  Ver detalles <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
