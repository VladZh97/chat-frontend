import { Button, buttonVariants } from '@/components/ui/button';
import CreateNewChatbot from '@/dialogs/create-new-chatbot';
import { cn } from '@/lib/utils';
import { Bot, Plus } from 'lucide-react';

const ChatbotsList = () => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
          <Bot className="size-4 text-neutral-500" />
          Chatbots
        </div>
        <CreateNewChatbot className="cursor-pointer">
          <span className={cn(buttonVariants({ variant: 'outline', size: 'xs' }))}>
            <Plus className="size-4" />
            Add new
          </span>
        </CreateNewChatbot>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {/* <div className="group cursor-pointer">
          <div className="relative flex h-40 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow transition-all duration-300 group-hover:shadow-lg">
            <Bot className="size-8 text-neutral-900" />
            <span className="absolute inset-0 block size-full rounded-xl border-b-2 border-[#DF0101]"></span>
          </div>
          <span className="mt-3 block text-sm font-medium text-neutral-900">
            MediaMarkt chatbot
          </span>
        </div> */}
        <CreateNewChatbot>
          <div className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-500 shadow transition-all duration-300 hover:shadow-lg">
            <Plus className="mb-4 size-8 text-neutral-500" />
            Add your first chatbot
          </div>
        </CreateNewChatbot>
      </div>
    </div>
  );
};

export default ChatbotsList;
