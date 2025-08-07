import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const CollectLeads = () => {
  const { collectLeads, setChatbot } = useChatbotStoreShallow(s => ({
    collectLeads: s.collectLeads,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-6">
      <Label>Collect leads</Label>
      <Switch
        checked={collectLeads}
        onCheckedChange={value => setChatbot({ collectLeads: value })}
      />
    </div>
  );
};

export default CollectLeads;
