import { Badge } from '@/components/ui/badge';
import { Type } from 'lucide-react';

const KnowledgeText = () => {
  return (
    <div className="relative h-[46px] overflow-hidden rounded-lg bg-neutral-100 pt-3 shadow-sm">
      <Type className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-900" />
      <span className="block pr-24 pl-9 text-sm text-neutral-900">
        Our newest campaign is aiming to get more customers that will buy our products
      </span>
      <Badge
        variant="secondary"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-neutral-200 text-neutral-500"
      >
        123 chars
      </Badge>
      <span
        style={{
          background:
            'linear-gradient(180deg, #F5F5F5 0%, rgba(245, 245, 245, 0.50) 20%, rgba(245, 245, 245, 0.00) 100%)',
        }}
        className="absolute bottom-0 left-0 z-10 h-4 w-full rotate-180"
      />
    </div>
  );
};

export default KnowledgeText;
