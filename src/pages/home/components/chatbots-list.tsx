import { Button } from '@/components/ui/button';
import CreateNewChatbot from '@/dialogs/create-new-chatbot';
import { ArrowLeft, Bot, Ellipsis, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import chatbot from '@/api/chatbot';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'preact/hooks';
import { useDialog } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'preact/compat';

const ChatbotsList = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { data: chatbots, isLoading } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });

  const handleChatbotClick = useCallback(
    (id: string) => {
      navigate(`/chatbot/${id}`);
    },
    [navigate]
  );

  const handleCreateNewChatbot = useCallback(() => {
    showDialog(CreateNewChatbot.id, CreateNewChatbot);
  }, [showDialog]);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-stone-900">
          <Bot className="size-4 text-stone-500" />
          Chatbots
        </div>
        <Button variant="outline" onClick={handleCreateNewChatbot}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {chatbots?.map(chatbot => (
          <div className="group cursor-pointer">
            <div
              style={{ '--accent-color': chatbot.accentColor || '#FF6900' } as CSSProperties}
              onClick={() => handleChatbotClick(chatbot._id)}
              className={cn(
                'relative flex items-center justify-center overflow-hidden rounded-xl border-b-2 pt-[54.44%] shadow transition-all duration-300 group-hover:shadow-lg',
                `border-[var(--accent-color)] bg-[var(--accent-color)]/10`
              )}
            >
              <ChatbotPreview />
            </div>
            <span className="mt-3 block truncate text-sm font-medium text-stone-900">
              {chatbot.name}
            </span>
          </div>
        ))}
        {isLoading && <Skeleton />}
        {!isLoading && !chatbots?.length && (
          <div
            className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-stone-200 bg-white pt-[54.44%] text-sm text-stone-500 shadow transition-all duration-300 hover:shadow-lg"
            onClick={handleCreateNewChatbot}
          >
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
              <Plus className="mb-4 size-8 text-stone-500" />
              Add your first chatbot
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotsList;

const Skeleton = () => {
  const width = useMemo(
    () => Array.from({ length: 3 }).map(() => Math.floor(Math.random() * 80) + 10),
    []
  );
  return width.map((w, index) => (
    <div key={index} className="group animate-pulse-fast">
      <div className="relative flex h-40 items-center justify-center rounded-xl border border-stone-200 bg-stone-100 shadow transition-all duration-300 group-hover:shadow-lg">
        <Bot className="size-8 text-stone-900" />
      </div>
      <div className="mt-3 flex h-5 items-center">
        <span className="block h-1.5 rounded-full bg-stone-200" style={{ width: `${w}%` }} />
      </div>
    </div>
  ));
};

const ChatbotPreview = () => {
  return (
    <div className="absolute top-4 left-1/2 h-[200%] w-full -translate-x-1/2 px-12">
      <div className="mx-auto h-full w-full max-w-[224px] rounded-xl bg-white px-2 py-3 shadow">
        <div className="mb-4 flex items-center justify-between">
          <ArrowLeft className="size-2.5 text-stone-700" />
          <span className="text-[9px] font-medium text-stone-900">New chat</span>
          <Ellipsis className="size-2.5 text-stone-700" />
        </div>
        <div className="mb-3 flex items-end gap-1">
          <span className="size-3 overflow-hidden rounded-full bg-[var(--accent-color)]"></span>
          <span className="block h-6 w-[89px] rounded-md bg-[var(--accent-color)]/10"></span>
        </div>
        <div className="flex justify-end">
          <span className="block h-6 w-[100px] rounded-md rounded-br-none bg-[var(--accent-color)] shadow-sm"></span>
        </div>
      </div>
    </div>
  );
};
