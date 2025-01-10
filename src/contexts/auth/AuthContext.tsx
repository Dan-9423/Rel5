import { createStoreContext } from '@/lib/context/createStoreContext';
import { AuthState, AuthContextValue } from './types';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const [AuthStoreProvider, useAuthStore] = createStoreContext({
  name: 'Auth',
  initialState,
  persistKey: 'auth_state',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthStoreProvider>{children}</AuthStoreProvider>;
}

export function useAuth(): AuthContextValue {
  const [state, setState] = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      // Simulação de login
      const user = {
        id: '1',
        email,
        firstName: 'João',
        lastName: 'Silva',
        role: 'admin',
      };

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      navigate('/');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Falha ao fazer login',
      });
    }
  }, [state, setState, navigate]);

  const logout = useCallback(async () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    navigate('/auth');
  }, [setState, navigate]);

  const updateUser = useCallback(async (data: Partial<typeof state.user>) => {
    if (!state.user) return;

    setState({
      ...state,
      user: { ...state.user, ...data },
    });
  }, [state, setState]);

  return {
    ...state,
    login,
    logout,
    updateUser,
  };
}