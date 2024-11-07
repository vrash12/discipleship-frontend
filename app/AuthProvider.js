// app/AuthProvider.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    userRole: null,
    token: null,
  });

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');

        if (token && role) {
          setAuthState({
            isLoading: false,
            isLoggedIn: true,
            userRole: role,
            token: token,
          });
        } else {
          setAuthState({
            isLoading: false,
            isLoggedIn: false,
            userRole: null,
            token: null,
          });
        }
      } catch (e) {
        console.error(e);
        setAuthState({
          isLoading: false,
          isLoggedIn: false,
          userRole: null,
          token: null,
        });
      }
    };

    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
