import chatbot from '@/api/chatbot';
import TrainingStatusLabel from '@/components/training-status-label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatbotStore, useChatbotStoreShallow } from '@/store/chatbot.store';
import type { IChatbot } from '@/types/chatbot.type';
import { useMutation } from '@tanstack/react-query';
import { CodeXml, LoaderCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetChatbot } from '../../hooks';
import { copyEmbedCode } from '@/utils/copy-embed-code';

const Header = () => {
  const { id } = useParams();
  const { isLoading } = useGetChatbot();
  const { mutate: updateChatbot, isPending } = useMutation({
    mutationFn: (data: Partial<IChatbot>) => chatbot.update(id!, data),
    onSuccess: () => {
      toast.success('Chatbot updated successfully');
    },
  });
  const { name, accountId, _id } = useChatbotStoreShallow(s => ({
    name: s.name,
    accountId: s.accountId,
    _id: s._id,
  }));

  const handleSave = () => {
    const state = useChatbotStore.getState();
    const payload = Object.fromEntries(
      Object.entries(state).filter(([, value]) => typeof value !== 'function')
    );
    updateChatbot(payload);
  };

  return (
    <div className="grid grid-cols-[auto_auto] items-center justify-between border-b border-stone-200 px-8 py-6">
      <div className="grid grid-cols-[auto_auto] items-center gap-2.5">
        {isLoading ? (
          <span className="animate-pulse-fast h-3 w-1/3 rounded-full bg-stone-200"></span>
        ) : (
          <span className="block truncate text-2xl font-medium text-stone-900">
            {name} chatbot overview
          </span>
        )}
        <TrainingStatusLabel />
      </div>

      <div className="ml-10 flex items-center gap-2">
        <Button variant="outline" onClick={() => copyEmbedCode(accountId, _id)}>
          <CodeXml />
          Copy embed code
        </Button>
        <Button onClick={handleSave} className={cn(isPending && 'cursor-default')}>
          {isPending && <LoaderCircle className="size-4 animate-spin" />}
          {isPending ? 'Saving changes...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
};

export default Header;
