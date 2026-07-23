// src/services/informesService.js

let MOCK_INFORMES = [
  {
    id: 'inf-1',
    instructorId: 'inst-1',
    instructorNombre: 'Wilson Martínez',
    periodo: 'Julio 2026',
    tipo: 'GC', // GC = Contractual, GF = Financiero
    area: 'Análisis y Desarrollo de Software',
    versiones: [
      {
        version: 1,
        archivo: 'GTH-F-062_GC_Wilson_Martinez_Julio.pdf',
        size: 245000,
        fecha: '2026-07-15T10:30:00',
        estado: 'pendiente', // 'pendiente' | 'aprobado' | 'rechazado'
        comentarios: ''
      }
    ]
  },
  {
    id: 'inf-2',
    instructorId: 'inst-1',
    instructorNombre: 'Wilson Martínez',
    periodo: 'Julio 2026',
    tipo: 'GF',
    area: 'Análisis y Desarrollo de Software',
    versiones: [
      {
        version: 1,
        archivo: 'GTH-F-062_GF_Wilson_Martinez_Julio.pdf',
        size: 198000,
        fecha: '2026-07-15T10:35:00',
        estado: 'aprobado',
        comentarios: 'Informe financiero correcto con todas las firmas.'
      }
    ]
  }
];

// ---------- Lectura ----------

export const getInformes = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_INFORMES]), 600);
  });
};

// Helper: última versión de un informe (la que importa mostrar/aprobar)
export const getUltimaVersion = (informe) =>
  informe.versiones[informe.versiones.length - 1];

// ---------- Instructor: sube nueva versión ----------

export const addVersion = (periodo, tipo, instructorId, archivoNombre, archivoSize) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let informe = MOCK_INFORMES.find(
        (inf) => inf.periodo === periodo && inf.tipo === tipo && inf.instructorId === instructorId
      );

      if (!informe) {
        informe = {
          id: `inf-${MOCK_INFORMES.length + 1}`,
          instructorId,
          instructorNombre: 'Wilson Martínez',
          periodo,
          tipo,
          area: 'Análisis y Desarrollo de Software',
          versiones: []
        };
        MOCK_INFORMES.push(informe);
      }

      const nextVer = informe.versiones.length + 1;
      const nuevaVersion = {
        version: nextVer,
        archivo: archivoNombre,
        size: archivoSize,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        comentarios: ''
      };

      informe.versiones.push(nuevaVersion);
      resolve({ ...nuevaVersion });
    }, 800);
  });
};

// ---------- Coordinador: aprueba/rechaza la última versión ----------

export const updateEstadoInforme = (id, nuevoEstado, comentarios = '') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const informe = MOCK_INFORMES.find((inf) => inf.id === id);
      if (!informe) {
        reject(new Error('Informe no encontrado'));
        return;
      }

      const ultima = getUltimaVersion(informe);
      ultima.estado = nuevoEstado; // 'aprobado' | 'rechazado'
      ultima.comentarios = comentarios;

      resolve({ ...informe });
    }, 800);
  });
};

export const informesService = {
  getInformes,
  addVersion,
  updateEstadoInforme,
  getUltimaVersion
};