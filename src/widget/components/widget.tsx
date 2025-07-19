import { ArrowLeft, ArrowUp, Bot, Ellipsis } from 'lucide-react';
import PoveredBy from '@/assets/povered-by.svg?react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const Widget = () => {
  const { removeBranding, accentColor, avatarIcon, initialMessage } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
    accentColor: s.accentColor,
    backgroundColor: s.backgroundColor,
    avatarIcon: s.avatarIcon,
    initialMessage: s.initialMessage,
  }));
  return (
    <div className="mx-auto flex w-full max-w-[416px] grow flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative flex items-center justify-between px-4 pt-6 pb-6">
        <ArrowLeft className="size-4 cursor-pointer text-neutral-700" />
        <span className="absolute left-1/2 -translate-x-1/2 text-lg font-medium text-neutral-900">
          New chat
        </span>
        <Ellipsis className="size-4 cursor-pointer text-neutral-700" />
      </div>
      <ScrollArea className="h-[calc(100vh-400px)] max-h-[500px] grow">
        <div className="space-y-6 p-4">
          {initialMessage && (
            <div className="flex items-end gap-2">
              {avatarIcon ? (
                <img
                  src={avatarIcon}
                  alt=""
                  className="size-6 overflow-hidden rounded-full object-cover"
                />
              ) : (
                <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Bot className="size-3" />
                </span>
              )}
              <div className="flex flex-col gap-1">
                <span
                  className="block rounded-xl px-4 py-3 text-sm font-normal text-neutral-900 last:rounded-bl-none"
                  style={{ backgroundColor: `${accentColor}1A` }}
                >
                  {initialMessage}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col items-end justify-end gap-1">
            <span
              className="block rounded-xl px-4 py-3 text-sm font-normal text-white"
              style={{ backgroundColor: accentColor }}
            >
              Hi
            </span>
            <span
              className="block rounded-xl px-4 py-3 text-sm font-normal text-white last:rounded-br-none"
              style={{ backgroundColor: accentColor }}
            >
              I want to know more about your product
            </span>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto flex items-center gap-2 border-t border-neutral-200 p-4">
        <input
          type="text"
          placeholder="Type your message here..."
          className="grow text-base font-normal text-neutral-900 outline-none placeholder:text-neutral-900/40"
        />
        <div
          className="group flex size-10 cursor-pointer items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          <ArrowUp className="size-6 transition-opacity group-hover:opacity-80" />
        </div>
      </div>
      {!removeBranding && (
        <div className="flex items-center justify-center gap-2 bg-neutral-950 py-2.5 text-xs text-neutral-400">
          Povered by
          <PoveredBy />
        </div>
      )}
    </div>
  );
};

export default Widget;
