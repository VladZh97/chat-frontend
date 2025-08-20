import Icon from '@/assets/icon.svg?react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { useMutation } from '@tanstack/react-query';
import type { IChatbot } from '@/types/chatbot.type';
import { useNavigate } from 'react-router-dom';
import { Gem, LoaderCircle } from 'lucide-react';
import chatbot from '@/api/chatbot';
import { cn } from '@/lib/utils';
import { useDialog } from '@/hooks';
import { Switch } from '@/components/ui/switch';
import { PLAN_NAMES } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';

const ID = 'create-new-chatbot';

const CreateNewChatbot = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [collectLeads, setCollectLeads] = useState(false);
  const { closeDialog, updateDialog } = useDialog();
  const { plan } = useCurrentSubscription();
  const disabled = plan.title === PLAN_NAMES.FREE;

  const { mutate: createChatbot, isPending } = useMutation({
    mutationFn: (data: Partial<IChatbot>) => chatbot.create(data),
    onSuccess: response => {
      closeDialog(ID);
      setName('');
      navigate(`/chatbot/${response._id}`);
    },
  });

  const handleCreate = useCallback(() => {
    if (!name.trim() || isPending) return;
    createChatbot({
      name,
      collectLeads,
    });
  }, [name, isPending, createChatbot]);

  const handleNameChange = useCallback((e: Event) => {
    setName((e.target as HTMLInputElement).value);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleCreate();
    },
    [handleCreate]
  );

  useEffect(() => {
    updateDialog(ID, {
      disableClose: isPending,
    });
  }, [isPending]);

  return (
    <div className="w-[448px]">
      <div className="p-6 pb-8">
        <Icon className="mb-4" />
        <p className="mb-[6px] cursor-pointer text-base font-semibold text-stone-900">
          Create a new chatbot
        </p>
        <p className="mb-9 text-sm text-stone-500">
          Set up your chatbot’s identity and training data.
        </p>
        <div className="mb-6">
          <span className="mb-2 block text-sm font-medium text-stone-900">Chatbot name</span>
          <Input className="h-10" value={name} onChange={handleNameChange} onKeyDown={onKeyDown} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-900">Collect leads</span>
          <div className="flex items-center gap-4">
            {disabled && (
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/subscription');
                  closeDialog(ID);
                }}
              >
                <Gem className="size-4" />
                Upgrade now
              </Button>
            )}
            <Switch
              disabled={disabled}
              checked={collectLeads}
              onCheckedChange={value => {
                if (disabled) return;
                setCollectLeads(value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="rounded-b-2xl border-t border-stone-200 bg-stone-50 p-6">
        <Button
          className={cn('h-10 w-full', isPending && 'cursor-default')}
          disabled={!name.trim()}
          onClick={handleCreate}
        >
          {isPending && <LoaderCircle className="size-4 animate-spin" />}
          {isPending ? 'Creating...' : 'Create chatbot'}
        </Button>
      </div>
    </div>
  );
};

CreateNewChatbot.id = ID;
export default CreateNewChatbot;
