import LayoutWrapper from '@/components/animation-wrapper';
import CurrentPlanCard from './current-plan-card';
import PlanFeaturesCard from './plan-features-card';
import PlansTable from './plans-table';

const SubscriptionRoot = () => {
  return (
    <LayoutWrapper>
      <div className="px-8 py-6 text-2xl font-medium text-stone-900">Manage subscription</div>
      <div className="grid grid-cols-2 gap-4 px-8 pt-1 pb-8">
        <CurrentPlanCard />
        <PlanFeaturesCard />
      </div>
      <PlansTable />
    </LayoutWrapper>
  );
};

export default SubscriptionRoot;
