import { ScrollArea } from '@/components/ui/scroll-area';
import Prompts from './prompts';
import InitialMessage from './initial-message';
import { PublicName } from './public-name';
import ConversationStarters from './conversation-starters';

const SettingsSide = () => {
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <PublicName />
        <InitialMessage />
        <ConversationStarters />
        <Prompts />
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
