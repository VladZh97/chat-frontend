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
  const disabled = plan.title === PLAN_NAMES.FREE;
  const { removeBranding, setChatbot } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
    setChatbot: s.setChatbot,
  }));

  return (
    <div className="mb-6 flex items-center justify-between">
      <Label>Remove Heyway branding</Label>
      <div className="flex items-center gap-4">
        {disabled && (
          <Button variant="outline" onClick={() => navigate('/subscription')}>
            <Gem className="size-4" />
            Upgrade now
          </Button>
        )}
        <Switch
          checked={removeBranding}
          onCheckedChange={value => {
            if (disabled) return;
            setChatbot({ removeBranding: value });
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Branding;
