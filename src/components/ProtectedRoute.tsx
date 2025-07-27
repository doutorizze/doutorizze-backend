import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user } = useStore();

  // Se não há usuário logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer admin e o usuário não é admin, redireciona para dashboard apropriado
  if (requireAdmin && user.type !== 'admin') {
    const redirectPath = user.type === 'clinic' ? '/clinic-dashboard' : '/patient-area';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}