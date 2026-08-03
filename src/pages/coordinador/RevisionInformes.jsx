import React, { useEffect, useState } from 'react';
import { informesService, verPdf } from '../../services/informesService';
import { instructoresService } from '../../services/instructoresService';
import { 
  FiFolder, 
  FiFilter, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiFileText,
  FiChevronRight,
  FiChevronDown,
  FiBookOpen,
  FiEye
} from 'react-icons/fi';
import { toast } from 'sonner';
import PageContainer from '../../components/PageContainer';

export default function RevisionInformes() {
  const [informes, setInformes] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Expanded folders state
  const [expandedInstructors, setExpandedInstructors] = useState({});
  const [expandedVersions, setExpandedVersions] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});

  // Modal / Detail state for review
  const [selectedInforme, setSelectedInforme] = useState(null);
  const [comentariosRevision, setComentariosRevision] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [infList, instList] = await Promise.all([
        informesService.getInformes(),
        instructoresService.getInstructores()
      ]);
      console.log('>>> [DEBUG-FRONTEND] Respuesta de getInformes():', infList);
      setInformes(infList);
      setInstructores(instList);
    } catch (err) {
      toast.error('Error al cargar informes para revisión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReviewModal = (informe) => {
    setSelectedInforme(informe);
    setComentariosRevision(informe.comentarios || '');
  };

  const handleUpdateStatus = async (nuevoEstado) => {
    if (!selectedInforme) return;
    setSavingStatus(true);
    try {
      await informesService.updateEstadoInforme(selectedInforme.id, nuevoEstado, comentariosRevision);
      toast.success(`Informe marcado como ${nuevoEstado.toUpperCase()}`);
      setSelectedInforme(null);
      await loadData();
    } catch (err) {
      toast.error('No se pudo actualizar el estado del informe');
    } finally {
      setSavingStatus(false);
    }
  };

  const toggleInstructor = (instName) => {
    setExpandedInstructors(prev => ({
      ...prev,
      [instName]: !prev[instName]
    }));
  };

  const toggleMonth = (instName, mesName) => {
    const key = `${instName}-${mesName}`;
    setExpandedMonths(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-12 h-12 border-4 border-sena-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Cargando modulo de revisión...</p>
      </div>
    );
  }

  // Metrics
  const totalInstructoresCount = instructores.length;
  const pendientesCount = informes.filter(i => i.estado?.toLowerCase() === 'pendiente').length;
  const validadosCount = informes.filter(i => i.estado?.toLowerCase() === 'validado' || i.estado?.toLowerCase() === 'aprobado').length;
  const rechazadosCount = informes.filter(i => i.estado?.toLowerCase() === 'devuelto' || i.estado?.toLowerCase() === 'rechazado').length;

  // Filtered reports
  const filteredInformes = informes.filter((inf) => {
    const statusLower = inf.estado?.toLowerCase() || '';
    const matchEstado = filtroEstado === 'todos' ? true : (
      (filtroEstado === 'pendiente' && statusLower === 'pendiente') ||
      (filtroEstado === 'aprobado' && (statusLower === 'validado' || statusLower === 'aprobado')) ||
      (filtroEstado === 'rechazado' && (statusLower === 'devuelto' || statusLower === 'rechazado'))
    );
    const matchTipo = filtroTipo === 'todos' ? true : inf.tipo === filtroTipo;
    return matchEstado && matchTipo;
  });

  // Hierarchical grouping: Instructor -> Month -> Files
  const agruparInformes = () => {
    const groups = {};

    filteredInformes.forEach(inf => {
      const instName = inf.instructorNombre || 'Instructor Desconocido';
      if (!groups[instName]) {
        groups[instName] = {
          name: instName,
          area: inf.area || 'Sin Área',
          months: {},
          metrics: { total: 0, pendiente: 0, validado: 0, devuelto: 0 }
        };
      }

      const mes = inf.mes || 'Sin Período';
      if (!groups[instName].months[mes]) {
        groups[instName].months[mes] = {
          name: mes,
          files: [],
          metrics: { total: 0, pendiente: 0, validado: 0, devuelto: 0 }
        };
      }

      groups[instName].months[mes].files.push(inf);

      const estado = inf.estado?.toLowerCase();
      const isVal = estado === 'validado' || estado === 'aprobado';
      const isDev = estado === 'devuelto' || estado === 'rechazado';
      const isPen = estado === 'pendiente';

      if (isVal) {
        groups[instName].months[mes].metrics.validado++;
        groups[instName].metrics.validado++;
      } else if (isDev) {
        groups[instName].months[mes].metrics.devuelto++;
        groups[instName].metrics.devuelto++;
      } else if (isPen) {
        groups[instName].months[mes].metrics.pendiente++;
        groups[instName].metrics.pendiente++;
      }
      groups[instName].months[mes].metrics.total++;
      groups[instName].metrics.total++;
    });

    return Object.values(groups);
  };

  const instructoresAgrupados = agruparInformes();

  return (
    <PageContainer>
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Revisión de Informes Mensuales</h2>
        <p className="text-sm text-gray-500">Valide las carpetas contractuales y financieras cargadas por los instructores contratistas</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Total Instructores</span>
            <span className="text-3xl font-extrabold text-gray-800 mt-1">{totalInstructoresCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <FiBookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Pendientes</span>
            <span className="text-3xl font-extrabold text-amber-500 mt-1">{pendientesCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <FiClock className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Validados</span>
            <span className="text-3xl font-extrabold text-sena-green mt-1">{validadosCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-sena-green">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Rechazados</span>
            <span className="text-3xl font-extrabold text-red-500 mt-1">{rechazadosCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <FiXCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 self-start sm:self-center">
          <FiFilter className="w-4 h-4 text-sena-green" />
          <span className="text-sm font-bold">Filtros de Búsqueda</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Filtrar por estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green focus:border-transparent transition-all"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendiente de revisión</option>
              <option value="aprobado">Validados / Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Filtrar por tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green focus:border-transparent transition-all"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="GC">Gestión Contractual (GC)</option>
              <option value="GF">Gestión Financiera (GF)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hierarchical Reports List */}
      <div className="space-y-4">
        {instructoresAgrupados.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium text-sm">No se encontraron informes para los filtros seleccionados.</p>
          </div>
        ) : (
          instructoresAgrupados.map((inst) => {
            const isInstExpanded = !!expandedInstructors[inst.name];
            return (
              <div key={inst.name} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                
                {/* LEVEL 1: Instructor Header */}
                <div 
                  onClick={() => toggleInstructor(inst.name)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${isInstExpanded ? 'bg-sena-green text-white' : 'bg-green-50 text-sena-green'}`}>
                      <FiFolder className={`w-6 h-6 ${isInstExpanded ? 'fill-current opacity-40' : 'fill-current opacity-20'}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{inst.name}</h3>
                      <p className="text-xs text-gray-500">Área: <span className="font-semibold text-gray-700">{inst.area}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-14 sm:ml-0">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                        {inst.metrics.total} informe(s)
                      </span>
                      {inst.metrics.pendiente > 0 && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                          {inst.metrics.pendiente} pendiente(s)
                        </span>
                      )}
                      {inst.metrics.validado > 0 && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {inst.metrics.validado} validado(s)
                        </span>
                      )}
                      {inst.metrics.devuelto > 0 && (
                        <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                          {inst.metrics.devuelto} devuelto(s)
                        </span>
                      )}
                    </div>
                    <div>
                      {isInstExpanded ? (
                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FiChevronRight className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>

                {/* LEVEL 2: Months Container */}
                {isInstExpanded && (
                  <div className="px-5 pb-5 pt-2 bg-gray-50/50 border-t border-gray-50 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    {Object.values(inst.months).map((month) => {
                      const monthKey = `${inst.name}-${month.name}`;
                      const isMonthExpanded = !!expandedMonths[monthKey];
                      return (
                        <div key={month.name} className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
                          
                          {/* Month Header */}
                          <div 
                            onClick={() => toggleMonth(inst.name, month.name)}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-gray-50/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${isMonthExpanded ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-500'}`}>
                                <FiFolder className="w-4 h-4 fill-current opacity-30" />
                              </div>
                              <span className="text-sm font-bold text-gray-800">{month.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 ml-10 sm:ml-0">
                              <div className="flex gap-1.5 flex-wrap">
                                {month.metrics.pendiente > 0 && (
                                  <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {month.metrics.pendiente} pend
                                  </span>
                                )}
                                {month.metrics.validado > 0 && (
                                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {month.metrics.validado} val
                                  </span>
                                )}
                                {month.metrics.devuelto > 0 && (
                                  <span className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {month.metrics.devuelto} dev
                                  </span>
                                )}
                              </div>
                              <div>
                                {isMonthExpanded ? (
                                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <FiChevronRight className="w-4 h-4 text-gray-300" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* LEVEL 3: Informes list */}
                          {isMonthExpanded && (
                            <div className="p-4 bg-gray-50/30 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-1 duration-150">
                              {month.files.map((inf) => {
                                const statusLower = inf.estado?.toLowerCase() || '';
                                const isAprob = statusLower === 'validado' || statusLower === 'aprobado';
                                const isRech = statusLower === 'devuelto' || statusLower === 'rechazado';
                                return (
                                  <div 
                                    key={inf.id}
                                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                  >
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                      <div className="flex items-center gap-2.5">
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                          isAprob ? 'bg-green-100 text-green-700' :
                                          isRech ? 'bg-red-100 text-red-700' :
                                          'bg-amber-100 text-amber-700'
                                        }`}>
                                          {inf.estado}
                                        </span>
                                        <h4 className="font-bold text-gray-800 text-sm">Informe {inf.tipo}</h4>
                                      </div>
                                      
                                      <div className="text-[11px] text-gray-500 space-y-0.5">
                                        <p className="truncate">Archivo: <span className="font-mono text-gray-700">{inf.archivoNombre}</span></p>
                                        <p>Fecha: <span className="text-gray-700 font-semibold">{inf.date}</span> · Tamaño: <span className="text-gray-650">{inf.size}</span></p>
                                      </div>

                                      {inf.comentarios && (
                                        <div className="bg-red-50/50 rounded-lg p-2 border border-red-100/50 text-[11px] text-red-800 mt-1 max-w-lg">
                                          <span className="font-bold block">Observación de revisión:</span>
                                          {inf.comentarios}
                                        </div>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                      {/* Ver PDF */}
                                      <button
                                        onClick={async () => {
                                          const toastId = toast.loading('Abriendo archivo PDF...');
                                          try {
                                            await verPdf(inf.id);
                                            toast.dismiss(toastId);
                                          } catch (err) {
                                            const status = err?.response?.status || 'sin status';
                                            const serverMsg = err?.response?.data?.message || err?.message || 'Error desconocido';
                                            toast.error(`No se pudo abrir el archivo. (HTTP ${status}: ${serverMsg})`, { id: toastId });
                                          }
                                        }}
                                        className="px-2.5 py-1.5 border border-sena-green text-sena-green hover:bg-sena-green/10 rounded-lg flex items-center gap-1 transition-all"
                                        title="Ver versión en navegador"
                                      >
                                        <FiEye className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Ver PDF</span>
                                      </button>
                                      {/* Evaluar (solo pendiente) */}
                                      {statusLower === 'pendiente' && (
                                        <button
                                          onClick={() => handleOpenReviewModal(inf)}
                                          className="px-3.5 py-1.5 bg-sena-green hover:bg-sena-green-hover text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                                        >
                                          Evaluar <FiChevronRight className="w-3 h-3" />
                                        </button>
                                      )}
                                      {/* Historial de versiones */}
                                      {inf.versiones && inf.versiones.length > 0 && (
                                        <div className="flex flex-col w-full mt-2">
                                          <button
                                            onClick={() => {
                                              setExpandedVersions(prev => ({
                                                ...prev,
                                                [inf.id]: !prev[inf.id]
                                              }));
                                            }}
                                            className="flex items-center text-sm text-sena-green font-medium"
                                          >
                                            Historial de Versiones ({inf.versiones.length})
                                            {expandedVersions[inf.id] ? (
                                              <FiChevronDown className="w-4 h-4 ml-1" />
                                            ) : (
                                              <FiChevronRight className="w-4 h-4 ml-1" />
                                            )}
                                          </button>
                                          {expandedVersions[inf.id] && (
                                            <div className="mt-2 space-y-2">
                                              {inf.versiones.map((ver) => {
                                                const verStatus = ver.estado?.toLowerCase() || '';
                                                const isAprob = verStatus === 'validado' || verStatus === 'aprobado';
                                                const isRech = verStatus === 'devuelto' || verStatus === 'rechazado';
                                                return (
                                                  <div key={ver.id} className="bg-gray-50 border border-gray-100 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                                        isAprob ? 'bg-green-100 text-green-700' :
                                                        isRech ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                      }`}>V{ver.numero_version}</span>
                                                      <span className="font-medium text-gray-800">{ver.archivoNombre}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                      {ver.fecha}
                                                    </div>
                                                    {ver.comentarios && (
                                                      <div className="text-xs text-gray-600 mt-1 max-w-lg">
                                                        <span className="font-bold">Observación:</span> {ver.comentarios}
                                                      </div>
                                                    )}
                                                    <button
                                                      onClick={async () => {
                                                        const toastId = toast.loading('Abriendo PDF versión...');
                                                        try {
                                                          await verPdf(ver.id);
                                                          toast.dismiss(toastId);
                                                        } catch (err) {
                                                          const status = err?.response?.status || 'sin status';
                                                          const serverMsg = err?.response?.data?.message || err?.message || 'Error desconocido';
                                                          toast.error(`No se pudo abrir el archivo. (HTTP ${status}: ${serverMsg})`, { id: toastId });
                                                        }
                                                      }}
                                                      className="px-2.5 py-1 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded text-[10px]"
                                                    >
                                                      Ver PDF
                                                    </button>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal Dialog */}
      {selectedInforme && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Evaluación de Informe</h3>
              <p className="text-xs text-gray-500">Instructor: {selectedInforme.instructorNombre} | Tipo: <span className="font-bold text-sena-green uppercase">{selectedInforme.tipo}</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase block">Retroalimentación / Comentarios</label>
              <textarea
                value={comentariosRevision}
                onChange={(e) => setComentariosRevision(e.target.value)}
                placeholder="Escriba los comentarios o detalles del rechazo/aprobación..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                disabled={savingStatus}
                onClick={() => setSelectedInforme(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                disabled={savingStatus}
                onClick={() => handleUpdateStatus('rechazado')}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
              >
                <FiXCircle className="w-4 h-4" /> Rechazar / Observación
              </button>
              <button
                disabled={savingStatus}
                onClick={() => handleUpdateStatus('aprobado')}
                className="px-4 py-2 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm"
              >
                <FiCheckCircle className="w-4 h-4" /> Validar y Firmar
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
