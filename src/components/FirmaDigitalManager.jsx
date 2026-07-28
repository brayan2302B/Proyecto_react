import React, { useState, useRef, useEffect } from 'react';
import { FiKey, FiInfo, FiUploadCloud, FiEdit2, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';

export default function FirmaDigitalManager({ defaultName = '', defaultRole = '', onFirmaSave }) {
  const [nombre, setNombre] = useState(defaultName);
  const [cargo, setCargo] = useState(defaultRole);
  const [modo, setModo] = useState('dibujar'); // 'dibujar' | 'subir'
  
  // Drawing state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Upload state
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Final saved state (local to component, passed up via onFirmaSave)
  const [isSaved, setIsSaved] = useState(false);

  // --- Canvas Logic ---
  useEffect(() => {
    if (modo === 'dibujar' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set background to white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
    }
  }, [modo]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsSaved(false); // Any new edit invalidates saved state
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      setHasDrawn(false);
      setIsSaved(false);
      onFirmaSave && onFirmaSave(null);
    }
  };

  // --- File Upload Logic ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.error('Solo se admiten imágenes PNG o JPG');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no debe pesar más de 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = () => {
    setUploadedImage(null);
    setIsSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFirmaSave && onFirmaSave(null);
  };

  // --- Save Logic ---
  const handleLocalSave = () => {
    if (!nombre.trim()) {
      toast.error('El Nombre completo es obligatorio');
      return;
    }

    let signatureData = null;

    if (modo === 'dibujar') {
      if (!hasDrawn) {
        toast.error('Por favor dibuja tu firma o cambia a "Subir imagen"');
        return;
      }
      signatureData = canvasRef.current.toDataURL('image/png');
    } else {
      if (!uploadedImage) {
        toast.error('Por favor sube una imagen de tu firma');
        return;
      }
      signatureData = uploadedImage;
    }

    setIsSaved(true);
    toast.success('Firma confirmada localmente. Usa "Guardar configuración" para persistir.');
    
    // Pass data up
    if (onFirmaSave) {
      onFirmaSave({
        nombre,
        cargo,
        modo,
        base64: signatureData
      });
    }
  };

  // Switch modes
  const handleModoChange = (nuevoModo) => {
    if (modo === nuevoModo) return;
    setModo(nuevoModo);
    setIsSaved(false);
    onFirmaSave && onFirmaSave(null);
    // Clear the other mode's state
    if (nuevoModo === 'dibujar') {
      clearUpload();
    } else {
      clearCanvas();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
          <div className="p-3 bg-green-50 text-[#407754] rounded-xl">
            <FiKey className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Gestión de Firma Digital</h3>
            <p className="text-xs text-gray-400">Configura tu firma para validar informes automáticamente</p>
          </div>
        </div>
        
        {/* Banner Informativo */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800 mb-6 shadow-sm">
          <FiInfo className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
          <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
            Tu firma digital se aplicará automáticamente a todos los informes que valides. Solo se agrega cuando el informe ha sido marcado como 'Validado'.
          </p>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Nombre completo <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setIsSaved(false); }}
              placeholder="Ej: Dr. Juan Carlos Pérez"
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Cargo</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => { setCargo(e.target.value); setIsSaved(false); }}
              placeholder="Ej: Coordinador Académico"
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#407754] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Tabs de Modo de Firma */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-xl inline-flex shadow-inner">
            <button
              type="button"
              onClick={() => handleModoChange('dibujar')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
                modo === 'dibujar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiEdit2 className="w-4 h-4" /> Dibujar firma
            </button>
            <button
              type="button"
              onClick={() => handleModoChange('subir')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
                modo === 'subir' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiUploadCloud className="w-4 h-4" /> Subir imagen
            </button>
          </div>
        </div>

        {/* Zona de Firma */}
        <div className="flex flex-col items-center">
          {modo === 'dibujar' ? (
            <div className="w-full max-w-lg flex flex-col items-center">
              <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden touch-none relative">
                {isSaved && (
                  <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm pointer-events-none">
                    <FiCheckCircle /> Confirmada
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="w-full h-[200px] cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Usa el mouse o tu dedo para dibujar tu firma en el recuadro superior.</p>
            </div>
          ) : (
            <div className="w-full max-w-lg flex flex-col items-center">
              {!uploadedImage ? (
                <div 
                  className="w-full h-[200px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-600">Haz clic para seleccionar imagen</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG o JPG, máximo 2MB</p>
                </div>
              ) : (
                <div className="w-full h-[200px] bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden relative group">
                  <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm z-10">
                    <FiCheckCircle /> {isSaved ? 'Confirmada' : 'Seleccionada'}
                  </div>
                  <img src={uploadedImage} alt="Firma digital subida" className="w-full h-full object-contain bg-white p-4" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-gray-800 px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                    >
                      Cambiar imagen
                    </button>
                  </div>
                </div>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                className="hidden"
              />
            </div>
          )}

          {/* Botones de acción locales */}
          <div className="flex gap-3 mt-6 w-full max-w-lg">
            <button
              type="button"
              onClick={modo === 'dibujar' ? clearCanvas : clearUpload}
              className="flex-1 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiTrash2 className="w-4 h-4" /> Limpiar
            </button>
            <button
              type="button"
              onClick={handleLocalSave}
              className={`flex-[2] py-2.5 px-4 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#407754] hover:bg-[#335f43]'
              }`}
            >
              <FiSave className="w-4 h-4" /> 
              {isSaved ? 'Firma guardada (Lista)' : 'Guardar firma'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
