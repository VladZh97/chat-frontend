import { useAuth } from '@/providers/auth-provider';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo-dark.svg';
import Avatar from '@/assets/avatar-placeholder.jpg';
import { ChevronsUpDown } from 'lucide-react';
import WelcomeMessage from './welcome-message';
import WebsiteCard from './website-card';
import Knowledge from './knowledge/kowledge';
import { useDashboardStoreShallow } from '../store';
import Tiptap from '@/components/text-editor';
import { Button } from '@/components/ui/button';

const steps = {
  idle: WelcomeMessage,
  website: WebsiteCard,
  content: Knowledge,
};

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const step = useDashboardStoreShallow(s => s.step);
  const Step = steps[step];

  return (
    <div className="relative grid min-h-screen place-items-center pt-20">
      <Button onClick={logout}>Logout</Button>
      <div className="absolute top-0 left-0 flex w-full items-center justify-between border-b border-neutral-200 bg-white/90 p-4 backdrop-blur-[6px]">
        <div className="flex items-center justify-center p-2">
          <img src={Logo} alt="logo" className="h-auto w-[86px]" width="86" height="20" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-medium text-neutral-700">
          New chatbot
        </span>
        <div className="flex cursor-pointer items-center p-2">
          <img
            src={Avatar}
            alt="avatar"
            className="size-6 overflow-hidden rounded-full"
            width="24"
            height="24"
          />
          <span className="px-2 text-sm font-normal text-neutral-700">John Doe</span>
          <ChevronsUpDown className="size-4 text-neutral-700" />
        </div>
      </div>
      {/* <Tiptap /> */}
      <Step />
    </div>
  );
};

export default Dashboard;
