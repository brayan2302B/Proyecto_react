import React, { useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiHome, FiFileText, FiSettings, FiUser, FiBell, FiLogOut, FiCheckSquare } from 'react-icons/fi';
import logoSena from '../assets/logo-sena.png';
import NotificacionesPanel from '../components/NotificacionesPanel';
import AsistenteWidget from '../components/AsistenteWidget';

export default function InstructorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellFabRef = useRef(null);

  const navItems = [
    { name: 'Inicio', path: '/instructor/dashboard', icon: FiHome },
    { name: 'Período Actual', path: '/instructor/periodo-actual', icon: FiCheckSquare },
    { name: 'Historial', path: '/instructor/informes', icon: FiFileText },
    { name: 'Configuración', path: '/instructor/configuracion', icon: FiSettings },
    { name: 'Perfil', path: '/instructor/perfil', icon: FiUser },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              <p className="text-xs text-gray-500 font-medium">Instructor</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden ${
                    isActive 
                      ? 'bg-green-50 text-[#407754]' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={item.name}
                >
                  <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-[#407754]' : ''}`} />
                  <span className={`ml-4 text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section — only Logout now */}
        <div className="p-3 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 overflow-hidden"
            title="Cerrar Sesión"
          >
            <FiLogOut className="w-6 h-6 shrink-0" />
            <div className="ml-4 flex flex-col items-start whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <span className="text-xs text-gray-400 font-medium truncate w-32 text-left">{user?.nombreCompleto || 'Instructor'}</span>
              <span className="text-sm font-bold">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50">
        <Outlet />
      </main>

      {/* Floating Bubbles Column — bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        
        {/* Notification FAB */}
        <div className="relative" ref={bellFabRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isNotifOpen ? 'bg-gray-800' : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
            title="Notificaciones"
          >
            <FiBell className={`w-6 h-6 ${isNotifOpen ? 'text-white' : 'text-gray-600'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel — anchored above the FAB */}
          <NotificacionesPanel
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            anchorRef={bellFabRef}
            onUnreadChange={setUnreadCount}
          />
        </div>

        {/* AI Assistant FAB */}
        <AsistenteWidget />
      </div>

    </div>
  );
}
