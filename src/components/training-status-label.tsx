import { knowledge } from '@/api/knowledge';
import { useMutationState, useQuery } from '@tanstack/react-query';
import { Check, LoaderCircle, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

const NotTrainedBadge = () => {
  return (
    <span className="flex h-7 items-center justify-center gap-2 rounded-md bg-neutral-200 px-2 py-1.5 text-sm font-semibold text-neutral-500">
      <X className="size-4 text-neutral-500" />
      Not trained
    </span>
  );
};

const TrainedBadge = () => {
  return (
    <span className="flex h-7 items-center justify-center gap-2 rounded-md bg-green-100 px-2 py-1.5 text-sm font-semibold text-green-600">
      <Check className="size-4 text-green-600" />
      Trained
    </span>
  );
};

const TrainingBadge = () => {
  return (
    <span className="flex h-7 items-center justify-center gap-2 rounded-md bg-amber-100 px-2 py-1.5 text-sm font-semibold text-amber-600">
      <LoaderCircle className="size-4 animate-spin text-amber-600" />
      Training
    </span>
  );
};

const TrainingStatusLabel = () => {
  const { id: chatbotId } = useParams();
  const { data: knowledgeData, isLoading } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => knowledge.list(chatbotId as string),
  });

  const [isPending] = useMutationState({
    filters: { mutationKey: ['train-chatbot', chatbotId] },
    select: mutation => mutation.state.status === 'pending',
  });

  const isTrained = knowledgeData?.every(item => item.trained);

  if (isLoading) return <Skeleton className="h-7 w-24" />;

  if (!knowledgeData?.length) return null;

  if (isTrained) return <TrainedBadge />;
  if (isPending) return <TrainingBadge />;
  return <NotTrainedBadge />;
};

export default TrainingStatusLabel;
