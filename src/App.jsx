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
                  <DashboardPlaceholder />
                </ProtectedRoute>
              }
            />

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
