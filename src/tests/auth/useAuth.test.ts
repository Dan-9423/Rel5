import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/authService';

// Mock do authService
jest.mock('@/features/auth/services/authService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  refreshSession: jest.fn()
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer login com sucesso', async () => {
    const mockUser = {
      id: '1',
      email: 'teste@exemplo.com',
      role: 'user'
    };

    (authService.login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      error: null
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('teste@exemplo.com', 'senha123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro de login', async () => {
    const mockError = new Error('Credenciais inválidas');

    (authService.login as jest.Mock).mockResolvedValueOnce({
      user: null,
      error: mockError
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('teste@exemplo.com', 'senha-errada');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(mockError.message);
  });

  it('deve fazer logout com sucesso', async () => {
    (authService.logout as jest.Mock).mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});