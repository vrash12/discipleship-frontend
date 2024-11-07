import React, { useState, createContext } from 'react';

export const UserContext = createContext(); // Create the context

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // 'admin' or 'user'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};