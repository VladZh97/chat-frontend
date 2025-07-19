import api from './api';

const getMediaUploadToken = async (contentType: string) => {
  const response = await api.get('/media/upload', {
    params: {
      contentType,
    },
  });
  return response.data;
};

const uploadFile = async (data: { url: string; fields: Record<string, string> }, file: Blob) => {
  const uploadRes = await fetch(data.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
  }
};

export { getMediaUploadToken, uploadFile };
