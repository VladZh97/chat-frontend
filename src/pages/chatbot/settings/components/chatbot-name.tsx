import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const ChatbotName = () => {
  const { name, setChatbot } = useChatbotStoreShallow(s => ({
    name: s.name,
    setChatbot: s.setChatbot,
  }));

  return (
    <div className="mb-6">
      <Label className="mb-2">Chatbot name</Label>
      <Input
        className={cn('h-10', !name && 'border-red-500 bg-red-100 text-red-500')}
        value={name}
        onChange={e => setChatbot({ name: (e.target as HTMLInputElement).value })}
      />
      {!name && <span className="text-[10px]/none text-red-500">Chatbot name is required</span>}
    </div>
  );
};

export default ChatbotName;
