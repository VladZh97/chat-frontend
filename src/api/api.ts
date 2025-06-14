import axios from 'axios';
import { auth } from '@/lib/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(async config => {
  const authToken = await auth.currentUser?.getIdToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
