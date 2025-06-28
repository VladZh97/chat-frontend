import Dialog from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BaseIcon from '@/assets/base-icon.svg?react';
import Tabs from './tabs';
import AddLinkOption from './add-link-option';
import AddFileInput from './add-file-input';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState } from 'preact/hooks';

const AddNewKnowledgeSource = () => {
  const [parent] = useAutoAnimate();
  const [activeTab, setActiveTab] = useState('links');
  return (
    <Dialog>
      <Dialog.Trigger>Add new source</Dialog.Trigger>
      <Dialog.Content className="w-[448px]">
        <div className="p-6 pb-4">
          <BaseIcon className="mb-4" />
          <p className="mb-[6px] text-base font-semibold text-neutral-900">Add new source</p>
          <p className="mb-9 text-sm text-neutral-500">
            Add sources your chatbot will use to answer questions
          </p>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div ref={parent}>
            {activeTab === 'links' && <AddLinkOption />}
            {activeTab === 'files' && <AddFileInput />}
          </div>
        </div>
        <div className="rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-6">
          <Button className="h-10 w-full">Add source</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddNewKnowledgeSource;
