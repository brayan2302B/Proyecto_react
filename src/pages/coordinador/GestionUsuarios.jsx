import React, { useEffect, useState } from 'react';
import { usuariosService } from '../../services/usuariosService';
import { 
  FiUsers, 
  FiUserPlus, 
  FiSearch, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiCheckCircle, 
  FiXCircle, 
  FiMail, 
  FiShield, 
  FiGrid,
  FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'sonner';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'instructor',
    id_rol: '',
    documento: '',
    id_area: '',
    estado_cuenta: 'pendiente',
    motivo_rechazo: '',
    contrasena: ''
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, areasData] = await Promise.all([
        usuariosService.getUsuarios(),
        usuariosService.getRoles(),
        usuariosService.getAreas()
      ]);
      setUsuarios(usersData);
      setRoles(rolesData);
      setAreas(areasData);
    } catch (err) {
      toast.error('Error al cargar la información del servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    // Default to instructor rol if available
    const defaultRol = roles.find(r => r.nombre_rol === 'instructor');
    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      rol: 'instructor',
      id_rol: defaultRol ? defaultRol.id_rol.toString() : '',
      documento: '',
      id_area: '',
      estado_cuenta: 'pendiente',
      motivo_rechazo: '',
      contrasena: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      id_rol: usuario.id_rol ? usuario.id_rol.toString() : '',
      documento: usuario.documento,
      id_area: usuario.id_area ? usuario.id_area.toString() : '',
      estado_cuenta: usuario.estado_cuenta || 'pendiente',
      motivo_rechazo: usuario.motivo_rechazo || '',
      contrasena: ''
    });
    setIsModalOpen(true);
  };

  const handleToggleEstado = async (id, nombre) => {
    try {
      const updated = await usuariosService.toggleEstadoUsuario(id);
      toast.success(`Estado de ${nombre} cambiado a ${updated.estado === 'activo' ? 'Aprobado' : 'Pendiente'}`);
      await loadData();
    } catch (err) {
      toast.error('No se pudo cambiar el estado del usuario');
    }
  };

  const handleDeleteUsuario = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar al usuario ${nombre}?`)) return;
    try {
      await usuariosService.eliminarUsuario(id);
      toast.success(`Usuario ${nombre} eliminado del sistema`);
      await loadData();
    } catch (err) {
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const handleSaveUsuario = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.documento) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }
    setSaving(true);

    const payload = {
      nombre: formData.nombre,
      email: formData.email,
      documento: formData.documento,
      id_rol: formData.id_rol ? parseInt(formData.id_rol) : undefined,
      id_area: formData.id_area ? parseInt(formData.id_area) : undefined,
      estado_cuenta: formData.estado_cuenta,
      motivo_rechazo: formData.estado_cuenta === 'rechazado' ? formData.motivo_rechazo : ''
    };

    if (formData.contrasena) {
      payload.contrasena = formData.contrasena;
    }

    try {
      if (editingUser) {
        await usuariosService.actualizarUsuario(editingUser.id, payload);
        toast.success('Usuario actualizado correctamente');
      } else {
        // Find mapped role name for backward compatibility inside creations
        const selectedRol = roles.find(r => r.id_rol.toString() === formData.id_rol);
        payload.rol = selectedRol ? selectedRol.nombre_rol : 'instructor';
        await usuariosService.crearUsuario(payload);
        toast.success('Usuario registrado con éxito');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error al guardar datos';
      toast.error(`Error: ${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  // Metrics
  const totalUsuarios = usuarios.length;
  const totalInstructores = usuarios.filter(u => u.rol === 'instructor').length;
  const totalCoordinadores = usuarios.filter(u => u.rol === 'coordinador').length;
  const totalActivos = usuarios.filter(u => u.estado_cuenta === 'aprobado').length;

  // Filtered list by query
  const filteredUsuarios = usuarios.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.documento.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-sm text-gray-500">Administre las cuentas del personal de coordinación e instructores del sistema</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md self-stretch sm:self-auto"
        >
          <FiUserPlus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Total Usuarios</span>
            <span className="text-2xl font-extrabold text-gray-850 mt-1">{totalUsuarios}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <FiUsers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Instructores</span>
            <span className="text-2xl font-extrabold text-gray-850 mt-1">{totalInstructores}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
            <FiShield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Coordinadores</span>
            <span className="text-2xl font-extrabold text-gray-850 mt-1">{totalCoordinadores}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-sena-green">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase">Activos (Aprobados)</span>
            <span className="text-2xl font-extrabold text-gray-850 mt-1">{totalActivos}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <FiSearch className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, email o documento..."
          className="w-full text-xs text-gray-700 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400"
        />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsuarios.map((u) => {
          const isAct = u.estado_cuenta === 'aprobado';
          const isRech = u.estado_cuenta === 'rechazado';
          const isPend = u.estado_cuenta === 'pendiente';
          const isCoord = u.rol === 'coordinador';

          return (
            <div 
              key={u.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-gray-800 text-base">{u.nombre}</h4>
                  
                  {/* Rol Badge */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isCoord ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.rol}
                  </span>

                  {/* Estado Badge */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isAct ? 'bg-green-100 text-green-700' :
                    isRech ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700 animate-pulse'
                  }`}>
                    {isAct ? 'Activo' : isRech ? 'Rechazado' : 'Pendiente'}
                  </span>

                  {u.firma_digital_ruta && (
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Firma Registrada
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiMail className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiGrid className="text-gray-400 flex-shrink-0" />
                    <span>Doc: {u.documento}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 sm:col-span-2">
                    <FiShield className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{u.area || 'Coordinación'}</span>
                  </div>
                </div>

                {isRech && u.motivo_rechazo && (
                  <div className="mt-2 bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-start gap-2 max-w-xl">
                    <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-red-950 font-bold block">Motivo del rechazo:</span>
                      <p className="text-xs text-red-800 mt-0.5 leading-relaxed">{u.motivo_rechazo}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-gray-50 pt-3 md:pt-0 md:border-t-0 justify-end">
                <button
                  onClick={() => handleToggleEstado(u.id, u.nombre)}
                  className={`p-2 rounded-xl border transition-all ${
                    isAct 
                      ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100' 
                      : 'bg-green-50 border-green-100 text-sena-green hover:bg-green-100'
                  }`}
                  title={isAct ? 'Suspender cuenta (Poner pendiente)' : 'Aprobar cuenta (Activar)'}
                >
                  {isAct ? <FiXCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    let desc = `Detalles del Usuario:\nNombre: ${u.nombre}\nRol: ${u.rol}\nDocumento: ${u.documento}\nÁrea: ${u.area || 'Coordinación'}\nEstado: ${u.estado_cuenta.toUpperCase()}`;
                    if (u.motivo_rechazo) desc += `\nMotivo de Rechazo: ${u.motivo_rechazo}`;
                    toast.info(desc);
                  }}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 transition-all"
                  title="Ver detalle"
                >
                  <FiEye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenEditModal(u)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 transition-all"
                  title="Aprobar / Configurar Usuario"
                >
                  <FiEdit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteUsuario(u.id, u.nombre)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-50 transition-all"
                  title="Eliminar usuario"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingUser ? 'Aprobación y Configuración de Usuario' : 'Registrar Nuevo Usuario'}
              </h3>
              <p className="text-xs text-gray-500">Configure los accesos, estado de cuenta y área del usuario</p>
            </div>

            <form onSubmit={handleSaveUsuario} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Wilson Martínez"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@sena.edu.co"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Documento *</label>
                  <input
                    type="text"
                    required
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    placeholder="Documento nacional"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Rol *</label>
                  <select
                    value={formData.id_rol}
                    onChange={(e) => setFormData({ ...formData, id_rol: e.target.value })}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                  >
                    <option value="">Seleccionar Rol</option>
                    {roles.map(r => (
                      <option key={r.id_rol} value={r.id_rol.toString()}>
                        {r.nombre_rol === 'coordinador' ? 'Coordinador' : 'Instructor'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Área de Formación</label>
                <select
                  value={formData.id_area}
                  onChange={(e) => setFormData({ ...formData, id_area: e.target.value })}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                >
                  <option value="">Ninguna / Seleccionar Área</option>
                  {areas.map(a => (
                    <option key={a.id_area} value={a.id_area.toString()}>{a.nombre_area}</option>
                  ))}
                </select>
              </div>

              {editingUser ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Estado de Cuenta</label>
                    <select
                      value={formData.estado_cuenta}
                      onChange={(e) => setFormData({ ...formData, estado_cuenta: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                    >
                      <option value="pendiente">Pendiente de aprobación</option>
                      <option value="aprobado">Aprobado / Activo</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>

                  {formData.estado_cuenta === 'rechazado' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Motivo de Rechazo *</label>
                      <input
                        type="text"
                        required
                        value={formData.motivo_rechazo}
                        onChange={(e) => setFormData({ ...formData, motivo_rechazo: e.target.value })}
                        placeholder="Ej: Cédula borrosa o documentación incompleta"
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 transition-all border-red-200 bg-red-50/10 text-red-900"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Contraseña Temporal *</label>
                  <input
                    type="password"
                    required
                    value={formData.contrasena}
                    onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                    placeholder="Contraseña inicial (min. 6 caracteres)"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sena-green transition-all"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-sena-green hover:bg-sena-green-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {saving ? 'Guardando...' : editingUser ? 'Guardar y Aplicar' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
