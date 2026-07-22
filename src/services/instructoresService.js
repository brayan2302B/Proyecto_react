// Simulated API Service for Instructors
const MOCK_INSTRUCTORES = [
  {
    id: 'inst-1',
    nombre: 'Wilson Martínez',
    email: 'wilson.martinez@sena.edu.co',
    documento: '1014234567',
    area: 'Análisis y Desarrollo de Software',
    fichas: ['3145636', '3145637'],
    totalAprendices: 52,
    estado: 'activo',
    carpetaRuta: 'G-Drive/STIMI/Instructores/Wilson_Martinez',
    informesPendientes: 1, // GC pendiente de revisión
    ultimoReporte: 'GF validado (Junio)',
  },
  {
    id: 'inst-2',
    nombre: 'Ana María Gómez',
    email: 'ana.gomez@sena.edu.co',
    documento: '1020456789',
    area: 'Redes y Telecomunicaciones',
    fichas: ['2987654'],
    totalAprendices: 28,
    estado: 'activo',
    carpetaRuta: 'G-Drive/STIMI/Instructores/Ana_Gomez',
    informesPendientes: 2, // GC y GF sin enviar
    ultimoReporte: 'Ninguno este mes',
  },
  {
    id: 'inst-3',
    nombre: 'Carlos Mario Restrepo',
    email: 'carlos.restrepo@sena.edu.co',
    documento: '98765432',
    area: 'Diseño Gráfico y Multimedia',
    fichas: ['3012345', '3012346'],
    totalAprendices: 45,
    estado: 'activo',
    carpetaRuta: 'G-Drive/STIMI/Instructores/Carlos_Restrepo',
    informesPendientes: 0,
    ultimoReporte: 'GC y GF validados (Junio)',
  },
  {
    id: 'inst-4',
    nombre: 'Diana Carolina Ruiz',
    email: 'diana.ruiz@sena.edu.co',
    documento: '1035678901',
    area: 'Análisis y Desarrollo de Software',
    fichas: ['3145638'],
    totalAprendices: 30,
    estado: 'activo',
    carpetaRuta: 'G-Drive/STIMI/Instructores/Diana_Ruiz',
    informesPendientes: 1, // GF pendiente de revisión
    ultimoReporte: 'GC validado (Junio)',
  },
  {
    id: 'inst-5',
    nombre: 'Jorge Eliecer Gaitán',
    email: 'jorge.gaitan@sena.edu.co',
    documento: '79654321',
    area: 'Gestión Administrativa',
    fichas: [],
    totalAprendices: 0,
    estado: 'inactivo',
    carpetaRuta: 'G-Drive/STIMI/Instructores/Jorge_Gaitan',
    informesPendientes: 0,
    ultimoReporte: 'Ninguno (Inactivo)',
  }
];

export const instructoresService = {
  getInstructores: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_INSTRUCTORES]);
      }, 500);
    });
  },

  getInstructorById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const inst = MOCK_INSTRUCTORES.find((i) => i.id === id);
        if (inst) resolve({ ...inst });
        else reject(new Error('Instructor no encontrado'));
      }, 400);
    });
  },

  enviarRecordatorio: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const inst = MOCK_INSTRUCTORES.find((i) => i.id === id);
        console.log(`Recordatorio enviado a: ${inst ? inst.nombre : id}`);
        resolve({ success: true, message: `Recordatorio enviado a ${inst ? inst.nombre : 'Instructor'}` });
      }, 800);
    });
  }
};
