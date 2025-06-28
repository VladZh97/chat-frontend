import { Input } from '@/components/ui/input';

const SettingsSide = () => {
  return (
    <div className="px-8 py-6">
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <span className="mb-2 block text-sm font-medium text-neutral-900">Chatbot name</span>
        <Input className="h-10" />
      </div>
    </div>
  );
};

export default SettingsSide;
