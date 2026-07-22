// Simulated API Service for Users (Gestión de Usuarios)
let MOCK_USUARIOS = [
  {
    id: 'u-1',
    nombre: 'Wilson Martínez',
    email: 'wilson.martinez@sena.edu.co',
    rol: 'instructor',
    estado: 'activo',
    documento: '1014234567',
    area: 'Análisis y Desarrollo de Software',
    fichas: ['3145636', '3145637']
  },
  {
    id: 'u-2',
    nombre: 'Coordinador Académico',
    email: 'coordinador@sena.edu.co',
    rol: 'coordinador',
    estado: 'activo',
    documento: '52887643',
    area: 'Coordinación de Informática',
    fichas: []
  },
  {
    id: 'u-3',
    nombre: 'Ana María Gómez',
    email: 'ana.gomez@sena.edu.co',
    rol: 'instructor',
    estado: 'activo',
    documento: '1020456789',
    area: 'Redes y Telecomunicaciones',
    fichas: ['2987654']
  },
  {
    id: 'u-4',
    nombre: 'Carlos Mario Restrepo',
    email: 'carlos.restrepo@sena.edu.co',
    rol: 'instructor',
    estado: 'activo',
    documento: '98765432',
    area: 'Diseño Gráfico y Multimedia',
    fichas: ['3012345', '3012346']
  },
  {
    id: 'u-5',
    nombre: 'Diana Carolina Ruiz',
    email: 'diana.ruiz@sena.edu.co',
    rol: 'instructor',
    estado: 'activo',
    documento: '1035678901',
    area: 'Análisis y Desarrollo de Software',
    fichas: ['3145638']
  },
  {
    id: 'u-6',
    nombre: 'Jorge Eliecer Gaitán',
    email: 'jorge.gaitan@sena.edu.co',
    rol: 'instructor',
    estado: 'inactivo',
    documento: '79654321',
    area: 'Gestión Administrativa',
    fichas: []
  }
];

let MOCK_PENDIENTES = [
  {
    id: 'p-1',
    nombre: 'Carlos Andrés Mendoza',
    email: 'carlos.mendoza@sena.edu.co',
    documento: '1098765432',
    fechaRegistro: '2026-07-20',
    rol: 'instructor',
    area: 'Automatización Industrial'
  },
  {
    id: 'p-2',
    nombre: 'Laura Sofía Pinzón',
    email: 'laura.pinzon@sena.edu.co',
    documento: '1054321098',
    fechaRegistro: '2026-07-21',
    rol: 'instructor',
    area: 'Biotecnología'
  }
];

export const usuariosService = {
  getUsuarios: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_USUARIOS]);
      }, 500);
    });
  },

  getSolicitudesPendientes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_PENDIENTES]);
      }, 500);
    });
  },

  aprobarSolicitud: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_PENDIENTES.findIndex((p) => p.id === id);
        if (index !== -1) {
          const solicitud = MOCK_PENDIENTES[index];
          // Remove from pending
          MOCK_PENDIENTES.splice(index, 1);
          // Add to active users
          const nuevoUsuario = {
            id: `u-${Date.now()}`,
            nombre: solicitud.nombre,
            email: solicitud.email,
            rol: solicitud.rol,
            estado: 'activo',
            documento: solicitud.documento,
            area: solicitud.area || 'Área General',
            fichas: []
          };
          MOCK_USUARIOS.push(nuevoUsuario);
          resolve(nuevoUsuario);
        } else {
          reject(new Error('Solicitud no encontrada'));
        }
      }, 700);
    });
  },

  rechazarSolicitud: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_PENDIENTES.findIndex((p) => p.id === id);
        if (index !== -1) {
          const eliminado = MOCK_PENDIENTES.splice(index, 1);
          resolve(eliminado[0]);
        } else {
          reject(new Error('Solicitud no encontrada'));
        }
      }, 650);
    });
  },

  crearUsuario: (usuario) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevo = {
          id: `u-${Date.now()}`,
          estado: 'activo',
          ...usuario
        };
        MOCK_USUARIOS.push(nuevo);
        resolve(nuevo);
      }, 900);
    });
  },

  actualizarUsuario: (id, datosActualizados) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_USUARIOS.findIndex((u) => u.id === id);
        if (index !== -1) {
          MOCK_USUARIOS[index] = { ...MOCK_USUARIOS[index], ...datosActualizados };
          resolve(MOCK_USUARIOS[index]);
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }, 700);
    });
  },

  toggleEstadoUsuario: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_USUARIOS.findIndex((u) => u.id === id);
        if (index !== -1) {
          const nuevoEstado = MOCK_USUARIOS[index].estado === 'activo' ? 'inactivo' : 'activo';
          MOCK_USUARIOS[index] = { ...MOCK_USUARIOS[index], estado: nuevoEstado };
          resolve(MOCK_USUARIOS[index]);
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }, 400);
    });
  },

  eliminarUsuario: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_USUARIOS.findIndex((u) => u.id === id);
        if (index !== -1) {
          const eliminado = MOCK_USUARIOS.splice(index, 1);
          resolve(eliminado[0]);
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }, 600);
    });
  }
};
