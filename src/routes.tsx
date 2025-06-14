import { createBrowserRouter } from 'react-router-dom';
import App from './app';
import { lazy, Suspense } from 'preact/compat';
import ProtectedRouteProvider from './providers/protected-route-provider';
import AuthRouteProvider from './providers/auth-route-provider';
const Signup = lazy(() => import('./pages/signup'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Login = lazy(() => import('./pages/login'));

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      // Protected routes
      {
        path: '/dashboard',
        element: (
          <ProtectedRouteProvider>
            <Suspense fallback>
              <Dashboard />
            </Suspense>
          </ProtectedRouteProvider>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthRouteProvider>
            <Suspense fallback>
              <Signup />
            </Suspense>
          </AuthRouteProvider>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthRouteProvider>
            <Suspense fallback>
              <Login />
            </Suspense>
          </AuthRouteProvider>
        ),
      },
      // {
      //   path: "plans",
      //   element: (
      //     <ProtectedRouteProvider>
      //       <BaseLayout>
      //         <Plans />
      //       </BaseLayout>
      //     </ProtectedRouteProvider>
      //   ),
      // },
      // {
      //   path: "employees",
      //   element: (
      //     <ProtectedRouteProvider>
      //       <BaseLayout>
      //         <Employees />
      //       </BaseLayout>
      //     </ProtectedRouteProvider>
      //   ),
      // },
      // {
      //   path: "editor/:id",
      //   element: (
      //     <ProtectedRouteProvider>
      //       <BaseLayout>
      //         <Editor />
      //       </BaseLayout>
      //     </ProtectedRouteProvider>
      //   ),
      // },
      // // Redirect to home
      // {
      //   path: "/editor",
      //   element: <Navigate to="/" replace />,
      // },
      // // Auth routes (public)
      // {
      //   path: "auth",
      //   element: (
      //     <AuthRouteProvider>
      //       <AuthLayout />
      //     </AuthRouteProvider>
      //   ),
      //   children: [
      //     { path: "login", Component: Login },
      //     { path: "signup", Component: Signup },
      //     { path: "", element: <Navigate to="/auth/login" replace /> },
      //   ],
      // },
      // // 404 page (public)
      // { path: "*", Component: NotFound },
    ],
  },
]);

export default router;
