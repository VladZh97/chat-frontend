import Header from './header';
import KnowledgeTable from './knowledge-table';
import { useGetChatbot } from '../../hooks';
import LayoutWrapper from '@/components/animation-wrapper';

const Knowledge = () => {
  const { isLoading } = useGetChatbot();
  if (isLoading) return null;
  return (
    <LayoutWrapper className="px-8 pb-6">
      <Header />
      <KnowledgeTable />
    </LayoutWrapper>
  );
};

export default Knowledge;
