import Dialog from '@/components/ui/dialog';
import BaseIcon from '@/assets/base-icon.svg?react';
import Tabs from './tabs';
import AddLinkOption from './add-link-option';
import AddFileInput from './add-file-input';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useKnowledgeDialogStoreShallow } from '../store';
import AddTextSnippet from './add-text-snippet';
import SubmitAction from './submit-action';

const AddNewKnowledgeSource = ({ children }: { children: React.ReactNode }) => {
  const [parent] = useAutoAnimate();
  const { type, setType, open, setOpen } = useKnowledgeDialogStoreShallow(s => ({
    type: s.type,
    setType: s.setType,
    open: s.open,
    setOpen: s.setOpen,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[448px] overflow-hidden">
        <div className="p-6 pb-4">
          <BaseIcon className="mb-4" />
          <p className="mb-[6px] text-base font-semibold text-neutral-900">Add new source</p>
          <p className="mb-9 text-sm text-neutral-500">
            Add sources your chatbot will use to answer questions
          </p>
          <Tabs type={type} setType={setType} />
          <div ref={parent}>
            {type === 'links' && <AddLinkOption />}
            {type === 'files' && <AddFileInput />}
            {type === 'text-snippet' && <AddTextSnippet />}
          </div>
        </div>
        <div className="rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-6">
          <SubmitAction />
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddNewKnowledgeSource;
