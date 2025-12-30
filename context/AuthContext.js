import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // TODO: Connect to backend for real validation
    // MOCK VALIDATION
    if (email === 'admin' && password === 'admin') {
      setUser({ name: 'Administrador', role: 'admin' });
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: 'Credenciales incorrectas' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
