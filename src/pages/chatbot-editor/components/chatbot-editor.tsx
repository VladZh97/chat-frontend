import { useParams } from 'react-router-dom';

import chatbot from '@/api/chatbot';
import { useQuery } from '@tanstack/react-query';
import type { IChatbot } from '@/types/chatbot.type';
import WebsiteCard from './website-card';

const ChatbotEditor = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery<IChatbot>({
    queryKey: ['chatbot', id],
    queryFn: () => chatbot.getById(id as string),
  });
  return (
    <>
      {isLoading ? <div>Loading...</div> : <div>{data?.name}</div>}
      <WebsiteCard />
    </>
  );
};

export default ChatbotEditor;
