import { useQuery } from '@tanstack/react-query';
import chatbot from '@/api/chatbot';
import { useParams } from 'react-router-dom';

const useGetChatbot = () => {
  const { id } = useParams();
  return useQuery({
    queryKey: ['chatbot', id],
    queryFn: () => chatbot.getById(id!),
  });
};

export default useGetChatbot;
