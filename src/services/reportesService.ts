import api from './api';

export const reportesService = {
  getEstadisticasGenerales: async (): Promise<any> => {
    const response = await api.get<any[]>('/informes');
    const reports = response.data;

    const totalInformes = reports.length;
    const aprobados = reports.filter(r => r.estado === 'validado' || r.estado === 'aprobado').length;
    const rechazados = reports.filter(r => r.estado === 'devuelto' || r.estado === 'rechazado').length;
    const pendientes = reports.filter(r => r.estado === 'pendiente').length;

    const tasaCumplimiento = totalInformes > 0 ? Math.round((aprobados / totalInformes) * 100) : 100;

    const distribucionEstados = {
      aprobadosPorcentaje: totalInformes > 0 ? parseFloat(((aprobados / totalInformes) * 100).toFixed(1)) : 0,
      rechazadosPorcentaje: totalInformes > 0 ? parseFloat(((rechazados / totalInformes) * 100).toFixed(1)) : 0,
      pendientesPorcentaje: totalInformes > 0 ? parseFloat(((pendientes / totalInformes) * 100).toFixed(1)) : 0,
    };

    // Calculate instructor-specific counts
    const instructorsMap: Record<number, { id: string; nombre: string; aprobados: number; rechazados: number; pendientes: number }> = {};

    reports.forEach((r) => {
      if (!r.usuario) return;
      const instId = r.usuario.id_usuario;
      if (!instructorsMap[instId]) {
        instructorsMap[instId] = {
          id: instId.toString(),
          nombre: r.usuario.nombre_completo,
          aprobados: 0,
          rechazados: 0,
          pendientes: 0
        };
      }

      if (r.estado === 'validado' || r.estado === 'aprobado') {
        instructorsMap[instId].aprobados++;
      } else if (r.estado === 'devuelto' || r.estado === 'rechazado') {
        instructorsMap[instId].rechazados++;
      } else if (r.estado === 'pendiente') {
        instructorsMap[instId].pendientes++;
      }
    });

    const cumplimientoPorInstructor = Object.values(instructorsMap);

    return {
      totalInformes,
      aprobados,
      rechazados,
      pendientes,
      tasaCumplimiento,
      distribucionEstados,
      cumplimientoPorInstructor
    };
  }
};
