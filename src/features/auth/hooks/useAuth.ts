import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '@/stores/authStore';

const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutos

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useAuthStore();

  const refreshToken = useCallback(async () => {
    const { session, error } = await authService.refreshSession();
    if (error || !session) {
      setState({ user: null, isAuthenticated: false, error: error?.message || 'Sessão expirada' });
      navigate('/auth');
    }
  }, [setState, navigate]);

  useEffect(() => {
    const interval = setInterval(refreshToken, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshToken]);

  const login = useCallback(async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    
    const { user, error } = await authService.login(email, password);
    
    if (error || !user) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error?.message || 'Erro ao fazer login'
      });
      return;
    }

    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });

    navigate('/');
  }, [state, setState, navigate]);

  const logout = useCallback(async () => {
    const { error } = await authService.logout();
    
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: error?.message || null
    });

    navigate('/auth');
  }, [setState, navigate]);

  return {
    ...state,
    login,
    logout,
    refreshToken
  };
}