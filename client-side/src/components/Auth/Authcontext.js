import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adopterId, setAdopterId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setAdopterId(decoded.id);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ adopterId }}>
      {children}
    </AuthContext.Provider>
  );
};
