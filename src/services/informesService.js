// Simulated API Service for Reports (Informes)
let MOCK_INFORMES = [
  {
    id: 'inf-1',
    instructorId: 'inst-1',
    instructorNombre: 'Wilson Martínez',
    mes: 'Julio 2026',
    tipo: 'GC',
    estado: 'pendiente',
    fechaEnvio: '2026-07-15T10:30:00',
    archivoNombre: 'GTH-F-062_GC_Wilson_Martinez_Julio.pdf',
    comentarios: '',
    area: 'Análisis y Desarrollo de Software'
  },
  {
    id: 'inf-2',
    instructorId: 'inst-1',
    instructorNombre: 'Wilson Martínez',
    mes: 'Julio 2026',
    tipo: 'GF',
    estado: 'aprobado',
    fechaEnvio: '2026-07-15T10:35:00',
    fechaRevision: '2026-07-18T14:20:00',
    archivoNombre: 'GTH-F-062_GF_Wilson_Martinez_Julio.pdf',
    comentarios: 'Informe financiero correcto con todas las firmas.',
    area: 'Análisis y Desarrollo de Software'
  },
  {
    id: 'inf-3',
    instructorId: 'inst-4',
    instructorNombre: 'Diana Carolina Ruiz',
    mes: 'Julio 2026',
    tipo: 'GC',
    estado: 'aprobado',
    fechaEnvio: '2026-07-16T08:15:00',
    fechaRevision: '2026-07-19T09:00:00',
    archivoNombre: 'GTH-F-062_GC_Diana_Ruiz_Julio.pdf',
    comentarios: 'Informe contractual validado.',
    area: 'Análisis y Desarrollo de Software'
  },
  {
    id: 'inf-4',
    instructorId: 'inst-4',
    instructorNombre: 'Diana Carolina Ruiz',
    mes: 'Julio 2026',
    tipo: 'GF',
    estado: 'pendiente',
    fechaEnvio: '2026-07-16T08:20:00',
    archivoNombre: 'GTH-F-062_GF_Diana_Ruiz_Julio.pdf',
    comentarios: '',
    area: 'Análisis y Desarrollo de Software'
  },
  {
    id: 'inf-5',
    instructorId: 'inst-2',
    instructorNombre: 'Ana María Gómez',
    mes: 'Julio 2026',
    tipo: 'GC',
    estado: 'rechazado',
    fechaEnvio: '2026-07-14T11:00:00',
    fechaRevision: '2026-07-16T15:30:00',
    archivoNombre: 'GTH-F-062_GC_Ana_Gomez_Julio.pdf',
    comentarios: 'Falta firma digital en la página 3 del formato contractual.',
    area: 'Redes y Telecomunicaciones'
  }
];

export const informesService = {
  getInformes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_INFORMES]);
      }, 600);
    });
  },

  updateEstadoInforme: (id, nuevoEstado, comentarios = '') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_INFORMES.findIndex((inf) => inf.id === id);
        if (index !== -1) {
          MOCK_INFORMES[index] = {
            ...MOCK_INFORMES[index],
            estado: nuevoEstado,
            comentarios: comentarios,
            fechaRevision: new Date().toISOString()
          };
          resolve({ ...MOCK_INFORMES[index] });
        } else {
          reject(new Error('Informe no encontrado'));
        }
      }, 800);
    });
  }
};
