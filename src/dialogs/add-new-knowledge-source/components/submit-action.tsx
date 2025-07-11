import { knowledge, type TFile, type TRawText, type TWebsite } from '@/api/knowledge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useMemo } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { useKnowledgeDialogStoreShallow } from '../store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isValidUrl } from '@/utils/is-valid-url';
import { useUploadFile } from '@/hooks';

const SubmitAction = () => {
  const { id: chatbotId } = useParams();
  const { uploadFileFn } = useUploadFile();
  const { mutateAsync: addWebsiteSource, isPending: isAddingWebsiteSource } = useMutation({
    mutationFn: (data: TWebsite) => knowledge.website(data),
  });

  const { textSnippet, type, setOpen, websiteUrl, setDisableClose, disableClose, selectedFile } =
    useKnowledgeDialogStoreShallow(s => ({
      textSnippet: s.textSnippet,
      type: s.type,
      setOpen: s.setOpen,
      websiteUrl: s.websiteUrl,
      setDisableClose: s.setDisableClose,
      disableClose: s.disableClose,
      selectedFile: s.selectedFile,
    }));

  const { mutateAsync: addFileSource } = useMutation({
    mutationFn: (data: TFile) => knowledge.file(data),
  });
  const { mutateAsync: addRawTextSource } = useMutation({
    mutationFn: (data: TRawText) => knowledge.rawText(data),
  });
  const handleSubmit = async () => {
    setDisableClose(true);
    try {
      setDisableClose(true);
      if (type === 'links') {
        const parsedUrl = websiteUrl.match(/^https?:\/\//) ? websiteUrl : `https://${websiteUrl}`;
        await addWebsiteSource({
          chatbotId: chatbotId as string,
          metadata: { url: parsedUrl },
        });
      }
      if (type === 'text-snippet') {
        await addRawTextSource({
          chatbotId: chatbotId as string,
          metadata: { text: textSnippet.content, title: textSnippet.title },
        });
      }

      if (type === 'files') {
        const fileUrl = await uploadFileFn(selectedFile?.file as File);
        await addFileSource({
          chatbotId: chatbotId as string,
          metadata: { filePath: fileUrl, ...selectedFile?.metadata },
        });
      }

      toast.success('Source added successfully');
    } catch (error) {
      toast.error('Failed to add source');
    } finally {
      setDisableClose(false);
      setOpen(false);
    }
  };

  const isDisabled = useMemo(() => {
    if (type === 'text-snippet') {
      return !textSnippet.title || !textSnippet.content;
    }
    if (type === 'links') {
      return !websiteUrl || !isValidUrl(websiteUrl);
    }

    if (type === 'files') {
      return !selectedFile;
    }

    return false;
  }, [type, textSnippet.title, textSnippet.content, websiteUrl, selectedFile]);

  return (
    <Button
      className={cn('h-10 w-full', disableClose && 'cursor-default')}
      disabled={isDisabled}
      onClick={handleSubmit}
    >
      {disableClose && <LoaderCircle className="mr-2 size-4 animate-spin" />}
      {disableClose ? 'Adding source...' : 'Add source'}
    </Button>
  );
};

export default SubmitAction;
