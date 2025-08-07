import { ChevronsUpDown } from 'lucide-react';
import Logo from '@/assets/logo-dark.svg';
// import Avatar from '@/assets/avatar-placeholder.jpg';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LINK_STYLE =
  'px-4 py-2 text-sm font-normal text-stone-500 flex items-center justify-center hover:text-stone-950 transition-colors';

const Header = () => {
  const { pathname } = useLocation();
  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-stone-200 bg-white/90 p-4 backdrop-blur-[6px]">
      <div className="flex items-center gap-8">
        <div className="flex items-center justify-center p-2">
          <img src={Logo} alt="logo" className="h-auto w-[86px]" width="86" height="20" />
        </div>
        <ul className="flex items-center">
          <li className={cn(LINK_STYLE, pathname === '/playground' && 'text-stone-950')}>
            <Link to="/playground">Playground</Link>
          </li>
          <li className={cn(LINK_STYLE, pathname === '/chatlog' && 'text-stone-950')}>
            <Link to="/chatlog">Chatlog</Link>
          </li>
          <li className={cn(LINK_STYLE, pathname === '/subscription' && 'text-stone-950')}>
            <Link to="/subscription">Subscription</Link>
          </li>
        </ul>
      </div>
      <div className="flex cursor-pointer items-center p-2">
        <img
          // src={Avatar}
          alt="avatar"
          className="size-6 overflow-hidden rounded-full"
          width="24"
          height="24"
        />
        <span className="px-2 text-sm font-normal text-stone-700">John Doe</span>
        <ChevronsUpDown className="size-4 text-stone-700" />
      </div>
    </div>
  );
};

export default Header;
