import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { Plus, X } from 'lucide-react';

const ConversationStarters = () => {
  const { conversationStarters, setChatbot } = useChatbotStoreShallow(s => ({
    conversationStarters: s.conversationStarters,
    setChatbot: s.setChatbot,
  }));

  const handleAddStarter = () => {
    setChatbot({
      conversationStarters: [...conversationStarters, { id: crypto.randomUUID(), value: '' }],
    });
  };

  const handleRemoveStarter = (id: string) => {
    setChatbot({
      conversationStarters: conversationStarters.filter(starter => starter.id !== id),
    });
  };
  return (
    <div className="mb-6 border-b border-stone-200 pb-6">
      <Label className="mb-2">Conversation starters</Label>
      <div className="space-y-3">
        {conversationStarters.map(starter => (
          <div key={starter.id} className="relative">
            <Input
              className="h-11"
              value={starter.value}
              onChange={e =>
                setChatbot({
                  conversationStarters: conversationStarters.map(s =>
                    s.id === starter.id ? { ...s, value: (e.target as HTMLInputElement).value } : s
                  ),
                })
              }
            />
            <span
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-stone-500 transition-colors hover:text-stone-700"
              onClick={() => handleRemoveStarter(starter.id)}
            >
              <X className="size-4" />
            </span>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4" onClick={handleAddStarter}>
        <Plus />
        Add message
      </Button>
    </div>
  );
};

export default ConversationStarters;
