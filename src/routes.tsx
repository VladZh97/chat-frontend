import { createBrowserRouter } from 'react-router-dom';
import App from './app';
import { lazy, Suspense } from 'preact/compat';
import ProtectedRouteProvider from './providers/protected-route-provider';
import AuthRouteProvider from './providers/auth-route-provider';
import BaseLayout from './layouts/base.layout';
const Auth = lazy(() => import('./pages/auth'));
const Home = lazy(() => import('./pages/home'));
const Chatbot = lazy(() => import('./pages/chatbot'));
const Overview = lazy(() => import('./pages/chatbot/overview'));
const Knowledge = lazy(() => import('./pages/chatbot/knowledge'));
const Playground = lazy(() => import('./pages/chatbot/playground'));
const Settings = lazy(() => import('./pages/chatbot/settings'));

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/signup',
        element: (
          <AuthRouteProvider>
            <Suspense fallback>
              <Auth />
            </Suspense>
          </AuthRouteProvider>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthRouteProvider>
            <Suspense fallback>
              <Auth login />
            </Suspense>
          </AuthRouteProvider>
        ),
      },
      {
        element: (
          <ProtectedRouteProvider>
            <BaseLayout />
          </ProtectedRouteProvider>
        ),
        children: [
          {
            path: '/',
            element: (
              <Suspense fallback>
                <Home />
              </Suspense>
            ),
          },
          {
            path: '/chatbot/:id',
            element: (
              <Suspense fallback>
                <Chatbot />
              </Suspense>
            ),
            children: [
              {
                path: '/chatbot/:id/knowledge',
                element: (
                  <Suspense fallback>
                    <Knowledge />
                  </Suspense>
                ),
              },
              {
                path: '/chatbot/:id/playground',
                element: (
                  <Suspense fallback>
                    <Playground />
                  </Suspense>
                ),
              },
              {
                path: '/chatbot/:id/settings',
                element: (
                  <Suspense fallback>
                    <Settings />
                  </Suspense>
                ),
              },
              {
                path: '/chatbot/:id/overview',
                element: (
                  <Suspense fallback>
                    <Overview />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // // 404 page (public)
      // { path: "*", Component: NotFound },
    ],
  },
]);

export default router;
