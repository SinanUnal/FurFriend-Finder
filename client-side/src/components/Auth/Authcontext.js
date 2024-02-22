import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adopterId, setAdopterId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setAdopterId(decoded.id);
      } else {
        setAdopterId(null);
      }
      setLoading(false);
    };
  
    // Call on mount
    handleTokenChange();
  
    // Setup event listener
    window.addEventListener('token-updated', handleTokenChange);
  
    // Cleanup
    return () => {
      window.removeEventListener('token-updated', handleTokenChange);
    };
  }, []);

 
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decoded = jwtDecode(token);
  //     setAdopterId(decoded.id);
  //   } else {
  //     setAdopterId(null);
  //   }
  //   setLoading(false);
  // }, []);

  // const updateAdopterId = (newId) => {
  //   setAdopterId(newId);
  // };





  return (
    <AuthContext.Provider value={{ adopterId, loading/*, updateAdopterId */}}>
      {children}
    </AuthContext.Provider>
  );
};
