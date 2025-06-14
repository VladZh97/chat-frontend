import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import Icon from '@/assets/icon.svg';
import { ArrowLeftIcon } from 'lucide-react';
import Actions from './actions';
// import Website from './website';
import EmptyState from './empty-state';
import KnowledgeText from './knowledge-text';
import KnowledgeFile from './knowledge-file';

const Knowledge = () => {
  return (
    <Card className="w-full max-w-[448px] gap-0 overflow-hidden p-0">
      <CardContent className="px-6 pt-6 pb-5">
        <img src={Icon} alt="icon" className="mb-4 size-8" width="32" height="32" />
        <CardTitle className="mb-[6px] text-base font-semibold text-neutral-950">
          Add content to train your chatbot
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Drop in links, files, or short text snippets. <br /> You can add more later.
        </CardDescription>
      </CardContent>
      <CardContent className="px-6 pt-4 pb-8">
        <span className="mb-4 block text-sm text-neutral-950">Current knowledge</span>

        {/* <Website /> */}
        {/* <EmptyState /> */}
        {/* <KnowledgeText /> */}
        <KnowledgeFile />
        <hr className="my-6 border-neutral-200" />
        <Actions />
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t border-neutral-200 bg-neutral-50 p-6">
        <Button className="cursor-pointer" variant="outline">
          <ArrowLeftIcon className="size-4" />
          Go back
        </Button>
        <Button className="grow cursor-pointer" disabled>
          Next step
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Knowledge;
