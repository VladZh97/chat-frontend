import { ArrowLeft, ArrowUp, Ellipsis, Smile } from 'lucide-react';
import PoveredBy from '@/assets/povered-by.svg?react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { cn } from '@/lib/utils';

const Widget = () => {
  return (
    <div className="flex h-full max-h-[600px] w-[416px] flex-col rounded-3xl bg-white pb-2 shadow-xl">
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

export default Widget;

const Header = () => {
  return (
    <div className="flex items-center justify-between p-6">
      <ArrowLeft className="size-5 text-stone-700" />
      <span className="text-sm font-semibold text-stone-900">New chat</span>
      <Ellipsis className="size-5 text-stone-700" />
    </div>
  );
};

const Main = () => {
  return (
    <div className="flex-1 space-y-4 p-6">
      <BotMessage />
      <UserMessage />
    </div>
  );
};

const BotMessage = () => {
  const { accentColor, avatar } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
    avatar: s.avatarIcon,
  }));
  return (
    <div
      className="flex items-end gap-2"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className="size-6 overflow-hidden rounded-full" style={{ backgroundColor: accentColor }}>
        {avatar && <img src={avatar} alt="avatar" className="size-full object-cover" />}
      </div>
      <p className="rounded-2xl rounded-bl-none bg-[var(--accent-color)]/10 px-4 py-3 text-sm font-normal text-stone-900">
        How can I help you?
      </p>
    </div>
  );
};

const UserMessage = () => {
  const { accentColor } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  return (
    <div className="flex justify-end">
      <p
        className="rounded-2xl rounded-br-none px-4 py-3 text-sm font-normal text-white"
        style={{ backgroundColor: accentColor }}
      >
        Tell me everything about your pricing
      </p>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="flex flex-col px-4">
      <InputContainer />
      <PoweredBy />
    </div>
  );
};

const InputContainer = () => {
  const { accentColor, removeBranding } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
    removeBranding: s.removeBranding,
  }));
  return (
    <div
      className={cn(
        'flex h-14 items-center rounded-xl bg-stone-100 py-3 pr-3 pl-4',
        removeBranding && 'mb-2'
      )}
    >
      <input
        type="text"
        placeholder="Ask me anything"
        className="grow border-none text-sm font-normal text-stone-900 outline-none placeholder:text-stone-900/40 focus:outline-none focus-visible:outline-none"
      />
      <div className="ml-2 flex shrink-0 items-center gap-4">
        <div className="group cursor-pointer">
          <Smile className="size-5 text-stone-400 transition-colors group-hover:text-stone-900" />
        </div>
        <span
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          <ArrowUp />
        </span>
      </div>
    </div>
  );
};

const PoweredBy = () => {
  const { removeBranding } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
  }));
  if (removeBranding) return null;
  return (
    <div className="mt-2 flex h-8 items-center justify-center gap-1.5 text-xs text-stone-500">
      Povered by
      <PoveredBy />
    </div>
  );
};
