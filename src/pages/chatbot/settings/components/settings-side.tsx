import RateLimiting from './rate-limiting';
import Colors from './colors';
import Branding from './branding';
import Images from './images';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatbotName from './chatbot-name';
import DeleteChatbotConfirmation from '@/dialogs/delete-chatbot-confirmation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDialog } from '@/hooks';
import CollectLeads from './collect-leads';

const SettingsSide = () => {
  const { showDialog } = useDialog();
  const handleDeleteChatbot = () => {
    showDialog(DeleteChatbotConfirmation.id, DeleteChatbotConfirmation);
  };
  return (
    <ScrollArea className="h-[calc(100vh-101px)]">
      <div className="px-8 py-6">
        <ChatbotName />
        <CollectLeads />
        <Images />
        <Colors />
        <Branding />
        <RateLimiting />
        <div className="mt-6 border-t border-stone-200 pt-6">
          <Button variant="destructive" onClick={handleDeleteChatbot}>
            <Trash2 />
            Delete chatbot
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SettingsSide;
