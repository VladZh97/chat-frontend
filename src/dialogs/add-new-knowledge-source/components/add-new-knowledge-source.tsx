import Dialog from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BaseIcon from '@/assets/base-icon.svg?react';
import Tabs from './tabs';
import AddLinkOption from './add-link-option';
import AddFileInput from './add-file-input';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { knowledge, type TPdf, type TRawText, type TText, type TWebsite } from '@/api/knowledge';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { isValidUrl } from '@/utils/is-valid-url';
import { LoaderCircle, SplineIcon } from 'lucide-react';
import { useKnowledgeStoreShallow } from '../store';
import AddTextSnippet from './add-text-snippet';

const AddNewKnowledgeSource = ({ children }: { children: React.ReactNode }) => {
  const [parent] = useAutoAnimate();
  const { id: chatbotId } = useParams();
  const [activeTab, setActiveTab] = useState('links');
  const { websiteUrl } = useKnowledgeStoreShallow(s => ({
    websiteUrl: s.websiteUrl,
  }));
  const { mutate: addWebsiteSource, isPending: isAddingWebsiteSource } = useMutation({
    mutationFn: (data: TWebsite) => knowledge.website(data),
  });
  // const { mutate: addPdfSource, isPending: isAddingPdfSource } = useMutation({
  //   mutationFn: (data: TPdf) => knowledge.pdf(data),
  // });
  // const { mutate: addRawTextSource, isPending: isAddingRawTextSource } = useMutation({
  //   mutationFn: (data: TRawText) => knowledge.rawText(data),
  // });
  // const { mutate: addTextSource, isPending: isAddingTextSource } = useMutation({
  //   mutationFn: (data: TText) => knowledge.text(data),
  // });

  const handleWebsiteSource = useCallback(
    ({ url }: { url: string }) => {
      const parsedUrl =
        url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      addWebsiteSource({ chatbotId: chatbotId as string, metadata: { url: parsedUrl } });
    },
    [activeTab, addWebsiteSource]
  );

  const handleSubmit = useCallback(() => {
    if (activeTab === 'links') {
      handleWebsiteSource({ url: websiteUrl });
    }
  }, [activeTab, websiteUrl, handleWebsiteSource]);

  const isDisabled = useMemo(() => {
    if (activeTab === 'links') {
      return !websiteUrl || !isValidUrl(websiteUrl);
    }
    return false;
  }, [activeTab, websiteUrl]);

  return (
    <Dialog>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[448px] overflow-hidden">
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
            {activeTab === 'text-snippet' && <AddTextSnippet />}
          </div>
        </div>
        <div className="rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-6">
          <Button className="h-10 w-full" disabled={isDisabled} onClick={handleSubmit}>
            {isAddingWebsiteSource && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            {isAddingWebsiteSource ? 'Adding source...' : 'Add source'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddNewKnowledgeSource;
