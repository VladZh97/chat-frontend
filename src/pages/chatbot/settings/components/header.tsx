import chatbot from '@/api/chatbot';
import { Button } from '@/components/ui/button';
import { useChatbotStore, useChatbotStoreShallow } from '@/store/chatbot.store';
import type { IChatbot } from '@/types/chatbot.type';
import { CodeXml, LoaderCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Header = () => {
  const { id } = useParams();
  const { name } = useChatbotStoreShallow(s => ({
    name: s.name,
  }));

  const { mutate: updateChatbot, isPending } = useMutation({
    mutationFn: (data: Partial<IChatbot>) => chatbot.update(id!, data),
    onSuccess: () => {
      toast.success('Chatbot updated successfully');
    },
  });

  const handleSave = () => {
    if (!name) return;
    const state = useChatbotStore.getState();
    const payload = Object.fromEntries(
      Object.entries(state).filter(([, value]) => typeof value !== 'function')
    );
    updateChatbot(payload);
  };

  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-6">
      <span className="max-w-1/2 truncate text-2xl font-medium text-neutral-900">
        {name} chatbot settings
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <CodeXml />
          Copy embed code
        </Button>
        <Button disabled={!name} onClick={handleSave} className={cn(isPending && 'cursor-default')}>
          {isPending && <LoaderCircle className="size-4 animate-spin" />}
          {isPending ? 'Saving changes...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
};

export default Header;
