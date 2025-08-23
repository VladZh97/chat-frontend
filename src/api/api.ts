import axios from 'axios';
import { auth } from '@/lib/auth';
import { environment } from '@/environment';

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

export default api;
