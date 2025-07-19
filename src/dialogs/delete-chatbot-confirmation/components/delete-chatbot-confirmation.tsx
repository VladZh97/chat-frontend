import chatbot from '@/api/chatbot';
import { Button } from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'preact/compat';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const DeleteChatbotConfirmation = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
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
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} disableClose={isPending} onOpenChange={setOpen}>
      <Dialog.Trigger className={className}>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[448px]">
        <div className="p-6 pb-8">
          <p className="mb-[6px] cursor-pointer text-base font-semibold text-neutral-900">
            Are you sure you want to delete this chatbot?
          </p>
          <p className="text-sm text-neutral-500">This action cannot be undone.</p>
        </div>
        <div className="flex items-center justify-end gap-2 rounded-b-2xl border-t border-neutral-200 bg-neutral-50 p-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
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
      </Dialog.Content>
    </Dialog>
  );
};

export default DeleteChatbotConfirmation;
