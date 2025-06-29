import chatbot from '@/api/chatbot';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Bot, ChevronRight } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

const NAVIGATION = [
  {
    label: 'Overview',
    path: '/chatbot/:id/overview',
  },
  {
    label: 'Knowledge',
    path: '/chatbot/:id/knowledge',
  },
  {
    label: 'Playground',
    path: '/chatbot/:id/playground',
  },
  {
    label: 'Settings',
    path: '/chatbot/:id/settings',
  },
];

const SidebarChatbots = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const { data: chatbots, isLoading } = useQuery({
    queryKey: ['chatbots'],
    queryFn: () => chatbot.get(),
    refetchOnWindowFocus: false,
  });

  const position = NAVIGATION.findIndex(item =>
    pathname.includes(item.path.replace(':id', id ?? ''))
  );

  return (
    <div className="space-y-3">
      {isLoading ? (
        <Skeleton />
      ) : (
        chatbots?.map(chatbot => (
          <div key={chatbot._id}>
            <Link
              to={`/chatbot/${chatbot._id}/overview`}
              className={cn(
                'flex items-center gap-2 rounded-lg border border-transparent p-2 text-sm text-neutral-400 transition-colors duration-200 hover:text-white',
                id === chatbot._id && 'border-neutral-700 bg-neutral-800 font-semibold text-white'
              )}
            >
              <Bot className="size-4 shrink-0" />
              <span className="truncate">{chatbot.name}</span>
              <ChevronRight
                className={cn('ml-auto size-4 shrink-0', id === chatbot._id && 'rotate-90')}
              />
            </Link>
            {id === chatbot._id && (
              <div className="relative mt-2 flex flex-col gap-2 px-6 py-0.5 text-sm text-neutral-400">
                {NAVIGATION.map(item => (
                  <Link
                    to={item.path.replace(':id', chatbot._id)}
                    className={cn(
                      'px-2 py-1 transition-colors duration-200 hover:text-white',
                      pathname.includes(item.path.replace(':id', chatbot._id)) &&
                        'font-semibold text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <span className="absolute top-0.5 left-3.5 h-full w-px bg-neutral-800">
                  <span
                    className="absolute h-7 w-px bg-white transition-transform duration-200"
                    style={{ transform: `translateY(${position * 36}px)` }}
                  ></span>
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SidebarChatbots;

const Skeleton = () => {
  return [70, 30, 50].map(width => (
    <span
      key={width}
      className={cn(
        'animate-pulse-fast flex items-center gap-2 rounded-lg border border-transparent p-2 text-sm text-neutral-700 transition-colors duration-200'
      )}
    >
      <Bot className="size-4 shrink-0" />
      <span className="block h-1.5 rounded-full bg-neutral-700" style={{ width: `${width}%` }} />
      <ChevronRight className="ml-auto size-4 shrink-0" />
    </span>
  ));
};
