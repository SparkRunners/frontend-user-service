/**
 * Authentication API
 * Authentication related API endpoints
 */
import { authApiClient, tokenStorage } from './httpClient';

/**
 * User login
 * @param {Object} credentials - { email: string, password: string }
 * @returns {Promise<{ token: string }>}
 */
export const login = async (credentials) => {
  const response = await authApiClient.post('/login', credentials);
  const { token } = response.data;
  
  // Save token
  if (token) {
    tokenStorage.set(token);
  }
  
  return response.data;
};

/**
 * User registration
 * @param {Object} userData - { username: string, email: string, password: string }
 * @returns {Promise<{ id: string, username: string, email: string, role: string[] }>}
 */
export const register = async (userData) => {
  const response = await authApiClient.post('/register', {
    ...userData,
    role: ['user'], // Default role
  });
  return response.data;
};

/**
 * User logout
 */
export const logout = () => {
  tokenStorage.remove();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!tokenStorage.get();
};

/**
 * Get current token
 */
export const getToken = () => {
  return tokenStorage.get();
};
