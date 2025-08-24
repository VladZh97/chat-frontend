import { Button } from '@/components/ui/button';
import LayoutWrapper from '@/components/animation-wrapper';
import Logo from '@/assets/logo-color.svg';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
      <LayoutWrapper className="text-center">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img
              src={Logo}
              alt="Heyway.chat Logo"
              className="mx-auto h-10"
              width="142"
              height="40"
            />
          </div>

          {/* 404 Number */}
          <div className="mb-4">
            <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold text-white">Page not found</h2>
            <p className="text-sm leading-relaxed text-white">
              Sorry, we couldn't find the page you're looking for. The page might have been removed,
              renamed, or doesn't exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full items-center justify-center gap-3">
            <Button onClick={() => navigate('/')} className="w-40">
              Go back home
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="w-40">
              Go back
            </Button>
          </div>

          {/* Support Link */}
          <div className="mt-8">
            <p className="text-xs text-white">
              Still need help?{' '}
              <a
                href="mailto:support@heyway.chat"
                className="text-orange-500 underline transition-colors hover:text-orange-600"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
};

export default NotFound;
