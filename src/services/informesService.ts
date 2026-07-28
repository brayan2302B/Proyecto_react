import api from './api';

const capitalizeStatus = (status: string) => {
  if (!status) return 'No cargado';
  const s = status.toLowerCase();
  if (s === 'validado' || s === 'aprobado') return 'Validado';
  if (s === 'devuelto' || s === 'rechazado') return 'Devuelto';
  if (s === 'pendiente') return 'Pendiente';
  if (s === 'borrador') return 'Borrador';
  return status;
};

const mapApiReportToUI = (apiReport: any) => {
  const versionsMapped = (apiReport.versiones || []).map((v: any) => ({
    version: v.numero_version,
    archivo: v.archivo_nombre_original,
    size: v.archivo_tamano_bytes ? (v.archivo_tamano_bytes / (1024 * 1024)).toFixed(2) + ' MB' : '0.00 MB',
    fecha: v.fecha_version ? new Date(v.fecha_version).toLocaleString() : '',
    estado: capitalizeStatus(v.estado),
    observacion: v.observacion || '',
    comentarios: v.observacion || '',
    id_version: v.id_version
  }));

  // Sort versions by version number ascending for history visualization
  versionsMapped.sort((a: any, b: any) => a.version - b.version);

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Guard: periodo can be null if the report is orphaned
  const periodo = apiReport.periodo ?? null;
  const mesNombre = periodo ? (mesesNombres[periodo.mes - 1] ?? 'Desconocido') : 'Desconocido';
  const periodoStr = periodo ? `${mesNombre} ${periodo.anio}` : '';

  const lastVer = versionsMapped.length > 0 ? versionsMapped[versionsMapped.length - 1] : null;

  return {
    id: apiReport.id_informe,
    instructorId: apiReport.usuario?.id_usuario?.toString(),
    instructorNombre: apiReport.usuario?.nombre_completo ?? '',
    periodo: periodoStr,
    mes: mesNombre,
    archivoNombre: lastVer ? lastVer.archivo : 'Sin archivos',
    tipo: apiReport.tipo_informe,
    area: apiReport.usuario?.area?.nombre_area ?? '',
    estado: capitalizeStatus(apiReport.estado),
    observacion: apiReport.observacion || '',
    comentarios: apiReport.observacion || '',
    versiones: versionsMapped
  };
};


export const getInformes = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/informes');
  return response.data.map(mapApiReportToUI);
};

export const getHistorial = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/informes/historial');
  return response.data.map(mapApiReportToUI);
};

export const getUltimaVersion = (informe: any) => {
  if (!informe || !informe.versiones || informe.versiones.length === 0) return null;
  return informe.versiones[informe.versiones.length - 1];
};

export const addVersion = async (
  periodo: string,
  tipo: string,
  instructorId: string, // Kept for compatibility, backend uses current user context
  archivo: File,
  archivoSizeLabel?: string // Kept for compatibility
): Promise<any> => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('periodo', periodo);
  formData.append('tipo', tipo);

  const response = await api.post('/informes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return mapApiReportToUI(response.data);
};

export const uploadNuevaVersion = async (
  periodo: string,
  tipo: string,
  archivo: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('archivo', archivo);

  const response = await api.post(`/informes/${periodo}/${tipo}/version`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return mapApiReportToUI(response.data);
};

export const getDetalleReporte = async (periodo: string, tipo: string): Promise<any> => {
  const response = await api.get(`/informes/${periodo}/${tipo}`);
  if (!response.data || response.data.id_informe === null) {
    return response.data; // Return raw empty state structure
  }
  return mapApiReportToUI(response.data);
};

export const updateEstadoInforme = async (
  id: number,
  nuevoEstado: string,
  comentarios: string = ''
): Promise<any> => {
  // Retrieve the full report to identify its type, period, and owner details
  const response = await api.get<any[]>('/informes');
  const matching = response.data.find(r => r.id_informe === id);
  if (!matching) {
    throw new Error('Informe no encontrado en el servidor.');
  }

  let estadoParam = nuevoEstado.toLowerCase();
  if (estadoParam === 'aprobado' || estadoParam === 'validado') {
    estadoParam = 'validado';
  } else if (estadoParam === 'rechazado' || estadoParam === 'devuelto') {
    estadoParam = 'devuelto';
  }

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const mesNombre = mesesNombres[matching.periodo.mes - 1];
  const periodoStr = `${mesNombre} ${matching.periodo.anio}`;

  const patchPayload = {
    estado: estadoParam,
    observacion: comentarios,
    id_usuario: matching.usuario.id_usuario
  };

  const patchResponse = await api.patch(`/informes/${periodoStr}/${matching.tipo_informe}/estado`, patchPayload);
  return mapApiReportToUI(patchResponse.data);
};

export const descargarPdf = async (id: number, nombreArchivo: string): Promise<void> => {
  const response = await api.get(`/informes/${id}/download`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nombreArchivo || `informe-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const getPdfGcJson = async (id: number): Promise<any> => {
  const response = await api.get(`/informes/${id}/pdf-gc`);
  return response.data;
};

export const informesService = {
  getInformes,
  getHistorial,
  getUltimaVersion,
  addVersion,
  uploadNuevaVersion,
  getDetalleReporte,
  updateEstadoInforme,
  descargarPdf,
  getPdfGcJson
};
