import api from './api';

export const instructoresService = {
  // Get all instructors by filtering users list
  getInstructores: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/personas');
    return response.data
      .filter((u: any) => u.rol?.nombre_rol === 'instructor')
      .map((u: any) => ({
        id: u.id_usuario.toString(),
        nombre: u.nombre_completo,
        email: u.correo,
        documento: u.numero_documento,
        area: u.area?.nombre_area ?? '',
        estado: u.estado_cuenta === 'aprobado' ? 'activo' : 'inactivo',
        fichas: [], // Mocked layout array
        totalAprendices: 0,
        carpetaRuta: `G-Drive/STIMI/Instructores/${u.nombre_completo.replace(/\s+/g, '_')}`,
        informesPendientes: 0,
        ultimoReporte: u.firma_digital_ruta ? 'Firma cargada' : 'Sin firma'
      }));
  },

  // Get specific instructor
  getInstructorById: async (id: string): Promise<any> => {
    const response = await api.get<any>(`/personas/${id}`);
    const u = response.data;
    return {
      id: u.id_usuario.toString(),
      nombre: u.nombre_completo,
      email: u.correo,
      documento: u.numero_documento,
      area: u.area?.nombre_area ?? '',
      estado: u.estado_cuenta === 'aprobado' ? 'activo' : 'inactivo',
      fichas: [],
      totalAprendices: 0,
      carpetaRuta: `G-Drive/STIMI/Instructores/${u.nombre_completo.replace(/\s+/g, '_')}`
    };
  },

  // Simulated reminder (not present in NestJS controller)
  enviarRecordatorio: async (id: string): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Se ha enviado un correo de recordatorio al instructor para la entrega de informes pendientes.' 
        });
      }, 600);
    });
  }
};
