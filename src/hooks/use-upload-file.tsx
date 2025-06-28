import { getMediaUploadToken, uploadFile } from '@/api/media';
import { useCallback, useState } from 'preact/hooks';

const useUploadFile = () => {
  const [loading, setLoading] = useState(false);

  const uploadFileFn = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const { url, fields } = await getMediaUploadToken(file.type);
      const uploadResponse = await uploadFile({ url, fields }, file);
      return uploadResponse;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadFileFn, loading };
};

export default useUploadFile;
