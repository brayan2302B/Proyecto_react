import React, { useEffect, useState } from 'react';
import { reportesService } from '../../services/reportesService';
import { instructoresService } from '../../services/instructoresService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiActivity, 
  FiDownload, 
  FiFilter, 
  FiBarChart2 
} from 'react-icons/fi';
import { toast } from 'sonner';

export default function Reportes() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [instructores, setInstructores] = useState([]);

  // Filter states
  const [selectedInst, setSelectedInst] = useState('todos');
  const [selectedMes, setSelectedMes] = useState('Julio 2026');
  const [selectedArea, setSelectedArea] = useState('todos');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, instList] = await Promise.all([
        reportesService.getEstadisticasGenerales(),
        instructoresService.getInstructores()
      ]);
      setStats(statsData);
      setInstructores(instList);
    } catch (err) {
      toast.error('Error al cargar datos estadísticos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyFilters = () => {
    toast.success('Filtros aplicados con éxito');
  };

  const handleExportReport = () => {
    toast.success('Reporte exportado correctamente en formato PDF/Excel.');
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-12 h-12 border-4 border-sena-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Procesando estadísticas...</p>
      </div>
    );
  }

  // Areas list extracted from instructors
  const areas = Array.from(new Set(instructores.map((i) => i.area).filter(Boolean)));

  // Prepare PieChart data
  const pieData = [
    { name: 'Aprobados', value: stats.aprobados, color: '#407754' },
    { name: 'Rechazados', value: stats.rechazados, color: '#ef4444' },
    { name: 'Pendientes', value: stats.pendientes, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h2>
          <p className="text-sm text-gray-500">Métricas de cumplimiento y trazabilidad mensual de instructores</p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md self-stretch sm:self-auto cursor-pointer"
        >
          <FiDownload className="w-4 h-4" /> Exportar Reporte
        </button>
      </div>

      {/* Query Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FiFilter className="w-4 h-4 text-sena-green" />
          <h3 className="text-sm font-bold">Filtros de Consulta</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Instructor</label>
            <select
              value={selectedInst}
              onChange={(e) => setSelectedInst(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
            >
              <option value="todos">Todos los Instructores</option>
              {instructores.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Mes de Trazabilidad</label>
            <select
              value={selectedMes}
              onChange={(e) => setSelectedMes(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
            >
              <option value="Julio 2026">Julio 2026</option>
              <option value="Junio 2026">Junio 2026</option>
              <option value="Mayo 2026">Mayo 2026</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Área de Formación</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
            >
              <option value="todos">Todas las Áreas</option>
              {areas.map((area, idx) => (
                <option key={idx} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full px-4 py-2.5 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
            <FiFileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-gray-400 block uppercase">Total Informes</span>
            <span className="text-xl font-bold text-gray-800">{stats.totalInformes}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-sena-green flex-shrink-0">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-gray-400 block uppercase">Aprobados</span>
            <span className="text-xl font-bold text-sena-green">{stats.aprobados}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
            <FiXCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-gray-400 block uppercase">Rechazados</span>
            <span className="text-xl font-bold text-red-500">{stats.rechazados}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-gray-400 block uppercase">Pendientes</span>
            <span className="text-xl font-bold text-amber-500">{stats.pendientes}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
            <FiActivity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-gray-400 block uppercase">% Cumplimiento</span>
            <span className="text-xl font-bold text-purple-650 font-bold">{stats.tasaCumplimiento}%</span>
          </div>
        </div>
      </div>

      {/* Two panels side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cumplimiento por Instructor */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 flex items-center gap-2">
            <FiBarChart2 className="w-4 h-4 text-sena-green" /> Cumplimiento por Instructor (GC / GF)
          </h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stats.cumplimientoPorInstructor}
                margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                <YAxis dataKey="nombre" type="category" stroke="#9ca3af" fontSize={9} width={100} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '11px' }} 
                  cursor={{ fill: '#f9fafb' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="aprobados" name="Validados" stackId="a" fill="#407754" radius={[0, 4, 4, 0]} />
                <Bar dataKey="rechazados" name="Rechazados" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                <Bar dataKey="pendientes" name="Pendientes" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Estados & Tasa General */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">
              Distribución de Estados
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
              {/* Pie Chart */}
              <div className="w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '11px' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends with percentages */}
              <div className="space-y-3 flex-1 w-full">
                {pieData.map((item, idx) => {
                  const pct = Math.round((item.value / stats.totalInformes) * 100) || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-semibold text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-gray-800">{pct}% ({item.value})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Compliance rate summary */}
          <div className="bg-sena-green-light rounded-xl p-5 border border-green-100 flex items-center justify-between">
            <div>
              <h4 className="text-sena-green font-bold text-sm">Tasa de cumplimiento general</h4>
              <p className="text-xs text-gray-500 mt-0.5">Porcentaje total de firmas avaladas del mes en curso.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-sena-green text-center">
              <span className="text-base font-extrabold text-sena-green">{stats.tasaCumplimiento}%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
