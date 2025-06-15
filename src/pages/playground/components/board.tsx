import { Button } from '@/components/ui/button';
import { PaintBucket } from 'lucide-react';

const Board = () => {
  return (
    <div className="mx-auto mt-6 w-full max-w-[1156px] rounded-2xl bg-white shadow">
      <div className="flex items-center justify-between px-8 py-4 text-base font-semibold text-neutral-950">
        Playground
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <PaintBucket />
            Desing
          </Button>
          <Button>Save changes</Button>
        </div>
      </div>
      {/* <BoardMain /> */}
    </div>
  );
};

export default Board;
