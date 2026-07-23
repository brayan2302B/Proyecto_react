import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const MOCK_USERS = [
  {
    email: 'coordinador@sena.edu.co',
    password: '1234',
    role: 'coordinador',
    nombreCompleto: 'Ana María González',
    documento: '52887643',
    centro: 'Centro de Servicios y Gestión Empresarial - Regional Antioquia',
    vinculacion: 'Contratista - Desde Febrero 2024'
  },
  {
    email: 'instructor@sena.edu.co',
    password: '1234',
    role: 'instructor',
    nombreCompleto: 'Wilson Martínez'
  },
  {
    email: 'wilson.martinez@sena.edu.co',
    password: '1234',
    role: 'instructor',
    nombreCompleto: 'Wilson Martínez'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('stimi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (foundUser) {
          const userData = {
            email: foundUser.email,
            role: foundUser.role,
            nombreCompleto: foundUser.nombreCompleto,
            documento: foundUser.documento || '',
            centro: foundUser.centro || '',
            vinculacion: foundUser.vinculacion || ''
          };
          setUser(userData);
          localStorage.setItem('stimi_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Correo o contraseña incorrectos'));
        }
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stimi_user');
  };

  const changePassword = (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('No hay sesión activa'));
          return;
        }

        const foundUser = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );

        if (!foundUser) {
          reject(new Error('Usuario no encontrado'));
          return;
        }

        if (foundUser.password !== currentPassword) {
          reject(new Error('La contraseña actual es incorrecta'));
          return;
        }

        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        if (newPassword.length < 8 || !hasLetter || !hasNumber) {
          reject(new Error('La contraseña debe tener al menos 8 caracteres e incluir letras y números.'));
          return;
        }

        foundUser.password = newPassword;
        resolve();
      }, 1000);
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}