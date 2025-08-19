import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { PLAN_NAMES } from '@/config';

const CollectLeads = () => {
  const navigate = useNavigate();
  const { plan } = useCurrentSubscription();
  const disabled = plan.title === PLAN_NAMES.FREE;
  const { collectLeads, setChatbot } = useChatbotStoreShallow(s => ({
    collectLeads: s.collectLeads,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-6">
      <Label>Collect leads</Label>
      <div className="flex items-center gap-4">
        {disabled && (
          <Button variant="outline" onClick={() => navigate('/subscription')}>
            <Gem className="size-4" />
            Upgrade now
          </Button>
        )}
        <Switch
          checked={collectLeads}
          onCheckedChange={value => {
            if (disabled) return;
            setChatbot({ collectLeads: value });
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default CollectLeads;
