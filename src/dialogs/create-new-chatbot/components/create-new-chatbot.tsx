import Dialog from '@/components/ui/dialog';
import BaseIcon from '@/assets/base-icon.svg?react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'preact/hooks';
import { useMutation } from '@tanstack/react-query';
import type { IChatbot } from '@/types/chatbot.type';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import chatbot from '@/api/chatbot';
import { cn } from '@/lib/utils';

interface CreateNewChatbotProps {
  children: React.ReactNode;
  className?: string;
}

const CreateNewChatbot = ({ children, className }: CreateNewChatbotProps) => {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const { mutate: createChatbot, isPending } = useMutation({
    mutationFn: (data: Partial<IChatbot>) => chatbot.create(data),
    onSuccess: response => {
      setOpen(false);
      setName('');
      setWebsite('');
      navigate(`/chatbot/${response._id}`);
    },
  });

  const handleCreate = useCallback(() => {
    if (!name.trim() || isPending) return;
    createChatbot({
      name,
      website,
    });
  }, [name, website, isPending, createChatbot]);

  const handleNameChange = useCallback((e: Event) => {
    setName((e.target as HTMLInputElement).value);
  }, []);

  const handleWebsiteChange = useCallback((e: Event) => {
    setWebsite((e.target as HTMLInputElement).value);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className}>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[448px]">
        <div className="p-6 pb-8">
          <BaseIcon className="mb-4" />
          <p className="mb-[6px] cursor-pointer text-base font-semibold text-neutral-900">
            Create a new chatbot
          </p>
          <p className="mb-9 text-sm text-neutral-500">
            Set up your chatbot’s identity and training data.
          </p>
          <div className="mb-6">
            <span className="mb-2 block text-sm font-medium text-neutral-900">Chatbot name</span>
            <Input className="h-10" value={name} onChange={handleNameChange} />
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-neutral-900">
              Your website (optional)
            </span>
            <Input
              className="h-10"
              placeholder="https://"
              value={website}
              onChange={handleWebsiteChange}
            />
          </div>
        </div>
        <div className="rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-6">
          <Button
            className={cn('h-10 w-full', isPending && 'cursor-default')}
            disabled={!name.trim()}
            onClick={handleCreate}
          >
            {isPending && <LoaderCircle className="size-4 animate-spin" />}
            {isPending ? 'Creating...' : 'Create chatbot'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default CreateNewChatbot;
