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

export default function CoordinadorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
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
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      {/* Sidebar Container - Stays fixed w-20 to preserve layout spacing, but aside inside is absolute and expands */}
      <div className="w-20 h-screen flex-shrink-0 relative z-30">
        <aside 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`absolute left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col justify-between items-center py-6 shadow-md transition-all duration-200 overflow-hidden ${
            isHovered ? 'w-64 px-4 items-start' : 'w-20 px-2 items-center'
          }`}
        >
          
          {/* Logo Section */}
          <div className={`flex flex-col mb-6 w-full ${isHovered ? 'items-start px-2' : 'items-center'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sena-green rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm hover:scale-105 transition-transform duration-200 flex-shrink-0">
                S
              </div>
              {isHovered && (
                <div className="flex flex-col animate-fade-in">
                  <span className="text-sm font-extrabold text-sena-green tracking-wider leading-none">STIMI</span>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5">Coordinación</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 w-full flex flex-col gap-3">
            {navItems.map((item) => {
              const Active = isLinkActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full h-12 rounded-xl flex items-center transition-all duration-200 hover:-translate-y-0.5 ${
                    isHovered ? 'px-4 justify-start gap-3' : 'justify-center'
                  } ${
                    Active 
                      ? 'bg-sena-green-light text-sena-green shadow-sm font-bold' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title={!isHovered ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isHovered && (
                    <span className="text-xs font-semibold truncate animate-fade-in">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions Section */}
          <div className="w-full flex flex-col gap-3 border-t border-gray-100 pt-6 relative" ref={profileContainerRef}>
            {/* Profile Toggle Button */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-full h-12 rounded-xl flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative ${
                isProfileOpen ? 'bg-sena-green-light text-sena-green' : ''
              } ${
                isHovered ? 'px-4 justify-start gap-3' : 'justify-center'
              }`}
              title={!isHovered ? `Perfil (${user?.nombreCompleto || 'Coordinador'})` : undefined}
            >
              <FiUser className="w-5 h-5 flex-shrink-0" />
              {isHovered && (
                <span className="text-xs font-semibold truncate text-left leading-tight animate-fade-in flex-1">
                  {user?.nombreCompleto || 'Coordinador'}
                </span>
              )}
            </button>

            {/* Profile Popover Panel */}
            {isProfileOpen && (
              <div 
                className={`absolute bottom-16 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-5 z-50 animate-fade-in origin-bottom space-y-4 ${
                  isHovered ? 'left-0' : 'left-18'
                }`}
              >
                {/* Popover Header with Avatar */}
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                  <div className="w-12 h-12 bg-sena-green-light text-sena-green rounded-full flex items-center justify-center font-bold text-lg shadow-inner flex-shrink-0">
                    {user?.nombreCompleto ? user.nombreCompleto.substring(0, 2).toUpperCase() : 'CO'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{user?.nombreCompleto || 'Coordinador STIMI'}</h4>
                    <span className="bg-green-100 text-green-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                      Coordinador
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
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className={`w-full h-12 rounded-xl flex items-center text-red-500 hover:text-red-700 hover:bg-red-55 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                isHovered ? 'px-4 justify-start gap-3' : 'justify-center'
              }`}
              title={!isHovered ? 'Cerrar Sesión' : undefined}
            >
              <FiLogOut className="w-5 h-5 flex-shrink-0" />
              {isHovered && (
                <span className="text-xs font-bold animate-fade-in">
                  Cerrar sesión
                </span>
              )}
            </button>
          </div>

        </aside>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sistema STIMI</span>
            <h1 className="text-sm font-bold text-gray-800 -mt-0.5">Centro de Servicios y Gestión Empresarial - Regional Antioquia</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">Coordinador Académico</p>
              <p className="text-sm font-bold text-gray-800">{user?.nombreCompleto || 'Coordinador STIMI'}</p>
            </div>
            <div className="w-10 h-10 bg-sena-green-light rounded-xl flex items-center justify-center text-sena-green font-bold shadow-sm">
              {user?.nombreCompleto ? user.nombreCompleto.substring(0, 2).toUpperCase() : 'CO'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

      </div>

      {/* Floating Action Buttons (FABs) in bottom right corner */}
      <NotificacionesFAB />
      <AsistenteFAB />

    </div>
  );
}
