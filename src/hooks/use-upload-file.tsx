import { getMediaUploadToken, uploadFile } from '@/api/media';
import { useMutation } from '@tanstack/react-query';

const useUploadFile = () => {
  const { mutateAsync: uploadFileFn, isPending: loading } = useMutation({
    mutationFn: async (file: File) => {
      const { url, fields } = await getMediaUploadToken(file.type);
      await uploadFile({ url, fields }, file);
      return fields.key;
    },
  });

  return { uploadFileFn, loading };
};

export default useUploadFile;
