import { type ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const AuthRouteProvider = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    loading: boolean;
    authenticated: boolean;
  }>({
    loading: true,
    authenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isLoggedIn();
        setAuthState({ loading: false, authenticated });
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthState({ loading: false, authenticated: false });
      }
    };

    checkAuth();
  }, []);

  if (authState.loading) return null;
  if (authState.authenticated) {
    const isAuthPage = ['/signup', '/login'].some(path => location.pathname.startsWith(path));
    if (isAuthPage && location.pathname !== '/') {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }
  return <>{children}</>;
};

export default AuthRouteProvider;
