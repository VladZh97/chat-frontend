import { useQuery } from '@tanstack/react-query';
import EmptyState from './empty-state';
import Header from './header';
import { knowledge } from '@/api/knowledge';
import { useParams } from 'react-router-dom';
import KnowledgeTable from './knowledge-table';

const Knowledge = () => {
  return (
    <div className="px-8 pb-6">
      <Header />
      <KnowledgeTable />
    </div>
  );
};

export default Knowledge;
