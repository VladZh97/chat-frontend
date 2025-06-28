import Board from '@/components/board';
import Sidebar from '@/components/sidebar';
import { Navigate, Outlet, useParams } from 'react-router';

const Chatbot = () => {
  const { id } = useParams();
  return (
    <div className="relative flex h-screen bg-neutral-900">
      <Sidebar />
      <Board>
        <Outlet />
        <Navigate to={`/chatbot/${id}/overview`} replace />
      </Board>
    </div>
  );
};

export default Chatbot;
