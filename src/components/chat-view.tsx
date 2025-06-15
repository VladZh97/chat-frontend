import logo from '@/assets/logo-dark.svg';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import icon from '@/assets/chat-icon.png';

const ChatView = () => {
  return (
    <div className="flex flex-col w-[480px]">
      <span className="mb-2 block text-sm text-neutral-950">Conversation</span>
      <div className="grow overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 p-8 shadow-sm">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow">
          <div className="grow p-4">
            <div className="relative pt-2 pb-8 text-center text-lg/none font-medium text-neutral-900">
              <ArrowLeft className="absolute top-2 left-4 text-xl text-neutral-700" />
              New chat
            </div>
            <div className="space-y-8">
              <div className="relative space-y-2 pl-8">
                <img
                  src={icon}
                  alt=""
                  className="absolute bottom-0 left-0 m-0 size-6"
                  width="24"
                  height="24"
                />
                <span className="inline-block rounded-xl bg-red-200 px-4 py-3 text-sm text-neutral-900">
                  How can I help you?
                </span>
                <span className="inline-block rounded-xl bg-red-200 px-4 py-3 text-sm text-neutral-900 last:rounded-bl-none">
                  You can ask me anything and I’ll help you with that
                </span>
              </div>
              <div className="relative flex flex-col space-y-2">
                <span className="ml-auto inline-block rounded-xl bg-red-500 px-4 py-3 text-sm text-white">
                  Can I talk to a real person?
                </span>
                <span className="ml-auto inline-block rounded-xl bg-red-500 px-4 py-3 text-sm text-white last:rounded-br-none">
                  Can I talk to a real person?
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between border-t border-t-neutral-200 p-4">
              <span className="text-base text-neutral-900/40">Type your message here...</span>
              <span className="flex size-10 items-center justify-center rounded-full bg-red-600">
                <ArrowUp className="text-white" />
              </span>
            </div>
            <span className="flex h-8 items-center justify-center border-t border-t-neutral-200 bg-neutral-50 text-xs text-neutral-700">
              Powered by{' '}
              <img src={logo} alt="" className="h-auto w-[52px]" width="52" height="12" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
