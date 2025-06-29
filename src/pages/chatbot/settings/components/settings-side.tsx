import RateLimiting from './rate-limiting';
import Colors from './colors';
import Branding from './branding';
import Images from './images';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatbotName from './chatbot-name';

const SettingsSide = () => {
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <ChatbotName />
        <Images />
        <Colors />
        <Branding />
        <RateLimiting />
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
