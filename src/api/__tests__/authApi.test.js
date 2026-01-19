import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register, logout, isAuthenticated, getToken } from '../authApi';
import { authApiClient, tokenStorage } from '../httpClient';

vi.mock('../httpClient', () => ({
  authApiClient: {
    post: vi.fn(),
  },
  tokenStorage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call API and store token on success', async () => {
      const mockToken = 'test-token-123';
      const mockResponse = { data: { token: mockToken } };
      authApiClient.post.mockResolvedValue(mockResponse);

      const credentials = { email: 'test@test.com', password: 'Test123!' };
      const result = await login(credentials);

      expect(authApiClient.post).toHaveBeenCalledWith('/login', credentials);
      expect(tokenStorage.set).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw error on failed login', async () => {
      authApiClient.post.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        login({ email: 'wrong@test.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should call API with user data and default role', async () => {
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@test.com',
          role: ['user'],
        },
      };
      authApiClient.post.mockResolvedValue(mockResponse);

      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'Test123!',
      };
      const result = await register(userData);

      expect(authApiClient.post).toHaveBeenCalledWith('/register', {
        ...userData,
        role: ['user'],
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should remove token from storage', () => {
      logout();
      expect(tokenStorage.remove).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      tokenStorage.get.mockReturnValue('test-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      tokenStorage.get.mockReturnValue(null);
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token from storage', () => {
      const mockToken = 'test-token-123';
      tokenStorage.get.mockReturnValue(mockToken);
      expect(getToken()).toBe(mockToken);
    });
  });
});
