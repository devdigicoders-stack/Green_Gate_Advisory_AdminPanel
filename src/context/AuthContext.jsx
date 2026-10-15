import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getSession();
      if (res.success && res.admin) {
        setAdmin(res.admin);
      } else {
        setAdmin(null);
      }
    } catch (err) {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (usernameOrEmail, password) => {
    setError(null);
    try {
      const res = await api.login(usernameOrEmail, password);
      if (res.success && res.admin) {
        setAdmin(res.admin);
        return res;
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setAdmin(null);
    }
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    error,
    login,
    logout,
    checkSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
