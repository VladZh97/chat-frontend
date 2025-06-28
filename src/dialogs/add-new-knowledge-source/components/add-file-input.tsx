import { Upload } from 'lucide-react';

const AddFileInput = () => {
  const handleFileSelect = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf, .doc, .txt, .docx';

    // Handle file selection
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      // Validate file type
      if (
        file.type !== 'application/pdf' &&
        file.type !== 'application/msword' &&
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.type !== 'text/plain'
      ) {
        console.error('Only PDF, DOC, TXT files are allowed');
        return;
      }

      // Validate file size (e.g., 10MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        console.error('File size exceeds 5MB limit');
        return;
      }

      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        extension: file.name.split('.').pop(),
      };

      //   await handleFileUpload(file);

      // Clean up
      input.remove();
    };

    // Trigger file selection
    input.click();
  };
  return (
    <div
      className="flex h-[168px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-3"
      onClick={handleFileSelect}
    >
      <Upload />
      <span className="my-[10px] text-sm font-normal text-neutral-700">
        <strong className="font-semibold">Click to upload</strong> or drag and drop
      </span>
      <span className="text-xs font-medium text-neutral-500">PDF, DOC, TXT (max 5MB)</span>
    </div>
  );
};

export default AddFileInput;
