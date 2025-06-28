import { render } from 'preact';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import router from './routes.tsx';
import AuthProvider from './providers/auth-provider.tsx';
import queryClient from './lib/query.ts';

render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>,
  document.getElementById('app')!
);
