import Header from './header';
import KnowledgeTable from './knowledge-table';
import { useGetChatbot } from '../../hooks';

const Knowledge = () => {
  const { isLoading } = useGetChatbot();
  if (isLoading) return null;
  return (
    <div className="px-8 pb-6">
      <Header />
      <KnowledgeTable />
    </div>
  );
};

export default Knowledge;
