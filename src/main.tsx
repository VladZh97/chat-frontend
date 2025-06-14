import { render } from 'preact';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import router from './routes.tsx';
import AuthProvider from './providers/auth-provider.tsx';
const queryClient = new QueryClient();

render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>,
  document.getElementById('app')!
);
