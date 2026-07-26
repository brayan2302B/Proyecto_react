import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

import api from '../services/api';
import axios from 'axios';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('stimi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      // Backend expects { username, password }
      const response = await api.post('/auth/login', {
        username: email,
        password: password,
      });

      const { token, user: apiUser } = response.data;

      // Save token to localStorage
      localStorage.setItem('stimi_token', token);

      const rolStr = typeof apiUser.rol === 'object' && apiUser.rol !== null
        ? apiUser.rol.nombre_rol
        : apiUser.rol;

      const areaStr = typeof apiUser.area === 'object' && apiUser.area !== null
        ? apiUser.area.nombre_area
        : apiUser.area;

      // Construct user data object, mapping fields for backward compatibility
      const userData = {
        id_usuario: apiUser.id_usuario,
        email: apiUser.correo,
        correo: apiUser.correo,
        nombreCompleto: apiUser.nombre_completo,
        rol: rolStr,
        role: rolStr, // Expose role for compatibility with existing components
        area: areaStr,
        documento: apiUser.numero_documento,
        tipo_documento: apiUser.tipo_documento,
        firma_digital_ruta: apiUser.firma_digital_ruta || '',
      };

      setUser(userData);
      localStorage.setItem('stimi_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error during login:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Correo, documento o contraseña incorrectos');
      }
      throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stimi_user');
    localStorage.removeItem('stimi_token');
  };

  const updateLocalUser = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('stimi_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}