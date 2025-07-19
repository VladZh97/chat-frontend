import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Dialog from '@/components/ui/dialog';

const App = () => {
  return (
    <>
      <Outlet />
      <Toaster />
      <Dialog />
    </>
  );
};

export default App;
