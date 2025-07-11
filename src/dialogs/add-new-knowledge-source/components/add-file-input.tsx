import { useState } from 'preact/hooks';
import { FileText, Trash, Upload, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useKnowledgeDialogStoreShallow } from '../store';

const FILE_ACCEPT = '.pdf, .doc, .txt, .docx';
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const getFileMetadata = (file: File) => {
  const [name, extension] = file.name.split('.');
  return {
    name,
    size: file.size,
    type: file.type,
    extension,
  };
};

const isValidFileType = (type: string) =>
  [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ].includes(type);

const AddFileInput = () => {
  const { selectedFile, setSelectedFile } = useKnowledgeDialogStoreShallow(state => ({
    selectedFile: state.selectedFile,
    setSelectedFile: state.setSelectedFile,
  }));
  const [isFileTooBig, setIsFileTooBig] = useState(false);

  const handleFileSelect = () => {
    if (selectedFile) return;
    setIsFileTooBig(false);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = FILE_ACCEPT;

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      if (!isValidFileType(file.type)) {
        console.error('Only PDF, DOC, TXT files are allowed');
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setIsFileTooBig(true);
        console.error('File size exceeds 5MB limit');
        return;
      }

      setSelectedFile({ file, metadata: getFileMetadata(file) });
      input.remove();
    };

    input.click();
  };

  const fileSizeMB =
    selectedFile?.metadata.size != null
      ? Math.max(1, Math.round((selectedFile.metadata.size as number) / (1024 * 1024)))
      : 1;

  return (
    <div
      className={cn(
        'flex h-[168px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-3',
        selectedFile && 'cursor-default',
        isFileTooBig && 'border-red-300 bg-red-50'
      )}
      onClick={handleFileSelect}
    >
      {selectedFile ? (
        <div className="flex h-14 w-full items-center justify-between rounded-lg border border-neutral-200 bg-neutral-100 px-3 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="size-4 shrink-0 text-neutral-900" />
            <span className="grid grid-cols-[auto_auto] text-sm font-normal text-neutral-900">
              <span className="truncate">{selectedFile.metadata.name as string}</span>
              <span>.{selectedFile.metadata.extension as string}</span>
            </span>
          </div>
          <div className="ml-10 flex items-center gap-2">
            <span className="flex items-center justify-center rounded-md bg-neutral-200 px-1.5 py-0.5 text-xs font-normal text-neutral-500 uppercase">
              {fileSizeMB}MB
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="w-8 px-0"
              onClick={e => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ) : isFileTooBig ? (
        <TooBigFileContent setIsFileTooBig={setIsFileTooBig} />
      ) : (
        <UploadFileContent />
      )}
    </div>
  );
};

export default AddFileInput;

const TooBigFileContent = ({ setIsFileTooBig }: { setIsFileTooBig: (value: boolean) => void }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <AlertCircle className="mb-2 size-7 text-red-500" />
      <span className="mb-1 text-sm font-medium text-red-600">File is too big</span>
      <span className="mb-3 text-xs text-red-600">
        Please select a file smaller than {MAX_FILE_SIZE_MB}MB
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={e => {
          e.stopPropagation();
          setIsFileTooBig(false);
        }}
      >
        Try again
      </Button>
    </div>
  );
};

const UploadFileContent = () => {
  return (
    <>
      <Upload />
      <span className="my-[10px] text-sm font-normal text-neutral-700">
        <strong className="font-semibold">Click to upload</strong> or drag and drop
      </span>
      <span className="text-xs font-medium text-neutral-500">PDF, DOC, TXT (max 5MB)</span>
    </>
  );
};
