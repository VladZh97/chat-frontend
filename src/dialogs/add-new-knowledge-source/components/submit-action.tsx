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
import { useUploadFile } from '@/hooks';

const SubmitAction = () => {
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

  const { textSnippet, type, setOpen, websiteUrl, setDisableClose, disableClose, selectedFile } =
    useKnowledgeDialogStoreShallow(s => ({
      textSnippet: s.textSnippet,
      type: s.type,
      websiteUrl: s.websiteUrl,
      disableClose: s.disableClose,
      selectedFile: s.selectedFile,
      setOpen: s.setOpen,
      setDisableClose: s.setDisableClose,
    }));

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
      {disableClose ? 'Adding source...' : 'Add source'}
    </Button>
  );
};

export default SubmitAction;
