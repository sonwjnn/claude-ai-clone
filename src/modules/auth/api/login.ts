import axios from '@/lib/api/axios';
import { LoginInput } from '../schemas/auth.schema';

export async function login(data: LoginInput) {
  const response = await axios.post('/api/auth/login', data);
  return response.data;
}
