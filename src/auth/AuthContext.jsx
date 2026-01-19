/**
 * Auth Context - Authentication state management
 * Based on mobile app AuthProvider implementation
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, logout as apiLogout, getToken } from '../api/authApi';
import { registerUnauthorizedHandler } from '../api/httpClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Decode user info from JWT token
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        authenticated: true,
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize: check if there's a saved token
    const checkAuth = () => {
      const savedToken = getToken();
      if (savedToken) {
        const userInfo = decodeToken(savedToken);
        if (userInfo) {
          setToken(savedToken);
          setUser(userInfo);
        }
      }
      setIsReady(true);
    };

    checkAuth();

    // Register 401 unauthorized handler
    registerUnauthorizedHandler(() => {
      handleLogout();
    });
  }, []);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await apiLogin(credentials);
      const userInfo = decodeToken(data.token);
      if (userInfo) {
        setToken(data.token);
        setUser(userInfo);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiLogout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isReady,
    isLoading,
    isAuthenticated: !!token,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
