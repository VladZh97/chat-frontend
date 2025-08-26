import axios from 'axios';
import { auth } from '@/lib/auth';
import { environment } from '@/environment';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: environment.api,
});

api.interceptors.request.use(async config => {
  const authToken = await auth.currentUser?.getIdToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      toast.error('Rate limit exceeded. Please wait a moment before trying again.');
    }
    return Promise.reject(error);
  }
);

export default api;
