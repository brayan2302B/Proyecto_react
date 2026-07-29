import React, { useEffect, useState } from 'react';
import { informesService } from '../../services/informesService';
import { instructoresService } from '../../services/instructoresService';
import { 
  FiFolder, 
  FiFilter, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiFileText,
  FiChevronRight,
  FiBookOpen
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

      {/* Reports List */}
      <div className="space-y-4">
        {filteredInformes.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium text-sm">No se encontraron informes para el filtro seleccionado.</p>
          </div>
        ) : (
          filteredInformes.map((inf) => {
            const statusLower = inf.estado?.toLowerCase() || '';
            const isPend = statusLower === 'pendiente';
            const isAprob = statusLower === 'validado' || statusLower === 'aprobado';
            const isRech = statusLower === 'devuelto' || statusLower === 'rechazado';

            return (
              <div 
                key={inf.id}
                className="bg-sena-green-light border border-green-100/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-800 text-base">{inf.instructorNombre}</h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      isAprob ? 'bg-green-100 text-green-700' :
                      isRech ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {inf.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
                    <p className="text-xs text-gray-500 font-medium">
                      Área: <span className="text-gray-700 font-semibold">{inf.area}</span>
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Mes: <span className="text-gray-700 font-semibold">{inf.mes}</span>
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Tipo: <span className="text-sena-green font-bold uppercase">{inf.tipo}</span>
                    </p>
                    <p className="text-xs text-gray-400 col-span-full mt-1 font-mono text-[10px]">
                      Archivo: {inf.archivoNombre}
                    </p>
                  </div>

                  {inf.comentarios && (
                    <div className="bg-white/80 rounded-lg p-2.5 border border-green-100 text-xs text-gray-600 mt-2">
                      <span className="font-bold text-gray-700 block">Comentarios de revisión:</span>
                      {inf.comentarios}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => {
                      if (inf.carpetaUrl) {
                        window.open(inf.carpetaUrl, '_blank');
                      } else {
                        toast.warn(`Este instructor aún no tiene carpeta de Drive asignada. Asígnela desde la gestión de usuarios.`);
                      }
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 border border-gray-100 hover:-translate-y-0.5"
                  >
                    <FiFolder className="w-4 h-4 text-amber-500" /> Abrir carpeta
                  </button>
                  <button
                    onClick={() => handleOpenReviewModal(inf)}
                    className="px-4 py-2 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Evaluar <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
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
