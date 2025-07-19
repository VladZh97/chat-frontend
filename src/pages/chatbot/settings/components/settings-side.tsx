import RateLimiting from './rate-limiting';
import Colors from './colors';
import Branding from './branding';
import Images from './images';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatbotName from './chatbot-name';
import DeleteChatbotConfirmation from '@/dialogs/delete-chatbot-confirmation';
import { buttonVariants } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const SettingsSide = () => {
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <ChatbotName />
        <Images />
        <Colors />
        <Branding />
        <RateLimiting />
        <div className="mt-6 border-t border-neutral-200 pt-6">
          <DeleteChatbotConfirmation>
            <div className={buttonVariants({ variant: 'destructive' })}>
              <Trash2 />
              Delete chatbot
            </div>
          </DeleteChatbotConfirmation>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
