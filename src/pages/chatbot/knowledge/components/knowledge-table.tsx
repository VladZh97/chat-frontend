import { useParams } from 'react-router-dom';
import KnowledgeTableHeader from './knowledge-table-header';
import KnowledgeTableMain from './knowledge-table-main';
import { useQuery } from '@tanstack/react-query';
import { knowledge } from '@/api/knowledge';
import EmptyState from './empty-state';

const KnowledgeTable = () => {
  const { id: chatbotId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => knowledge.list(chatbotId as string),
  });
  if (!isLoading && !data?.length) return <EmptyState />;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow">
      <KnowledgeTableHeader />
      <KnowledgeTableMain data={data} isLoading={isLoading} />
    </div>
  );
};

export default KnowledgeTable;
