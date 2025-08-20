import { knowledge, type TFile, type TText, type TWebsite } from '@/api/knowledge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useMemo } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { useKnowledgeDialogStoreShallow } from '../store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isValidUrl } from '@/utils/is-valid-url';
import { useDialog, useUploadFile } from '@/hooks';
import queryClient from '@/lib/query';

const SubmitAction = ({ dialogId, knowledgeId }: { dialogId: string; knowledgeId?: string }) => {
  const { closeDialog } = useDialog();
  const { id: chatbotId } = useParams();
  const { uploadFileFn } = useUploadFile();

  const { mutateAsync: addWebsiteSource } = useMutation({
    mutationFn: (data: TWebsite) => knowledge.website(data),
  });
  const { mutateAsync: addFileSource } = useMutation({
    mutationFn: (data: TFile) => knowledge.file(data),
  });
  const { mutateAsync: addRawTextSource } = useMutation({
    mutationFn: (data: TText) => knowledge.text(data),
  });

  const { mutateAsync: updateTextSource } = useMutation({
    mutationFn: (data: { id: string; title: string; text: string }) => knowledge.updateText(data),
  });

  const { textSnippet, type, websiteUrl, setDisableClose, disableClose, selectedFile } =
    useKnowledgeDialogStoreShallow(s => ({
      textSnippet: s.textSnippet,
      type: s.type,
      websiteUrl: s.websiteUrl,
      disableClose: s.disableClose,
      selectedFile: s.selectedFile,
      setDisableClose: s.setDisableClose,
    }));

  const handleSubmit = async () => {
    setDisableClose(true);
    try {
      setDisableClose(true);

      if (type === 'text-snippet' && knowledgeId) {
        await updateTextSource({
          id: knowledgeId,
          title: textSnippet.title,
          text: textSnippet.content,
        });
      }

      if (type === 'links') {
        const parsedUrl = websiteUrl.match(/^https?:\/\//) ? websiteUrl : `https://${websiteUrl}`;
        await addWebsiteSource({
          chatbotId: chatbotId as string,
          metadata: { url: parsedUrl },
        });
      }

      if (type === 'text-snippet' && !knowledgeId) {
        await addRawTextSource({
          chatbotId: chatbotId as string,
          metadata: { text: textSnippet.content, title: textSnippet.title },
        });
      }

      if (type === 'files') {
        const fileUrl = await uploadFileFn(selectedFile?.file as File);
        const { pathname } = new URL(fileUrl);
        await addFileSource({
          chatbotId: chatbotId as string,
          metadata: { filePath: pathname.replace(/^\//, ''), ...selectedFile?.metadata },
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['knowledge', chatbotId] }),
        queryClient.invalidateQueries({ queryKey: ['memory-usage', chatbotId] }),
      ]);

      toast.success(knowledgeId ? 'Source updated successfully' : 'Source added successfully');
    } catch (error) {
      toast.error('Failed to add source');
    } finally {
      setDisableClose(false);
      closeDialog(dialogId);
    }
  };

  const isDisabled = useMemo(() => {
    if (type === 'text-snippet') return !textSnippet.title || !textSnippet.content;
    if (type === 'links') return !websiteUrl || !isValidUrl(websiteUrl);
    if (type === 'files') return !selectedFile;

    return false;
  }, [type, textSnippet.title, textSnippet.content, websiteUrl, selectedFile]);

  return (
    <Button
      className={cn('h-10 w-full', disableClose && 'cursor-default')}
      disabled={isDisabled}
      onClick={handleSubmit}
    >
      {disableClose && <LoaderCircle className="size-4 animate-spin" />}
      {knowledgeId
        ? disableClose
          ? 'Updating source...'
          : 'Update source'
        : disableClose
          ? 'Adding source...'
          : 'Add source'}
    </Button>
  );
};

export default SubmitAction;
