import api from './api';

type DataType = {
  url: string;
  fields: Record<string, string>;
};

const getMediaUploadToken = async (contentType: string) => {
  const response = await api.get('/media/upload', {
    params: {
      contentType,
    },
  });
  return response.data;
};

const uploadFile = async (data: DataType, file: Blob) => {
  const formData = new FormData();
  Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });

  return await fetch(data.url, {
    method: 'POST',
    body: formData,
  });
};

export { getMediaUploadToken, uploadFile };
