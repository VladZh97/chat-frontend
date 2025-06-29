import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RateLimiting from './rate-limiting';
import Colors from './colors';
import Branding from './branding';
import Images from './images';
import { ScrollArea } from '@/components/ui/scroll-area';

const SettingsSide = () => {
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <div className="mb-6 border-b border-neutral-200 pb-6">
          <Label className="mb-2">Chatbot name</Label>
          <Input className="h-10" />
        </div>
        <Images />
        <Colors />
        <Branding />
        <RateLimiting />
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
