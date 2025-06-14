import { getMediaUploadToken, uploadFile } from '@/api/media';
import { Button } from '@/components/ui/button';
import { LinkIcon, Type, Upload } from 'lucide-react';
import { useState } from 'react';

const Actions = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const uploadData = await getMediaUploadToken('application/pdf');
      await uploadFile(uploadData, file);
    } catch (error) {
      console.error('Failed to upload file:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';

    // Handle file selection
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      // Validate file type
      if (file.type !== 'application/pdf') {
        console.error('Only PDF files are allowed');
        return;
      }

      // Validate file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        console.error('File size exceeds 10MB limit');
        return;
      }

      await handleFileUpload(file);

      // Clean up
      input.remove();
    };

    // Trigger file selection
    input.click();
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" className="grow cursor-pointer">
        <LinkIcon />
        Add link
      </Button>
      <Button
        variant="outline"
        className="grow cursor-pointer"
        onClick={handleFileSelect}
        disabled={isUploading}
      >
        <Upload />
        {isUploading ? 'Uploading...' : 'Upload file'}
      </Button>
      <Button variant="outline" className="grow cursor-pointer">
        <Type />
        Add text
      </Button>
    </div>
  );
};

export default Actions;
