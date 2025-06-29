import { Input, InputStyles } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { X } from 'lucide-react';

const ConverstationStarters = () => {
  const { conversationStarters, setChatbot } = useChatbotStoreShallow(s => ({
    conversationStarters: s.conversationStarters,
    setChatbot: s.setChatbot,
  }));

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      setChatbot({
        conversationStarters: [
          ...conversationStarters,
          { id: crypto.randomUUID(), value: target.value },
        ],
      });
      target.value = '';
    }
  };

  const handleRemoveStarter = (id: string) => {
    setChatbot({
      conversationStarters: conversationStarters.filter(starter => starter.id !== id),
    });
  };

  return (
    <div className="mb-6 border-b border-neutral-200 pb-6">
      <Label className="mb-2">Converstation starters</Label>
      <div className="space-y-3">
        {conversationStarters.map(starter => (
          <span
            key={starter}
            className={cn(InputStyles, 'relative grid h-11 items-center bg-white pr-8')}
          >
            <span className="truncate">{starter.value}</span>
            <span
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-neutral-500 transition-colors hover:text-neutral-700"
              onClick={() => handleRemoveStarter(starter.id)}
            >
              <X className="size-4" />
            </span>
          </span>
        ))}
        <Input className="h-11" onKeyDown={handleKeyDown} />
      </div>
    </div>
  );
};

export default ConverstationStarters;
