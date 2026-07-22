import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider, AuthContext } from './components/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Registro from './pages/Registro';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import InstructorLayout from './layouts/InstructorLayout';
import Dashboard from './pages/instructor/Dashboard';
import MisInformes from './pages/instructor/MisInformes';
import Configuracion from './pages/instructor/Configuracion';

import PeriodoActual from './pages/instructor/PeriodoActual';
import Perfil from './pages/instructor/Perfil';
import { useAuth } from './hooks/useAuth';

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={`/${user.role}`} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/registro" element={<Registro />} />

            {/* Protected Instructor Route */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="informes" element={<MisInformes />} />
              <Route path="periodo-actual" element={<PeriodoActual />} />
              <Route path="configuracion" element={<Configuracion />} />

              <Route path="perfil" element={<Perfil />} />
            </Route>

            {/* Protected Coordinador Route */}
            <Route
              path="/coordinador"
              element={
                <ProtectedRoute allowedRoles={['coordinador']}>
                  <DashboardPlaceholder />
                </ProtectedRoute>
              }
            />

            {/* Root & Fallback redirects */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
