import Header from './header';
import KnowledgeTable from './knowledge-table';
import LayoutWrapper from '@/components/animation-wrapper';
import Wrapper from '../../components/wrapper';

const Knowledge = () => {
  return (
    <Wrapper>
      <LayoutWrapper className="px-8 pb-6">
        <Header />
        <KnowledgeTable />
      </LayoutWrapper>
    </Wrapper>
  );
};

export default Knowledge;
