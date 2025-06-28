import { cn } from '@/lib/utils';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
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

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-11 items-center gap-2 rounded-t-lg border-b border-neutral-200 px-3 py-1.5 shadow">
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger className="flex h-8 w-[150px] cursor-pointer items-center justify-between gap-1 rounded-md border border-neutral-200 px-2 py-1.5 text-sm font-normal text-neutral-900 shadow-sm">
            {editor.isActive('paragraph') ||
            (!editor.isActive('heading', { level: 1 }) &&
              !editor.isActive('heading', { level: 2 }) &&
              !editor.isActive('heading', { level: 3 }))
              ? 'Normal text'
              : ''}
            {editor.isActive('heading', { level: 1 }) && 'Headline 1'}
            {editor.isActive('heading', { level: 2 }) && 'Headline 2'}
            {editor.isActive('heading', { level: 3 }) && 'Headline 3'}
            <ChevronsUpDown className="size-4 text-neutral-500" />
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            className="z-[999] w-44 space-y-1 rounded-lg bg-white p-1 shadow-lg"
          >
            <span
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-100',
                editor.isActive('paragraph') && 'bg-neutral-100'
              )}
            >
              Normal text
              {editor.isActive('paragraph') && <Check className="size-4 text-neutral-900" />}
            </span>
            <span
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-100',
                editor.isActive('heading', { level: 1 }) && 'bg-neutral-100'
              )}
            >
              Headline 1
              {editor.isActive('heading', { level: 1 }) && (
                <Check className="size-4 text-neutral-900" />
              )}
            </span>
            <span
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-100',
                editor.isActive('heading', { level: 2 }) && 'bg-neutral-100'
              )}
            >
              Headline 2
              {editor.isActive('heading', { level: 2 }) && (
                <Check className="size-4 text-neutral-900" />
              )}
            </span>
            <span
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-100',
                editor.isActive('heading', { level: 3 }) && 'bg-neutral-100'
              )}
            >
              Headline 3
              {editor.isActive('heading', { level: 3 }) && (
                <Check className="size-4 text-neutral-900" />
              )}
            </span>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
            editor.isActive('bold') && 'bg-neutral-200 hover:bg-neutral-200'
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4 text-neutral-900" />
        </span>
        <span
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
            editor.isActive('italic') && 'bg-neutral-200 hover:bg-neutral-200'
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4 text-neutral-900" />
        </span>
        <span
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
            editor.isActive('strike') && 'bg-neutral-200 hover:bg-neutral-200'
          )}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4 text-neutral-900" />
        </span>
        <span
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
            editor.isActive('underline') && 'bg-neutral-200 hover:bg-neutral-200'
          )}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="size-4 text-neutral-900" />
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
            editor.isActive('bulletList') && 'bg-neutral-200 hover:bg-neutral-200'
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4 text-neutral-900" />
        </span>
        <span
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100',
            editor.isActive('orderedList') && 'bg-neutral-200 hover:bg-neutral-200'
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4 text-neutral-900" />
        </span>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  UnderlineExtension,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

export const TextEditor = ({
  content = '',
  setContent,
}: {
  content?: string;
  setContent: (content: string) => void;
}) => {
  return (
    <div className="tiptap rounded-lg border border-neutral-200 bg-white shadow-sm outline-none">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => setContent(editor.getHTML())}
      />
    </div>
  );
};
