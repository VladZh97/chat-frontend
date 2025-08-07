import LogoColor from '@/assets/logo-color.svg?react';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, Gauge, House, LogOut, PencilLine, Plus, Wallet } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';
import CreateNewChatbot from '@/dialogs/create-new-chatbot';
import SidebarChatbots from './sidebar-chatbots';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'preact/hooks';
import { useAuth } from '@/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';
import user from '@/api/user';
import EditUserProfile from '@/dialogs/edit-user-profile';
import { useDialog } from '@/hooks';

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
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { showDialog } = useDialog();

  const handleCreateNewChatbot = () => {
    showDialog(CreateNewChatbot.id, CreateNewChatbot);
  };

  return (
    <div className="flex h-full w-[272px] shrink-0 flex-col overflow-hidden bg-stone-900">
      <ScrollArea className="h-full [&>div>div]:h-full">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="p-2">
              <LogoColor />
            </div>
          </div>
          <div className="p-4 pt-3">
            <span className="mb-2 block p-2 text-sm text-stone-400/70">Platform</span>
            <div className="space-y-3">
              {NAVIGATION.map(item => (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border border-transparent p-2 text-sm text-stone-400 transition-colors duration-200 hover:text-stone-300',
                    pathname === item.path &&
                      'border-stone-700 bg-stone-800 font-semibold text-stone-50'
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
            <span className="mb-2 block p-2 text-sm text-stone-400/70">Chatbots</span>
            <SidebarChatbots />
            <div className="mt-3">
              <div
                className="flex cursor-pointer items-center gap-2 p-2 text-sm text-stone-400 transition-colors duration-200 hover:text-stone-300"
                onClick={handleCreateNewChatbot}
              >
                <Plus className="size-4" />
                Create new
              </div>
            </div>
          </div>
          <Profile />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;

const Profile = () => {
  const { showDialog } = useDialog();
  const { data: me } = useQuery({
    queryKey: user.get.key,
    queryFn: () => user.get.query(),
  });
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  if (!me) return null;
  return (
    <div className="mt-auto p-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          className={cn(
            'group cursor-pointer rounded-md transition-colors duration-200 hover:bg-stone-800',
            isOpen && 'bg-stone-800'
          )}
        >
          <div className="flex items-center gap-2 p-2">
            <div className="flex shrink-0 items-center gap-2">
              <img
                src={me?.picture}
                alt="avatar"
                className="size-8 overflow-hidden rounded-lg"
                width="32"
                height="32"
              />
            </div>
            <div className="grid">
              <span className="truncate text-sm font-semibold text-stone-400">{me?.name}</span>
              <span className="truncate text-xs text-stone-400/70">{me?.email}</span>
            </div>
            <div className="ml-auto flex cursor-pointer items-center justify-center text-stone-400 transition-colors duration-200 group-hover:text-stone-300">
              <ChevronsUpDown className="size-4 shrink-0" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="w-48 space-y-1 rounded-lg bg-white p-2 shadow-lg"
        >
          <div
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-stone-900 hover:bg-stone-100"
            onClick={() => {
              setIsOpen(false);
              showDialog(EditUserProfile.id, EditUserProfile);
            }}
          >
            <PencilLine className="size-4" />
            Edit profile
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Log out
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
