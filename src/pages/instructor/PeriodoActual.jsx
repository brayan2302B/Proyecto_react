import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiUploadCloud, 
  FiFileText, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiChevronDown, 
  FiChevronRight, 
  FiCornerDownRight,
  FiRotateCcw,
  FiCheckSquare,
  FiInfo,
  FiX,
  FiArrowLeft
} from 'react-icons/fi';
import { getInformes, addVersion, updateEstadoInforme } from '../../services/informesService';
import { toast } from 'sonner';

export default function PeriodoActual() {
  const [informesState, setInformesState] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = React.useRef(null);
  
  // Modal state
  const [selectedPeriod, setSelectedPeriod] = useState('Julio 2026');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();

  // Load initial reports state
  useEffect(() => {
    getInformes().then(data => setInformesState(data));
  }, []);

  useEffect(() => {
    if (location.state?.openModal && location.state?.reportType) {
      setSelectedType(location.state.reportType);
      setSelectedPeriod('Julio 2026'); 
      setStep(3); // Jump to upload step since period and type are predefined
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [expandedVersions, setExpandedVersions] = useState({ GC: true, GF: true });

  const resetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelectedType('');
      setSelectedFile(null);
      setIsUploading(false);
    }, 300);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo excede el límite de 10 MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo excede el límite de 10 MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Pass the actual File object instead of only its name
      await addVersion('Julio 2026', selectedType, 'inst-1', selectedFile);

      // Refresh local state from the service (single source of truth)
      const updated = await getInformes();
      setInformesState(updated);
      setStep(4); // Success step
    } catch (err) {
      console.error('Error al subir informe:', err);
      toast.error('Ocurrió un error al subir el informe. Intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = () => {
    setSelectedType('');
    setSelectedPeriod('Julio 2026');
    setStep(2); // Jump to choosing type
    setIsModalOpen(true);
  };

  const toggleVersions = (type) => {
    setExpandedVersions(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getJulioReport = (type) => {
    return informesState.find(inf => inf.periodo === "Julio 2026" && inf.tipo === type);
  };

  const handleSimulateAction = async (type, action, comment = "") => {
    try {
      // Find the informe id to pass to updateEstadoInforme
      const informe = informesState.find(
        inf => inf.periodo === 'Julio 2026' && inf.tipo === type
      );
      if (!informe) return;

      await updateEstadoInforme(informe.id, action, comment);

      // Refresh local state from the service
      const updated = await getInformes();
      setInformesState(updated);
    } catch (err) {
      console.error('Error al simular acción:', err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Período Actual</h1>
          <p className="text-gray-500 mt-1 font-medium">Carga y control de versiones para el período vigente</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={openModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#407754] hover:bg-[#346244] text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
          >
            <FiUploadCloud className="w-5 h-5" /> Cargar Informe
          </button>
        </div>
      </div>

      {/* Main Period section card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <span className="bg-green-100 text-[#407754] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Período Activo</span>
            <h2 className="text-xl font-black text-gray-900 mt-1.5 font-sans">Informe del Período — Julio 2026</h2>
          </div>
          <div className="text-xs text-gray-400 font-mono">STIMI Versioning Engine</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['GC', 'GF'].map(type => {
            const report = getJulioReport(type);
            const versions = report ? report.versiones : [];
            const hasVersions = versions.length > 0;
            const lastVersion = hasVersions ? versions[versions.length - 1] : null;
            const currentStatus = lastVersion ? lastVersion.estado : 'No cargado';

            return (
              <div key={type} className="border border-gray-100 bg-gray-50/30 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${type === 'GC' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <FiFileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base">Informe {type}</h3>
                        <p className="text-xs text-gray-500">{type === 'GC' ? 'Gestión Contractual' : 'Gestión Financiera'}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      currentStatus === 'Validado' ? 'bg-emerald-100 text-emerald-800' :
                      currentStatus === 'Devuelto' ? 'bg-red-100 text-red-800 animate-pulse' :
                      currentStatus === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {currentStatus}
                    </span>
                  </div>

                  {/* Devuelto Reason (if rejected) */}
                  {currentStatus === 'Devuelto' && lastVersion?.observacion && (
                    <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5">
                      <FiAlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-red-950">Observación de Devolución:</h4>
                        <p className="text-xs text-red-800 mt-0.5 leading-relaxed font-medium">{lastVersion.observacion}</p>
                      </div>
                    </div>
                  )}

                  {/* Versions History */}
                  <div className="mt-2 mb-4 bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
                    <button 
                      onClick={() => toggleVersions(type)}
                      className="w-full flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-800"
                    >
                      <span>Historial de Versiones ({versions.length})</span>
                      {expandedVersions[type] ? <FiChevronDown /> : <FiChevronRight />}
                    </button>

                    {expandedVersions[type] && (
                      <div className="mt-3.5 space-y-3 border-t border-gray-50 pt-3">
                        {hasVersions ? (
                          versions.map((ver, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <FiCornerDownRight className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-gray-700">V{ver.version} — {ver.archivo}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    ver.estado === 'Validado' ? 'bg-emerald-50 text-emerald-700' :
                                    ver.estado === 'Devuelto' ? 'bg-red-50 text-red-700' :
                                    'bg-amber-50 text-amber-700'
                                  }`}>{ver.estado}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                                  <span>{ver.fecha}</span>
                                  {ver.observacion && <span className="text-red-500 font-medium">Motivo: {ver.observacion}</span>}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-2 text-gray-400 text-xs font-medium">Sin versiones cargadas</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex gap-2">
                    {/* Main action button depending on status */}
                    {currentStatus === 'No cargado' && (
                      <button 
                        onClick={() => {
                          setSelectedType(type);
                          setStep(3);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 py-2 bg-[#407754] hover:bg-[#346244] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FiUploadCloud className="w-4 h-4" /> Cargar informe
                      </button>
                    )}
                    {currentStatus === 'Devuelto' && (
                      <button 
                        onClick={() => {
                          setSelectedType(type);
                          setStep(3);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FiUploadCloud className="w-4 h-4" /> Subir corrección (Nueva Versión)
                      </button>
                    )}
                    {currentStatus === 'Pendiente' && (
                      <div className="flex-1 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl text-center">
                        En revisión por coordinación
                      </div>
                    )}
                    {currentStatus === 'Validado' && (
                      <div className="flex-1 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600" /> Aprobado / Validado
                      </div>
                    )}
                  </div>

                  {/* Simulation controller (for demonstration/testing) */}
                  {currentStatus === 'Pendiente' && (
                    <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-2 flex items-center justify-between text-[10px] text-gray-500">
                      <span className="font-semibold">Simular Coord:</span>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleSimulateAction(type, 'Devuelto', 'Falta firma digital en la página 2')}
                          className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 font-bold flex items-center gap-0.5"
                        >
                          <FiRotateCcw className="w-2.5 h-2.5" /> Devolver
                        </button>
                        <button 
                          onClick={() => handleSimulateAction(type, 'Validado')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-100 font-bold flex items-center gap-0.5"
                        >
                          <FiCheckSquare className="w-2.5 h-2.5" /> Aprobar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
        <FiInfo className="w-6 h-6 text-blue-500 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Carga de Versiones del Mes</h4>
          <p className="text-sm text-blue-800 leading-relaxed max-w-3xl">
            Solo puedes subir informes correspondientes al período vigente. Si el informe ha sido validado con éxito, la carga para ese módulo quedará bloqueada. Visita el historial para ver entregas de meses anteriores.
          </p>
        </div>
      </div>

      {/* Upload Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">
                {step === 4 ? 'Carga Exitosa' : 'Cargar Nuevo Informe'}
              </h2>
              {step !== 4 && (
                <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Progress dots */}
              {step < 4 && (
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#407754]' : i < step ? 'w-4 bg-green-200' : 'w-4 bg-gray-200'}`} />
                  ))}
                </div>
              )}

              {/* Step 1: Period Selection (Static for PeriodoActual) */}
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Paso 1 de 3 — Selección de período</label>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#407754] focus:border-transparent bg-white shadow-sm appearance-none"
                    >
                      <option value="Julio 2026">Julio 2026 (Mes Actual)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button onClick={resetModal} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                    <button 
                      onClick={() => setStep(2)}
                      className="px-6 py-2 bg-[#407754] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#346244] transition-all"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Type Selection */}
              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Paso 2 de 3 — Tipo de informe</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedType('GC')}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selectedType === 'GC' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <FiFileText className={`w-6 h-6 mb-2 ${selectedType === 'GC' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <h4 className={`text-sm font-bold ${selectedType === 'GC' ? 'text-blue-900' : 'text-gray-900'}`}>Informe GC</h4>
                      <p className={`text-xs mt-1 ${selectedType === 'GC' ? 'text-blue-700' : 'text-gray-500'}`}>Gestión Contractual</p>
                    </button>
                    
                    <button
                      onClick={() => setSelectedType('GF')}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selectedType === 'GF' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <FiFileText className={`w-6 h-6 mb-2 ${selectedType === 'GF' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <h4 className={`text-sm font-bold ${selectedType === 'GF' ? 'text-emerald-900' : 'text-gray-900'}`}>Informe GF</h4>
                      <p className={`text-xs mt-1 ${selectedType === 'GF' ? 'text-emerald-700' : 'text-gray-500'}`}>Gestión Financiera</p>
                    </button>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1">
                      <FiArrowLeft className="w-4 h-4" /> Atrás
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!selectedType}
                      className="px-6 py-2 bg-[#407754] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#346244] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: File Upload */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 fade-in">
                  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
                    <div className="text-sm">
                      <span className="text-gray-500">Período:</span> <strong className="text-gray-900">Julio 2026</strong>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-500">Tipo:</span> <strong className="text-gray-900">Informe {selectedType}</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Paso 3 de 3 — Adjuntar archivo</label>
                    <p className="text-xs text-gray-500 mb-3">
                      Formato {selectedType === 'GC' ? 'GTH-F-062 V10 — Gestión Contractual' : 'Gestión Financiera (Soporte)'}
                    </p>
                    
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                    />

                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer group ${
                        selectedFile ? 'border-[#407754] bg-green-50/30' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {selectedFile ? (
                        <div className="flex flex-col items-center justify-center animate-in zoom-in-95">
                          <div className="bg-[#407754] w-12 h-12 rounded-full flex items-center justify-center mb-3">
                            <FiCheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-full px-4">{selectedFile.name}</p>
                          <p className="text-xs text-[#407754] mt-1 font-semibold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                            className="mt-3 text-xs text-gray-500 hover:text-red-500 transition-colors font-medium hover:underline"
                          >
                            Quitar y seleccionar otro
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FiUploadCloud className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="text-sm font-bold text-gray-900">Arrastra tu archivo aquí o haz clic para seleccionarlo</p>
                          <p className="text-xs text-gray-500 mt-1">Solo archivos PDF · Máximo 10 MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(2)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1" disabled={isUploading}>
                      <FiArrowLeft className="w-4 h-4" /> Atrás
                    </button>
                    <button 
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile}
                      className="px-6 py-2 bg-[#407754] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#346244] disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Subiendo...
                        </>
                      ) : (
                        'Subir archivo'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center py-6 animate-in zoom-in-95 fade-in">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">¡Archivo cargado exitosamente!</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    El informe <strong>{selectedType}</strong> se ha guardado como <span className="font-semibold text-amber-600">Borrador</span> en el período de <strong>Julio 2026</strong>.
                  </p>
                  
                  <button 
                    onClick={resetModal}
                    className="mt-8 w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Listo
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
