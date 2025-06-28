import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const AddLinkOption = () => {
  return (
    <div className="pt-1 pb-8">
      <span className="mb-2 block text-sm font-medium text-neutral-900">URL</span>
      <Input className="h-10" placeholder="https://" />
      <div className="mt-6 flex items-center gap-2">
        <Switch />
        <span className="text-sm font-medium text-neutral-900">Crawl links</span>
      </div>
    </div>
  );
};

export default AddLinkOption;
