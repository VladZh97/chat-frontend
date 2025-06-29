import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const Branding = () => {
  const { removeBranding, setChatbot } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-6">
      <Label>Remove Czat.io branding</Label>
      <Switch
        checked={removeBranding}
        onCheckedChange={value => setChatbot({ removeBranding: value })}
      />
    </div>
  );
};

export default Branding;
