/**
 * Profile API
 * User profile, balance, and trip history related APIs
 */
import { scooterApiClient } from './httpClient';

/**
 * Get user balance
 * @param {string} userId
 * @returns {Promise<{ balance: number, currency: string }>}
 */
export const getUserBalance = async (userId) => {
  const response = await scooterApiClient.get(`/users/${userId}/balance`);
  return response.data;
};

/**
 * Top up balance
 * @param {string} userId
 * @param {Object} fillupData - { amount: number, paymentMethod?: string }
 * @returns {Promise<{ balance: number, transactionId: string }>}
 */
export const fillupBalance = async (userId, fillupData) => {
  const response = await scooterApiClient.post(`/users/${userId}/fillup`, fillupData);
  return response.data;
};

/**
 * Get trip history - uses backend /rent/history endpoint
 * Backend automatically extracts userId from JWT token
 * @param {Object} options - { limit?: number, offset?: number }
 * @returns {Promise<{ count: number, trips: Array }>}
 */
export const getUserRides = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);
  
  const response = await scooterApiClient.get(`/rent/history?${params}`);
  return response.data;
};

/**
 * Get user profile
 * @param {string} userId
 * @returns {Promise<{ id: string, username: string, email: string }>}
 */
export const getUserProfile = async (userId) => {
  const response = await scooterApiClient.get(`/users/${userId}`);
  return response.data;
};
