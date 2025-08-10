import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PLAN_NAMES } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { Gem } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Branding = () => {
  const navigate = useNavigate();
  const { plan } = useCurrentSubscription();
  const { removeBranding, setChatbot } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
    setChatbot: s.setChatbot,
  }));

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <Label>Remove Heyway branding</Label>
      <div className="flex items-center gap-4">
        {plan.title === PLAN_NAMES.FREE && (
          <Button variant="outline" onClick={handleUpgrade}>
            <Gem className="size-4" />
            Upgrade now
          </Button>
        )}
        <Switch
          checked={removeBranding}
          onCheckedChange={value => setChatbot({ removeBranding: value })}
        />
      </div>
    </div>
  );
};

export default Branding;
