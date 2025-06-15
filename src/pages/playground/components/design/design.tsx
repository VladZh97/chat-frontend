import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PaintBucket } from 'lucide-react';
import ImageUpload from './image-upload';
import ColorPicker from './color-picker';

const Design = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" className="flex items-center gap-2">
          <PaintBucket />
          Design
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[336px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
        <p className="mb-2 flex items-center gap-2 text-base font-medium text-neutral-950">
          <PaintBucket className="size-4" />
          Design
        </p>
        <p className="mb-6 text-sm text-neutral-500">Adjust the design of your chatbot</p>
        <div className="mb-6 space-y-6">
          <ImageUpload type="logo" />
          <ImageUpload type="icon" />
        </div>
        <div className="space-y-6 pt-4">
          <ColorPicker type="accent" />
          <ColorPicker type="background" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Design;
