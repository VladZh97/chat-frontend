import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';

const ImageUpload = ({ type }: { type: 'logo' | 'icon' }) => {
  return (
    <div className="flex items-center gap-5">
      {/* <img src={icon} alt="" width="48" height="48" className="size-12 rounded-full" /> */}
      <div className="flex size-12 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
        <Image className="size-4 text-neutral-500" />
      </div>
      <div>
        <span className="font- mb-2 block text-sm text-neutral-950">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload />
            Upload {type}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
