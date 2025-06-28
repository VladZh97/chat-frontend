import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-6">
      <span className="text-2xl font-medium text-neutral-900">MediaMarkt chatbot settings</span>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <CodeXml />
          Copy embed code
        </Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
};

export default Header;
