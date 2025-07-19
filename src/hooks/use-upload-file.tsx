import { media } from '@/api/media';
import { environment } from '@/environment';
import { useMutation } from '@tanstack/react-query';

const useUploadFile = () => {
  const { mutateAsync: uploadFileFn, isPending: loading } = useMutation({
    mutationFn: async (file: File) => {
      const { token, path } = await media.upload.query(file.type);
      await media.uploadFile.query(token, file);
      return `${environment.assetsBaseUrl}/${path}`;
    },
  });

  return { uploadFileFn, loading };
};

export default useUploadFile;
