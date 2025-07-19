import { getMediaUploadToken, uploadFile } from '@/api/media';
import { environment } from '@/environment';
import { useMutation } from '@tanstack/react-query';

const useUploadFile = () => {
  const { mutateAsync: uploadFileFn, isPending: loading } = useMutation({
    mutationFn: async (file: File) => {
      const { token, path } = await getMediaUploadToken(file.type);
      await uploadFile(token, file);
      return `${environment.assetsBaseUrl}/${path}`;
    },
  });

  return { uploadFileFn, loading };
};

export default useUploadFile;
