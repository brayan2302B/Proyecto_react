import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const MOCK_USERS = [
  {
    email: 'coordinador@sena.edu.co',
    password: '1234',
    role: 'coordinador',
    nombreCompleto: 'Coordinador STIMI'
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
            nombreCompleto: foundUser.nombreCompleto
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
