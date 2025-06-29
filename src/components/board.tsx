import { useLocation } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';

const OMIT_SCROLL_AREA_PATHS = ['/playground', '/settings', '/overview'] as const;

const Board = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isOmitScrollArea = OMIT_SCROLL_AREA_PATHS.some(path => pathname.includes(path));

  return (
    <div className="w-[calc(100%-272px)] p-2">
      <div className="h-full overflow-hidden rounded-xl bg-neutral-50 shadow-md">
        {isOmitScrollArea ? children : <ScrollArea className="h-full">{children}</ScrollArea>}
      </div>
    </div>
  );
};

export default Board;
