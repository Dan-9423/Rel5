import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from '@/components/common/LoadingState';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: location } });
      return;
    }

    if (user && requiredRoles && !requiredRoles.includes(user.role)) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, navigate, location]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}