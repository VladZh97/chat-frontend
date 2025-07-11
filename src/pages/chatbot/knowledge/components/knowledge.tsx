import { useQuery } from '@tanstack/react-query';
import EmptyState from './empty-state';
import Header from './header';
import { knowledge } from '@/api/knowledge';
import { useParams } from 'react-router-dom';

const Knowledge = () => {
  const { id: chatbotId } = useParams();
  const { data } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => knowledge.list(chatbotId as string),
    refetchOnWindowFocus: false,
  });
  return (
    <div className="px-8 pb-6">
      <Header />
      <EmptyState />
    </div>
  );
};

export default Knowledge;
