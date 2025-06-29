import { Check, LoaderCircle, X } from 'lucide-react';

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

const MAPPED_BADGES = {
  not_trained: NotTrainedBadge,
  trained: TrainedBadge,
  training: TrainingBadge,
};

const TrainingStatusLabel = ({ status }: { status: keyof typeof MAPPED_BADGES }) => {
  const Badge = MAPPED_BADGES[status];

  return <Badge />;
};

export default TrainingStatusLabel;
