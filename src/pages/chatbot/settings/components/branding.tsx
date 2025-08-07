import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const Branding = () => {
  const { removeBranding, setChatbot } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6 flex items-center justify-between">
      <Label>Remove heyway.chat branding</Label>
      <Switch
        checked={removeBranding}
        onCheckedChange={value => setChatbot({ removeBranding: value })}
      />
    </div>
  );
};

export default Branding;
