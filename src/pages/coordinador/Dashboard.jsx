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
import PeriodoCard from '../../components/PeriodoCard';
import StatCard from '../../components/StatCard';
import PageContainer from '../../components/PageContainer';

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
    <PageContainer>
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Panel de Coordinación Académica</h2>
        <p className="text-sm text-gray-500">Centro de Servicios y Gestión Empresarial | Período de control activo</p>
      </div>

      {/* Active Period / Periodo de Carga */}
      <PeriodoCard isEditable={true} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <StatCard
          icon={FiUsers}
          title="Total Instructores"
          value={totalInstructores}
          subtext={`${totalAprendices} aprendices activos`}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
        />

        {/* Metric 2 */}
        <StatCard
          icon={FiFileText}
          title="Pendientes Revisión"
          value={pendientesRevision}
          subtext="Informes recibidos"
          subtextClass="text-amber-500 font-semibold"
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
        />

        {/* Metric 3 */}
        <StatCard
          icon={FiCheckCircle}
          title="Informes Validados"
          value={informesValidados}
          subtext="Firma avalada"
          subtextClass="text-sena-green font-semibold"
          iconBgClass="bg-green-50"
          iconColorClass="text-[#407754]"
        />

        {/* Metric 4 */}
        <StatCard
          icon={FiActivity}
          title="% Cumplimiento"
          value={`${cumplimientoPorcentaje}%`}
          subtext="De informes aprobados"
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-500"
        />

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

    </PageContainer>
  );
}
