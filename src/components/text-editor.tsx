// TextEditor.tsx

import { cn } from '@/lib/utils';
import TextStyle from '@tiptap/extension-text-style';
import { Editor, EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Check,
  ChevronsUpDown,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-react';
import UnderlineExtension from '@tiptap/extension-underline';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const HEADING_OPTIONS = [
  {
    label: 'Normal text',
    isActive: (editor: Editor) => editor.isActive('paragraph'),
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: 'Headline 1',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 1 }),
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: 'Headline 2',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 2 }),
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Headline 3',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 3 }),
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
];

const FORMAT_OPTIONS = [
  {
    icon: Bold,
    name: 'bold',
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    icon: Italic,
    name: 'italic',
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    icon: Strikethrough,
    name: 'strike',
    action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    icon: Underline,
    name: 'underline',
    action: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
  },
];

const LIST_OPTIONS = [
  {
    icon: List,
    name: 'bulletList',
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    icon: ListOrdered,
    name: 'orderedList',
    action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },
];

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const getCurrentHeadingLabel = () => {
    for (const opt of HEADING_OPTIONS) {
      if (opt.isActive(editor)) return opt.label;
    }
    return 'Normal text';
  };

  return (
    <div className="flex h-11 items-center gap-2 rounded-t-lg border-b border-neutral-200 px-3 py-1.5 shadow">
      {/* Heading Dropdown */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger className="flex h-8 w-[150px] cursor-pointer items-center justify-between gap-1 rounded-md border border-neutral-200 px-2 py-1.5 text-sm font-normal text-neutral-900 shadow-sm">
            {getCurrentHeadingLabel()}
            <ChevronsUpDown className="size-4 text-neutral-500" />
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            className="z-[999] w-44 space-y-1 rounded-lg bg-white p-1 shadow-lg"
          >
            {HEADING_OPTIONS.map(opt => (
              <span
                key={opt.label}
                onClick={() => opt.action(editor)}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-100',
                  opt.isActive(editor) && 'bg-neutral-100'
                )}
              >
                {opt.label}
                {opt.isActive(editor) && <Check className="size-4 text-neutral-900" />}
              </span>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      {/* Format Buttons */}
      <div className="flex items-center gap-1">
        {FORMAT_OPTIONS.map(({ icon: Icon, name, action }) => (
          <span
            key={name}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
              editor.isActive(name) && 'bg-neutral-200 hover:bg-neutral-200'
            )}
            onClick={() => action(editor)}
          >
            <Icon className="size-4 text-neutral-900" />
          </span>
        ))}
      </div>
      {/* List Buttons */}
      <div className="flex items-center gap-1">
        {LIST_OPTIONS.map(({ icon: Icon, name, action }) => (
          <span
            key={name}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
              editor.isActive(name) && 'bg-neutral-200 hover:bg-neutral-200'
            )}
            onClick={() => action(editor)}
          >
            <Icon className="size-4 text-neutral-900" />
          </span>
        ))}
      </div>
    </div>
  );
};

export const TextEditor = ({
  content = '',
  setContent,
}: {
  content?: string;
  setContent: (content: string) => void;
}) => (
  <div className="tiptap rounded-lg border border-neutral-200 bg-white shadow-sm outline-none">
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={[
        TextStyle,
        UnderlineExtension,
        StarterKit.configure({
          bulletList: { keepMarks: true, keepAttributes: false },
          orderedList: { keepMarks: true, keepAttributes: false },
        }),
      ]}
      content={content}
      onUpdate={({ editor }) => setContent(editor.getHTML())}
    />
  </div>
);
