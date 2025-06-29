import ChatIcon from '@/assets/chat-icon.png';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash, Upload } from 'lucide-react';
import Icon from '@/assets/chat.svg';

const Images = () => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <img
          src={ChatIcon}
          alt="Chatbot image"
          className="size-12 overflow-hidden rounded-full object-cover"
        />
        <div>
          <Label className="mb-2">Avatar</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload />
              Upload
            </Button>
            <Button variant="destructive" size="sm" className="w-8 px-0">
              <Trash />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#0A0A0A1A] bg-neutral-900">
          <img src={Icon} alt="Chatbot image" className="size-6" />
        </div>
        <div>
          <Label className="mb-2">Avatar</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload />
              Upload
            </Button>
            <Button variant="destructive" size="sm" className="w-8 px-0">
              <Trash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;
