import Stats from './stats';
import MessagesOverTimeChart from './messages-over-time-chart';
import LayoutWrapper from '@/components/animation-wrapper';

const UsageRoot = () => {
  return (
    <LayoutWrapper>
      <div className="px-8 py-6 text-2xl font-medium text-neutral-900">Usage</div>
      <div className="px-8 pb-8">
        <Stats />
        <MessagesOverTimeChart />
      </div>
    </LayoutWrapper>
  );
};

export default UsageRoot;
