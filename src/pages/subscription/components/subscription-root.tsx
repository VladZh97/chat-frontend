import CurrentPlanCard from './current-plan-card';
import PlanFeaturesCard from './plan-features-card';

const SubscriptionRoot = () => {
  return (
    <>
      <div className="px-8 py-6 text-2xl font-medium text-neutral-900">Subscription</div>
      <div className="grid grid-cols-2 gap-4 px-8 pt-1 pb-8">
        <CurrentPlanCard />
        <PlanFeaturesCard />
      </div>
    </>
  );
};

export default SubscriptionRoot;
