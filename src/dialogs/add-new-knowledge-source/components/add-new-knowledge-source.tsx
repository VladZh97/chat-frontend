import Icon from '@/assets/icon.svg?react';
import Tabs from './tabs';
import AddLinkOption from './add-link-option';
import AddFileInput from './add-file-input';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useKnowledgeDialogStoreShallow } from '../store';
import AddTextSnippet from './add-text-snippet';
import SubmitAction from './submit-action';
import { useDialog } from '@/hooks';
import { useEffect } from 'preact/hooks';

const ID = 'add-new-knowledge-source';

const AddNewKnowledgeSource = ({ knowledgeId }: { knowledgeId?: string }) => {
  const [parent] = useAutoAnimate();
  const { updateDialog } = useDialog();
  const { type, setType, disableClose, reset, hiddenTabs } = useKnowledgeDialogStoreShallow(s => ({
    type: s.type,
    setType: s.setType,
    disableClose: s.disableClose,
    reset: s.reset,
    hiddenTabs: s.hiddenTabs,
  }));

  useEffect(() => {
    updateDialog(ID, {
      disableClose,
    });
  }, [disableClose]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <div>
      <div className="w-[448px] overflow-hidden">
        <div className="p-6 pb-4">
          <Icon className="mb-4" />
          <p className="mb-[6px] text-base font-semibold text-stone-900">Add new source</p>
          <p className="mb-9 text-sm text-stone-500">
            Add sources your chatbot will use to answer questions
          </p>
          {!hiddenTabs && <Tabs type={type} setType={setType} />}
          <div ref={parent}>
            {type === 'links' && <AddLinkOption />}
            {type === 'files' && <AddFileInput />}
            {type === 'text-snippet' && <AddTextSnippet />}
          </div>
        </div>
        <div className="rounded-b-2xl border-t border-stone-200 bg-stone-50 p-6">
          <SubmitAction dialogId={ID} knowledgeId={knowledgeId} />
        </div>
      </div>
    </div>
  );
};

AddNewKnowledgeSource.id = ID;
export default AddNewKnowledgeSource;
