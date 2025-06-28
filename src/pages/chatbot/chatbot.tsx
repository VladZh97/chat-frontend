import { useMemo } from 'preact/hooks';
import { useParams, Navigate, Outlet, useLocation } from 'react-router-dom';

const ROUTES = ['/knowledge', '/playground', '/settings', '/overview'];

const Chatbot = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const shouldRedirect = useMemo(() => !ROUTES.some(route => pathname.includes(route)), [pathname]);

  return (
    <>
      <Outlet />
      {shouldRedirect && <Navigate to={`/chatbot/${id}/overview`} replace />}
    </>
  );
};

export default Chatbot;
