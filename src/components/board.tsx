import { ScrollArea } from './ui/scroll-area';

const Board = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow p-2">
      <div className="h-full overflow-hidden rounded-xl bg-neutral-50 shadow-md">
        <ScrollArea className="h-full">{children}</ScrollArea>
      </div>
    </div>
  );
};

export default Board;
