import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiHome, 
  FiFileText, 
  FiBarChart2, 
  FiUsers, 
  FiSettings, 
  FiUser, 
  FiLogOut,
  FiMail,
  FiBook,
  FiCalendar,
  FiKey
} from 'react-icons/fi';
import { toast } from 'sonner';
import NotificacionesFAB from '../components/NotificacionesFAB';
import AsistenteFAB from '../components/AsistenteFAB';
import logoSena from '../assets/logo-sena.png';

export default function CoordinadorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileContainerRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  // Listen to clicks outside and ESC key for profile popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  // Nav items (removed Notificaciones and Asistente IA as per requirements)
  const navItems = [
    { path: '/coordinador', icon: FiHome, label: 'Inicio', exact: true },
    { path: '/coordinador/revision', icon: FiFileText, label: 'Revisión Informes' },
    { path: '/coordinador/reportes', icon: FiBarChart2, label: 'Reportes' },
    { path: '/coordinador/usuarios', icon: FiUsers, label: 'Usuarios' },
    { path: '/coordinador/configuracion', icon: FiSettings, label: 'Configuración' },
    { path: '/coordinador/perfil', icon: FiUser, label: 'Mi Perfil' },
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar - Collapsible */}
      <aside className="group relative w-[90px] hover:w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 flex flex-col justify-between shadow-sm">
        
        {/* Top Section */}
        <div>
          {/* Header & Logo */}
          <div className="h-20 flex items-center justify-center px-4 transition-all border-b border-gray-100">
            <img src={logoSena} alt="Logo SENA" className="w-10 h-10 object-contain shrink-0" />
            <div className="ml-3 flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              <h2 className="font-bold text-[#407754] text-sm leading-tight">STIMI</h2>
              <p className="text-xs text-gray-500 font-medium">Coordinación</p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = isLinkActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden ${
                    isActive 
                      ? 'bg-green-50 text-[#407754]' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-[#407754]' : ''}`} />
                  <span className={`ml-4 text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions Section */}
        <div className="w-full flex flex-col gap-1 border-t border-gray-100 p-3 relative" ref={profileContainerRef}>
          {/* Profile Toggle Button */}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 overflow-hidden ${
              isProfileOpen ? 'bg-gray-100 text-gray-900' : ''
            }`}
            title="Perfil"
          >
            <FiUser className="w-6 h-6 shrink-0" />
            <div className="ml-4 flex flex-col items-start whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <span className="text-xs text-gray-400 font-medium truncate w-32 text-left">Coordinador</span>
              <span className="text-sm font-bold truncate w-32 text-left">{user?.nombreCompleto || 'Perfil'}</span>
            </div>
          </button>

          {/* Profile Popover Panel */}
          {isProfileOpen && (
            <div 
              className="absolute bottom-16 left-20 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-5 z-50 animate-fade-in origin-bottom-left space-y-4"
            >
              {/* Popover Header with Avatar */}
              <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                <div className="w-12 h-12 bg-green-50 text-[#407754] rounded-full flex items-center justify-center font-bold text-lg shadow-inner flex-shrink-0">
                  {user?.nombreCompleto ? user.nombreCompleto.substring(0, 2).toUpperCase() : 'CO'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{user?.nombreCompleto || 'Coordinador STIMI'}</h4>
                  <span className="bg-green-100 text-green-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                    Coordinador Académico
                  </span>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <FiMail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Correo Institucional</span>
                    <span className="font-medium text-gray-700">{user?.email || 'coordinador@sena.edu.co'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FiKey className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Documento de Identidad</span>
                    <span className="font-medium text-gray-700">{user?.documento || '52887643'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FiBook className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Centro / Sede</span>
                    <span className="font-medium text-gray-700 leading-tight block">
                      {user?.centro || 'Centro de Servicios y Gestión Empresarial - Regional Antioquia'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Vinculación</span>
                    <span className="font-medium text-gray-700">
                      {user?.vinculacion || 'Contratista - Desde Febrero 2024'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-gray-50 pt-3">
                <button 
                  onClick={() => { toast.info('Editar perfil simulado'); setIsProfileOpen(false); }}
                  className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Editar perfil
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 overflow-hidden"
            title="Cerrar Sesión"
          >
            <FiLogOut className="w-6 h-6 shrink-0" />
            <div className="ml-4 flex flex-col items-start whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <span className="text-sm font-bold truncate w-32 text-left mt-0.5">Cerrar Sesión</span>
            </div>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50">
        <Outlet />
      </main>

      {/* Floating Action Buttons (FABs) in bottom right corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        <NotificacionesFAB />
        <AsistenteFAB />
      </div>

    </div>
  );
}
