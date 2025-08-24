import Board from '@/components/board';
import Sidebar from '@/components/sidebar';
import SmallScreenOverlay from '@/components/small-screen-overlay';
import ErrorBoundary from '@/components/error-boundary';
import { useScreenSize } from '@/hooks';
import { Outlet, useLocation } from 'react-router-dom';

const BaseLayout = () => {
  const location = useLocation();
  const isSmallScreen = useScreenSize();

  const isExcludedRoute =
    ['/signup', '/login'].includes(location.pathname) || location.pathname.startsWith('/widget/');

  const shouldShowOverlay = isSmallScreen && !isExcludedRoute;
  return (
    <div className="relative flex h-screen bg-stone-950">
      <Sidebar />
      <ErrorBoundary>
        <Board>
          <Outlet />
        </Board>
      </ErrorBoundary>
      {shouldShowOverlay && <SmallScreenOverlay />}
    </div>
  );
};

export default BaseLayout;
