import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUserBalance, fillupBalance, getUserRides } from '../profileApi';
import { scooterApiClient } from '../httpClient';

vi.mock('../httpClient', () => ({
  scooterApiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('profileApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserBalance', () => {
    it('should fetch user balance', async () => {
      const mockBalance = { userId: '123', balance: 1000, currency: 'SEK' };
      scooterApiClient.get.mockResolvedValue({ data: mockBalance });

      const result = await getUserBalance('123');

      expect(scooterApiClient.get).toHaveBeenCalledWith('/users/123/balance');
      expect(result).toEqual(mockBalance);
    });
  });

  describe('fillupBalance', () => {
    it('should post fillup request and return updated balance', async () => {
      const mockResponse = { balance: 1050, transactionId: 'txn-123' };
      scooterApiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await fillupBalance('123', { amount: 50 });

      expect(scooterApiClient.post).toHaveBeenCalledWith('/users/123/fillup', {
        amount: 50,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserRides', () => {
    it('should fetch user rides with default options', async () => {
      const mockRides = { count: 2, trips: [{ id: '1' }, { id: '2' }] };
      scooterApiClient.get.mockResolvedValue({ data: mockRides });

      const result = await getUserRides();

      expect(scooterApiClient.get).toHaveBeenCalledWith('/rent/history?');
      expect(result).toEqual(mockRides);
    });

    it('should fetch user rides with limit and offset', async () => {
      const mockRides = { count: 10, trips: [] };
      scooterApiClient.get.mockResolvedValue({ data: mockRides });

      await getUserRides({ limit: 10, offset: 5 });

      expect(scooterApiClient.get).toHaveBeenCalledWith(
        '/rent/history?limit=10&offset=5'
      );
    });
  });
});
