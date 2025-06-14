import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'lucide-react';

const KnowledgeWebsite = () => {
  return (
    <div>
      <div className="relative">
        <Link className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-900" />
        <Input
          disabled
          className="rounded-lg bg-neutral-100 pl-9 text-neutral-900 !opacity-100 shadow-sm"
          defaultValue="https://mediamarkt.pl"
        />
        <Badge
          variant="secondary"
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-neutral-200 text-neutral-500"
        >
          +10 subpages
        </Badge>
      </div>
    </div>
  );
};

export default KnowledgeWebsite;
