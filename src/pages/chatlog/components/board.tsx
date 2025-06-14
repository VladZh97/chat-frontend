import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import BoardMain from './board-main';

const Board = () => {
  return (
    <div className="mx-auto mt-6 w-full max-w-[1156px] rounded-2xl bg-white shadow">
      <div className="flex items-center justify-between px-8 py-4 text-base font-semibold text-neutral-950">
        Chatlog{' '}
        <Button variant="outline">
          <RefreshCcw />
          Refresh
        </Button>
      </div>
      <BoardMain />
    </div>
  );
};

export default Board;
