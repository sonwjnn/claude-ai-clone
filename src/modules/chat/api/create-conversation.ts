import axios from '@/lib/api/axios';
import { Conversation } from '@/lib/db/schema';

export async function createConversation(title?: string): Promise<Conversation> {
  const { data } = await axios.post('/api/conversations', { title: title || 'New Chat' });
  return data;
}
