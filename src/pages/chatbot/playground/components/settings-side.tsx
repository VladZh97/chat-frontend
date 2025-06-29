import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ScrollArea } from '@/components/ui/scroll-area';
import Prompts from './prompts';
import ConverstationStarters from './converstation-starters';

const SettingsSide = () => {
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <div className="mb-6 border-b border-neutral-200 pb-6">
          <Label className="mb-2">Initial message</Label>
          <Input className="h-10" />
        </div>
        <ConverstationStarters />
        <Prompts />
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
