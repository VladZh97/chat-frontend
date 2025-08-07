import Board from '@/components/board';
import Sidebar from '@/components/sidebar';
import { Outlet } from 'react-router-dom';

const BaseLayout = () => {
  return (
    <div className="relative flex h-screen bg-stone-950">
      <Sidebar />
      <Board>
        <Outlet />
      </Board>
    </div>
  );
};

export default BaseLayout;
