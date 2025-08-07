import { useParams } from 'react-router-dom';
import KnowledgeTableHeader from './knowledge-table-header';
import KnowledgeTableMain from './knowledge-table-main';
import { useQuery } from '@tanstack/react-query';
import { knowledge } from '@/api/knowledge';
import EmptyState from './empty-state';
import { useState } from 'preact/hooks';
import { useSearchKnowledge } from '../../hooks';
import KnowledgeTableEmptySearch from './knowledge-table-empty-search';

const KnowledgeTable = () => {
  const [search, setSearch] = useState('');
  const { id: chatbotId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => knowledge.list(chatbotId as string),
  });

  const filteredData = useSearchKnowledge(data ?? [], search);
  if (!isLoading && !data?.length) return <EmptyState />;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-8 shadow">
      <KnowledgeTableHeader search={search} setSearch={setSearch} />
      {filteredData.length > 0 ? (
        <KnowledgeTableMain data={filteredData} isLoading={isLoading} />
      ) : (
        <KnowledgeTableEmptySearch setSearch={setSearch} />
      )}
    </div>
  );
};

export default KnowledgeTable;
