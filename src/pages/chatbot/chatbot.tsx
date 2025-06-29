import chatbot from '@/api/chatbot';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'preact/hooks';
import { useParams, Navigate, Outlet, useLocation } from 'react-router-dom';

const ROUTES = ['/knowledge', '/playground', '/settings', '/overview'];

const Chatbot = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const shouldRedirect = useMemo(() => !ROUTES.some(route => pathname.includes(route)), [pathname]);
  const { error } = useQuery({
    queryKey: ['chatbot', id],
    queryFn: () => chatbot.getById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (error && 'status' in error && error.status === 404) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
      {shouldRedirect && <Navigate to={`/chatbot/${id}/overview`} replace />}
    </>
  );
};

export default Chatbot;
