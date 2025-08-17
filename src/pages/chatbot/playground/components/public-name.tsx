import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

export const PublicName = () => {
  const { publicName, setChatbot } = useChatbotStoreShallow(s => ({
    publicName: s.publicName,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6">
      <Label className="mb-2">Display name</Label>
      <Input
        className="h-10"
        value={publicName}
        onChange={e => setChatbot({ publicName: (e.target as HTMLInputElement).value })}
      />
    </div>
  );
};
