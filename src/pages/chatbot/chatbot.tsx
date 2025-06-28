import { useParams, Navigate, Outlet } from 'react-router-dom';

const Chatbot = () => {
  const { id } = useParams();

  return (
    <>
      <Outlet />
      <Navigate to={`/chatbot/${id}/overview`} replace />
    </>
  );
};

export default Chatbot;
