import { ScrollArea } from '@/components/ui/scroll-area';
import Prompts from './prompts';
import ConverstationStarters from './converstation-starters';
import InitialMessage from './initial-message';

const SettingsSide = () => {
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <InitialMessage />
        <ConverstationStarters />
        <Prompts />
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
