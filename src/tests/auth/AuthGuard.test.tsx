import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthGuard } from '@/features/auth/guards/AuthGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Mock do hook useAuth
jest.mock('@/features/auth/hooks/useAuth');

describe('AuthGuard', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar loading state quando está carregando', () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null
    });

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Conteúdo protegido</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar children quando autenticado', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { role: 'user' }
    });

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Conteúdo protegido</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument();
  });

  it('deve verificar roles quando especificadas', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { role: 'user' }
    });

    render(
      <MemoryRouter>
        <AuthGuard requiredRoles={['admin']}>
          <div>Conteúdo protegido</div>
        </AuthGuard>
      </MemoryRouter>
    );

    // Deve redirecionar para página não autorizada
    expect(screen.queryByText('Conteúdo protegido')).not.toBeInTheDocument();
  });
});