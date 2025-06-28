import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import chatbot from '@/api/chatbot';
import { useNavigate } from 'react-router-dom';
import type { IChatbot } from '@/types/chatbot.type';
import CreateNewChatbot from '@/dialogs/create-new-chatbot';
import AddNewKnowledgeSource from '@/dialogs/add-new-knowledge-source';
import Sidebar from '@/components/sidebar';
import Main from './main';

const Home = () => {
  const navigate = useNavigate();
  // const { data: chatbots, isLoading } = useQuery({
  //   queryKey: ['chatbots'],
  //   queryFn: chatbot.get,
  // });
  // const { mutate: createChatbot } = useMutation({
  //   mutationFn: chatbot.create,
  //   onSuccess: (data: Pick<IChatbot, '_id'>) => {
  //     navigate(`/chatbot/${data._id}`);
  //   },
  // });

  return (
    <div className="relative flex h-screen bg-neutral-900">
      <Sidebar />
      <Main />
    </div>
  );
};

export default Home;
