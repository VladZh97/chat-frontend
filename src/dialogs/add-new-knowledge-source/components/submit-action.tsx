import { knowledge, type TRawText, type TWebsite } from '@/api/knowledge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useMemo } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { useKnowledgeDialogStoreShallow } from '../store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isValidUrl } from '@/utils/is-valid-url';

const SubmitAction = () => {
  const { id: chatbotId } = useParams();

  const { mutateAsync: addWebsiteSource, isPending: isAddingWebsiteSource } = useMutation({
    mutationFn: (data: TWebsite) => knowledge.website(data),
  });

  const { textSnippet, type, setOpen, websiteUrl } = useKnowledgeDialogStoreShallow(s => ({
    textSnippet: s.textSnippet,
    type: s.type,
    setOpen: s.setOpen,
    websiteUrl: s.websiteUrl,
  }));

  // const { mutate: addPdfSource, isPending: isAddingPdfSource } = useMutation({
  //   mutationFn: (data: TPdf) => knowledge.pdf(data),
  // });
  const { mutateAsync: addRawTextSource, isPending: isAddingRawTextSource } = useMutation({
    mutationFn: (data: TRawText) => knowledge.rawText(data),
  });
  // const { mutate: addTextSource, isPending: isAddingTextSource } = useMutation({
  //   mutationFn: (data: TText) => knowledge.text(data),
  // });

  const handleSubmit = async () => {
    if (type === 'links') {
      const parsedUrl = websiteUrl.match(/^https?:\/\//) ? websiteUrl : `https://${websiteUrl}`;
      await addWebsiteSource({
        chatbotId: chatbotId as string,
        metadata: { url: parsedUrl },
      });
    }
    // if (type === 'files') {
    //   handleFileSource({ file: file });
    // }
    if (type === 'text-snippet') {
      await addRawTextSource({
        chatbotId: chatbotId as string,
        metadata: { text: textSnippet.content, title: textSnippet.title },
      });
    }
    setOpen(false);
    toast.success('Source added successfully');
  };

  const isDisabled = useMemo(() => {
    if (type === 'text-snippet') {
      return !textSnippet.title || !textSnippet.content;
    }
    if (type === 'links') {
      return !websiteUrl || !isValidUrl(websiteUrl);
    }

    return false;
  }, [type, textSnippet.title, textSnippet.content, websiteUrl]);

  const loading = isAddingRawTextSource || isAddingWebsiteSource;

  return (
    <Button
      className={cn('h-10 w-full', loading && 'cursor-default')}
      disabled={isDisabled}
      onClick={handleSubmit}
    >
      {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
      {loading ? 'Adding source...' : 'Add source'}
    </Button>
  );
};

export default SubmitAction;
