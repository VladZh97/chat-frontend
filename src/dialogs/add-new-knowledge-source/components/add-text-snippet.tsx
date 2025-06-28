import { TextEditor } from '@/components/text-editor';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const AddTextSnippet = () => {
  const [content, setContent] = useState<string>('');

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-900">Title</span>
        <Input className="w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="block text-sm font-medium text-neutral-900">Content</span>
        <TextEditor content={content} setContent={setContent} />
      </div>
    </div>
  );
};

export default AddTextSnippet;
