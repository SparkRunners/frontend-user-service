/**
 * Application Configuration
 * Environment variable configuration, consistent with mobile app
 */

export const config = {
  api: {
    authBaseUrl: import.meta.env.VITE_AUTH_API_URL || '/api/auth',
    scooterBaseUrl: import.meta.env.VITE_SCOOTER_API_URL || '/api/v1',
    timeout: 10000, // 10 seconds
  },
  oauth: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    },
    github: {
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    },
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'SparkRunner',
    frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  },
};
