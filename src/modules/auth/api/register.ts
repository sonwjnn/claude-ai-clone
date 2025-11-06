import axios from '@/lib/api/axios';
import { RegisterInput } from '../schemas/auth.schema';

export async function register(data: Omit<RegisterInput, 'confirmPassword'>) {
  const response = await axios.post('/api/auth/register', data);
  return response.data;
}
