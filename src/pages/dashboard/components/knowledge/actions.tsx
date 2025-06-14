import { Button } from '@/components/ui/button';
import { LinkIcon, Type, Upload } from 'lucide-react';

const Actions = () => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" className="grow cursor-pointer">
        <LinkIcon />
        Add link
      </Button>
      <Button variant="outline" className="grow cursor-pointer">
        <Upload />
        Upload file
      </Button>
      <Button variant="outline" className="grow cursor-pointer">
        <Type />
        Add text
      </Button>
    </div>
  );
};

export default Actions;
