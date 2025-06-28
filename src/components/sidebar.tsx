import LogoLight from '@/assets/logo-light.svg?react';
import Avatar from '@/assets/avatar-placeholder.png';
import { cn } from '@/lib/utils';
import {
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Gauge,
  House,
  Plus,
  Settings2,
  Wallet,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';
import CreateNewChatbot from '@/dialogs/create-new-chatbot';
import chatbot from '@/api/chatbot';
import { useQuery } from '@tanstack/react-query';

const NAVIGATION = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <House className="size-4" />,
  },
  {
    label: 'Usage',
    path: '/usage',
    icon: <Gauge className="size-4" />,
  },
  {
    label: 'Subscription',
    path: '/subscription',
    icon: <Wallet className="size-4" />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings2 className="size-4" />,
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { data: chatbots } = useQuery({
    queryKey: ['chatbots'],
    queryFn: () => chatbot.get(),
  });

  return (
    <div className="flex h-full max-w-[272px] shrink-0 flex-col overflow-hidden bg-neutral-900">
      <ScrollArea className="h-full [&>div>div]:h-full">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="p-2">
              <LogoLight className="h-auto max-w-20" />
            </div>
          </div>
          <div className="p-4 pt-3">
            <span className="mb-2 block p-2 text-sm text-neutral-400/70">Platform</span>
            <div className="space-y-3">
              {NAVIGATION.map(item => (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border border-transparent p-2 text-sm text-neutral-400 transition-colors duration-200 hover:text-white',
                    pathname === item.path &&
                      'border-neutral-700 bg-neutral-800 font-semibold text-white'
                  )}
                  key={item.path}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4">
            <span className="mb-2 block p-2 text-sm text-neutral-400/70">Chatbots</span>
            <div className="space-y-3">
              {chatbots?.map(chatbot => (
                <Link
                  to={`/chatbot/${chatbot._id}`}
                  className="flex items-center gap-2 p-2 text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
                >
                  <Bot className="size-4 shrink-0" />
                  <span className="truncate">{chatbot.name}</span>
                  <ChevronRight className="ml-auto size-4 shrink-0" />
                </Link>
              ))}
            </div>
            <div className="mt-3">
              <CreateNewChatbot className="w-full">
                <div className="flex cursor-pointer items-center gap-2 p-2 text-sm text-neutral-400 transition-colors duration-200 hover:text-white">
                  <Plus className="size-4" />
                  Create new
                </div>
              </CreateNewChatbot>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2 p-4">
            <div className="flex shrink-0 items-center gap-2">
              <img
                src={Avatar}
                alt="avatar"
                className="size-8 overflow-hidden rounded-lg"
                width="32"
                height="32"
              />
            </div>
            <div className="grid">
              <span className="truncate text-sm font-semibold text-neutral-400">John Doe</span>
              <span className="truncate text-xs text-neutral-400/70">john.doe@mycompany.com</span>
            </div>
            <div className="ml-auto flex cursor-pointer items-center justify-center text-neutral-400 transition-colors duration-200 hover:text-white">
              <ChevronsUpDown className="size-4 shrink-0" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
