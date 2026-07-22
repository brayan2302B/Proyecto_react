// src/services/informesService.js

export let mockInformes = [
  {
    periodo: "Julio 2026",
    tipo: "GC",
    versiones: [
      { 
        version: 1, 
        archivo: "informe_gc_julio_v1.pdf", 
        fecha: "05/07/2026, 10:30 AM", 
        estado: "Devuelto", 
        observacion: "Falta firma digital en la página 2" 
      }
    ]
  },
  {
    periodo: "Julio 2026",
    tipo: "GF",
    versiones: []
  }
];

export const getInformes = () => {
  return mockInformes;
};

export const addVersion = (periodo, tipo, archivoNombre, archivoSize) => {
  let informe = mockInformes.find(inf => inf.periodo === periodo && inf.tipo === tipo);
  if (!informe) {
    informe = { periodo, tipo, versiones: [] };
    mockInformes.push(informe);
  }
  
  const nextVer = informe.versiones.length + 1;
  const newVer = {
    version: nextVer,
    archivo: archivoNombre,
    fecha: new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    estado: "Pendiente",
    observacion: null,
    size: archivoSize
  };

  informe.versiones.push(newVer);
  return newVer;
};

export const simulateCoordinadorAction = (periodo, tipo, action, observacion = "") => {
  const informe = mockInformes.find(inf => inf.periodo === periodo && inf.tipo === tipo);
  if (informe && informe.versiones.length > 0) {
    const lastVersion = informe.versiones[informe.versiones.length - 1];
    if (lastVersion.estado === "Pendiente") {
      lastVersion.estado = action; // 'Validado' or 'Devuelto'
      lastVersion.observacion = action === "Devuelto" ? observacion : null;
    }
  }
};
