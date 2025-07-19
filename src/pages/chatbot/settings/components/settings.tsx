import { Label } from '@/components/ui/label';
import Header from './header';
import SettingsSide from './settings-side';
import { Widget } from '@/widget';
import { useGetChatbot } from '../../hooks';

const Settings = () => {
  const { isLoading } = useGetChatbot();
  if (isLoading) return null;

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="grid grid-cols-2 overflow-hidden">
        <SettingsSide />
        <div className="flex flex-col border-l border-neutral-200 bg-neutral-100 p-8">
          <Label className="mb-5">Preview</Label>
          <div className="flex grow items-center justify-center">
            <Widget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
