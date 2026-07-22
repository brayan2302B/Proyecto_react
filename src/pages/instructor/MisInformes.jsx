import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiFolder, 
  FiChevronRight, 
  FiChevronDown, 
  FiUploadCloud, 
  FiX, 
  FiCheckCircle, 
  FiFileText, 
  FiInfo, 
  FiArrowLeft, 
  FiEye, 
  FiAlertCircle
} from 'react-icons/fi';
import { mockInformes, addVersion } from '../../services/informesService';

export default function MisInformes() {
  const [informesState, setInformesState] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  
  // Modal state
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();

  // Load initial reports state
  useEffect(() => {
    setInformesState([...mockInformes]);
  }, []);

  useEffect(() => {
    if (location.state?.openModal && location.state?.reportType) {
      setSelectedType(location.state.reportType);
      setSelectedPeriod('Julio 2026'); 
      setStep(3); // Jump to upload step
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Mock data for static folders (Junio and Mayo)
  const [folders, setFolders] = useState([
    { 
      id: 2, 
      month: 'Junio', 
      year: '2026', 
      files: [
        { type: 'GC', name: 'gc_junio_firmado.pdf', size: '1.2 MB', date: '30/06/2026, 05:30 PM', status: 'Validado' },
        { type: 'GF', name: 'gf_junio_soportes.pdf', size: '3.4 MB', date: '30/06/2026, 05:45 PM', status: 'Validado' }
      ], 
      pending: 0, 
      validated: 2 
    },
    { 
      id: 3, 
      month: 'Mayo', 
      year: '2026', 
      files: [
        { type: 'GC', name: 'gc_mayo_firmado.pdf', size: '1.1 MB', date: '31/05/2026, 04:20 PM', status: 'Validado' },
        { type: 'GF', name: 'gf_mayo_soportes.pdf', size: '2.8 MB', date: '31/05/2026, 04:30 PM', status: 'Validado' }
      ], 
      pending: 0, 
      validated: 2 
    },
  ]);

  const [expandedFolderId, setExpandedFolderId] = useState(null);

  const resetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelectedPeriod('');
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

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      
      const sizeStr = (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB';
      
      // Add version to service
      addVersion(selectedPeriod, selectedType, selectedFile.name, sizeStr);
      
      // Sync local state
      setInformesState([...mockInformes]);
      setStep(4); // Success step
    }, 1500);
  };

  const openModal = () => {
    setSelectedType('');
    setSelectedPeriod('');
    setStep(1);
    setIsModalOpen(true);
  };

  const toggleFolder = (id) => {
    setExpandedFolderId(prev => prev === id ? null : id);
  };

  const getJulioReport = (type) => {
    return informesState.find(inf => inf.periodo === "Julio 2026" && inf.tipo === type);
  };

  const julioReportGC = getJulioReport('GC');
  const julioReportGF = getJulioReport('GF');

  const getJulioStatusCount = () => {
    let pending = 0;
    let validated = 0;
    
    if (julioReportGC && julioReportGC.versiones.length > 0) {
      const last = julioReportGC.versiones[julioReportGC.versiones.length - 1];
      if (last.estado === 'Validado') validated++;
      else pending++;
    } else {
      pending++;
    }

    if (julioReportGF && julioReportGF.versiones.length > 0) {
      const last = julioReportGF.versiones[julioReportGF.versiones.length - 1];
      if (last.estado === 'Validado') validated++;
      else pending++;
    } else {
      pending++;
    }

    return { pending, validated };
  };

  const julioCounts = getJulioStatusCount();

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Historial de Informes</h1>
          <p className="text-gray-500 mt-1 font-medium">Historial y Archivo de Períodos pasados y vigentes</p>
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

      {/* Folders List */}
      <div className="space-y-4">
        
        {/* Dynamic Folder for Julio 2026 */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div 
            onClick={() => toggleFolder(1)}
            className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-colors ${expandedFolderId === 1 ? 'bg-[#407754] text-white' : 'bg-gray-50 text-gray-400 group-hover:text-[#407754] group-hover:bg-green-50'}`}>
                <FiFolder className={`w-8 h-8 ${expandedFolderId === 1 ? 'fill-current opacity-40' : 'fill-current opacity-20'}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Julio 2026</h3>
                <p className="text-sm text-gray-500">
                  {((julioReportGC?.versiones.length > 0 ? 1 : 0) + (julioReportGF?.versiones.length > 0 ? 1 : 0))} archivo(s) adjunto(s) en este período
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-14 sm:ml-0">
              <div className="flex gap-2">
                {julioCounts.pending > 0 && (
                  <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                    {julioCounts.pending} pendiente(s)
                  </span>
                )}
                {julioCounts.validated > 0 && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                    {julioCounts.validated} validado(s)
                  </span>
                )}
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                {expandedFolderId === 1 ? (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-all" />
                )}
              </div>
            </div>
          </div>

          {/* Folder Details (Julio 2026) */}
          {expandedFolderId === 1 && (
            <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="mt-2 space-y-3">
                {['GC', 'GF'].map(type => {
                  const rep = getJulioReport(type);
                  const lastFile = rep && rep.versiones.length > 0 ? rep.versiones[rep.versiones.length - 1] : null;
                  
                  if (lastFile) {
                    return (
                      <div key={type} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${type === 'GC' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <FiFileText className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-gray-900">Informe {type} (V{lastFile.version})</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                lastFile.estado === 'Validado' ? 'bg-emerald-100 text-emerald-800' :
                                lastFile.estado === 'Devuelto' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>{lastFile.estado}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px] sm:max-w-xs">{lastFile.archivo}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-6 ml-14 sm:ml-0">
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-700">{lastFile.fecha}</p>
                            <p className="text-xs text-gray-400">{lastFile.size || "1.5 MB"}</p>
                          </div>
                          <button className="text-gray-400 hover:text-[#407754] hover:bg-green-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold" title="Ver archivo">
                            <FiEye className="w-5 h-5" />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={type} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 opacity-75">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-gray-200 text-gray-400">
                            <FiAlertCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-600">Informe {type}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">No cargado</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPeriod('Julio 2026');
                            setSelectedType(type);
                            setStep(3);
                            setIsModalOpen(true);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FiUploadCloud className="w-4 h-4" /> Subir ahora
                        </button>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* Existing Static Folders */}
        {folders.map(folder => (
          <div key={folder.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
            {/* Folder Header (Clickable) */}
            <div 
              onClick={() => toggleFolder(folder.id)}
              className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${expandedFolderId === folder.id ? 'bg-[#407754] text-white' : 'bg-gray-50 text-gray-400 group-hover:text-[#407754] group-hover:bg-green-50'}`}>
                  <FiFolder className={`w-8 h-8 ${expandedFolderId === folder.id ? 'fill-current opacity-40' : 'fill-current opacity-20'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{folder.month} {folder.year}</h3>
                  <p className="text-sm text-gray-500">{folder.files.length} archivo(s) adjunto(s) en este período</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 ml-14 sm:ml-0">
                <div className="flex gap-2">
                  {folder.pending > 0 && (
                    <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                      {folder.pending} pendiente(s)
                    </span>
                  )}
                  {folder.validated > 0 && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                      {folder.validated} validado(s)
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  {expandedFolderId === folder.id ? (
                    <FiChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <FiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-all" />
                  )}
                </div>
              </div>
            </div>

            {/* Folder Details (Expanded) */}
            {expandedFolderId === folder.id && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="mt-2 space-y-3">
                  {['GC', 'GF'].map(type => {
                    const file = folder.files.find(f => f.type === type);
                    
                    if (file) {
                      return (
                        <div key={type} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${type === 'GC' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              <FiFileText className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-gray-900">Informe {type}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  file.status === 'Validado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {file.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-6 ml-14 sm:ml-0">
                            <div className="text-right">
                              <p className="text-xs font-semibold text-gray-700">{file.date}</p>
                              <p className="text-xs text-gray-400">{file.size}</p>
                            </div>
                            <button className="text-gray-400 hover:text-[#407754] hover:bg-green-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold" title="Ver archivo">
                              <FiEye className="w-5 h-5" />
                              <span className="hidden sm:inline">Ver</span>
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={type} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 opacity-75">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-gray-200 text-gray-400">
                              <FiAlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-600">Informe {type}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">No cargado</p>
                            </div>
                          </div>
                          <button 
                            disabled
                            className="text-sm font-semibold text-gray-400 cursor-not-allowed flex items-center gap-1"
                          >
                            <FiUploadCloud className="w-4 h-4" /> Histórico
                          </button>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
        <FiInfo className="w-6 h-6 text-blue-500 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Historial de Períodos</h4>
          <p className="text-sm text-blue-800 leading-relaxed max-w-3xl">
            En esta sección puedes consultar el archivo histórico de todos tus informes entregados y validados. Para ver o actualizar las entregas del mes vigente, dirígete a la sección **Período Actual** en el menú.
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

              {/* Step 1: Period Selection */}
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Paso 1 de 3 — Selección de período</label>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#407754] focus:border-transparent bg-white shadow-sm appearance-none"
                    >
                      <option value="" disabled>Elige un período...</option>
                      <option value="Julio 2026">Julio 2026</option>
                      <option value="Junio 2026">Junio 2026</option>
                      <option value="Mayo 2026">Mayo 2026</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button onClick={resetModal} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!selectedPeriod}
                      className="px-6 py-2 bg-[#407754] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#346244] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                      <span className="text-gray-500">Período:</span> <strong className="text-gray-900">{selectedPeriod}</strong>
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
                    El informe <strong>{selectedType}</strong> se ha guardado como <span className="font-semibold text-amber-600">Borrador</span> en el período de <strong>{selectedPeriod}</strong>.
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
