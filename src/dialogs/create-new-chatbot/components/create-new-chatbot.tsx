import Dialog from '@/components/ui/dialog';
import BaseIcon from '@/assets/base-icon.svg?react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CreateNewChatbot = () => {
  return (
    <Dialog>
      <Dialog.Trigger>Create new chatbot</Dialog.Trigger>
      <Dialog.Content className="w-[448px]">
        <div className="p-6 pb-8">
          <BaseIcon className="mb-4" />
          <p className="mb-[6px] text-base font-semibold text-neutral-900">Create a new chatbot</p>
          <p className="mb-9 text-sm text-neutral-500">
            Set up your chatbot’s identity and training data.
          </p>
          <div className="mb-6">
            <span className="mb-2 block text-sm font-medium text-neutral-900">Chatbot name</span>
            <Input className="h-10" />
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-neutral-900">
              Your website (optional)
            </span>
            <Input className="h-10" placeholder="https://" />
          </div>
        </div>
        <div className="rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-6">
          <Button className="h-10 w-full">Create chatbot</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default CreateNewChatbot;
