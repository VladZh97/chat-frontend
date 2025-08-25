import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const InitialMessage = () => {
  const { initialMessage, setChatbot } = useChatbotStoreShallow(s => ({
    initialMessage: s.initialMessage,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6">
      <Label className="mb-2">Welcome message</Label>
      <Input
        className="h-10"
        value={initialMessage}
        onChange={e => setChatbot({ initialMessage: (e.target as HTMLInputElement).value })}
      />
    </div>
  );
};

export default InitialMessage;
