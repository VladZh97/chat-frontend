import chatbot from '@/api/chatbot';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'preact/compat';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ID = 'delete-chatbot-confirmation';

const DeleteChatbotConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { closeDialog, updateDialog } = useDialog();
  const { mutateAsync: deleteChatbot, isPending } = useMutation({
    mutationFn: () => chatbot.delete(id!),
  });

  const handleDelete = async () => {
    if (isPending) return;
    try {
      await deleteChatbot();
      toast.success('Chatbot deleted successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete chatbot');
    } finally {
      closeDialog(ID);
    }
  };

  useEffect(() => {
    updateDialog(ID, {
      disableClose: isPending,
    });
  }, [isPending]);

  return (
    <div className="w-[448px]">
      <div className="p-6 pb-8">
        <p className="mb-[6px] cursor-pointer text-base font-semibold text-stone-900">
          Are you sure you want to delete this chatbot?
        </p>
        <p className="text-sm text-stone-500">This action cannot be undone.</p>
      </div>
      <div className="flex items-center justify-end gap-2 rounded-b-2xl border-t border-stone-200 bg-stone-50 p-4">
        <Button variant="outline" onClick={() => closeDialog(ID)}>
          No, cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className={cn(isPending && 'cursor-default')}
        >
          {isPending && <LoaderCircle className="size-4 animate-spin" />}
          {isPending ? 'Deleting...' : 'Yes, delete'}
        </Button>
      </div>
    </div>
  );
};

DeleteChatbotConfirmation.id = ID;
export default DeleteChatbotConfirmation;
