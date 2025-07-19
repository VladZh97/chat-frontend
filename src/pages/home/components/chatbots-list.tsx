import { Button } from '@/components/ui/button';
import CreateNewChatbot from '@/dialogs/create-new-chatbot';
import { Bot, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import chatbot from '@/api/chatbot';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'preact/hooks';
import { useDialog } from '@/hooks';

const ChatbotsList = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { data: chatbots, isLoading } = useQuery({
    queryKey: ['chatbots'],
    queryFn: () => chatbot.get(),
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
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
          <Bot className="size-4 text-neutral-500" />
          Chatbots
        </div>
        <Button variant="outline" size="xs" onClick={handleCreateNewChatbot}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {chatbots?.map(chatbot => (
          <div className="group cursor-pointer">
            <div
              onClick={() => handleChatbotClick(chatbot._id)}
              className="relative flex h-40 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow transition-all duration-300 group-hover:shadow-lg"
            >
              {chatbot.avatarIcon ? (
                <img
                  src={chatbot.avatarIcon}
                  alt={chatbot.name}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <Bot className="size-8 text-neutral-900" />
              )}
              <span
                className="absolute inset-0 block size-full rounded-xl border-b-2 border-neutral-900"
                style={{ borderColor: chatbot.accentColor }}
              ></span>
            </div>
            <span className="mt-3 block text-sm font-medium text-neutral-900">{chatbot.name}</span>
          </div>
        ))}
        {isLoading && <Skeleton />}
        {!isLoading && !chatbots?.length && (
          <div
            className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-500 shadow transition-all duration-300 hover:shadow-lg"
            onClick={handleCreateNewChatbot}
          >
            <Plus className="mb-4 size-8 text-neutral-500" />
            Add your first chatbot
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
      <div className="relative flex h-40 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 shadow transition-all duration-300 group-hover:shadow-lg">
        <Bot className="size-8 text-neutral-900" />
      </div>
      <div className="mt-3 flex h-5 items-center">
        <span className="block h-1.5 rounded-full bg-neutral-200" style={{ width: `${w}%` }} />
      </div>
    </div>
  ));
};
