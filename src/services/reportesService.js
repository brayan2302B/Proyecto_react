// Simulated API Service for Statistics and Reports
export const reportesService = {
  getEstadisticasGenerales: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalInformes: 24,
          aprobados: 16,
          rechazados: 4,
          pendientes: 4,
          tasaCumplimiento: 80, // % general
          distribucionEstados: {
            aprobadosPorcentaje: 66.6,
            rechazadosPorcentaje: 16.7,
            pendientesPorcentaje: 16.7
          },
          cumplimientoPorInstructor: [
            { id: 'inst-1', nombre: 'Wilson Martínez', aprobados: 3, rechazados: 0, pendientes: 1 },
            { id: 'inst-2', nombre: 'Ana María Gómez', aprobados: 1, rechazados: 2, pendientes: 1 },
            { id: 'inst-3', nombre: 'Carlos Mario Restrepo', aprobados: 4, rechazados: 0, pendientes: 0 },
            { id: 'inst-4', nombre: 'Diana Carolina Ruiz', aprobados: 2, rechazados: 1, pendientes: 1 },
            { id: 'inst-5', nombre: 'Jorge Eliecer Gaitán', aprobados: 0, rechazados: 0, pendientes: 0 }
          ]
        });
      }, 700);
    });
  }
};
