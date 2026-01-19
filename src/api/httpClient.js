/**
 * HTTP Client Configuration
 * Based on mobile app httpClient.ts implementation
 */
import axios from 'axios';
import { config } from '../config';

// Token storage utility
const TOKEN_KEY = 'spark_auth_token';

export const tokenStorage = {
  get: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Create Auth API client
export const authApiClient = axios.create({
  baseURL: config.api.authBaseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Scooter/User API client
export const scooterApiClient = axios.create({
  baseURL: config.api.scooterBaseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically add Authorization header
const authInterceptor = (config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApiClient.interceptors.request.use(authInterceptor);
scooterApiClient.interceptors.request.use(authInterceptor);

// Response interceptor - handle 401 unauthorized errors
let unauthorizedHandler = null;

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const responseInterceptor = (error) => {
  if (error.response?.status === 401 && unauthorizedHandler) {
    unauthorizedHandler();
  }
  return Promise.reject(error);
};

authApiClient.interceptors.response.use((response) => response, responseInterceptor);
scooterApiClient.interceptors.response.use((response) => response, responseInterceptor);
