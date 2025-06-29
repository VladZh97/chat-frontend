import { getMediaUploadToken, uploadFile } from '@/api/media';
import { environment } from '@/environment';
import { useMutation } from '@tanstack/react-query';

const useUploadFile = () => {
  const { mutateAsync: uploadFileFn, isPending: loading } = useMutation({
    mutationFn: async (file: File) => {
      const { url, fields } = await getMediaUploadToken(file.type);
      await uploadFile({ url, fields }, file);
      return `${environment.assetsBaseUrl}/${fields.key}`;
    },
  });

  return { uploadFileFn, loading };
};

export default useUploadFile;
