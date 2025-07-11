import { TextEditor } from '@/components/text-editor';
import { Input } from '@/components/ui/input';
import { useKnowledgeDialogStoreShallow } from '../store';

const AddTextSnippet = () => {
  const { textSnippet, setTextSnippet } = useKnowledgeDialogStoreShallow(s => ({
    textSnippet: s.textSnippet,
    setTextSnippet: s.setTextSnippet,
  }));
  return (
    <div>
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-900">Title</span>
        <Input
          className="w-full"
          value={textSnippet.title}
          onChange={e =>
            setTextSnippet({
              title: (e.target as HTMLInputElement).value,
              content: textSnippet.content,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="block text-sm font-medium text-neutral-900">Content</span>
        <TextEditor
          content={textSnippet.content}
          setContent={content => setTextSnippet({ title: textSnippet.title, content })}
        />
      </div>
    </div>
  );
};

export default AddTextSnippet;
