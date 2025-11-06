import axios from '@/lib/api/axios';
import { ConversationWithLastMessage } from '../types/chat.types';

export async function getConversations(): Promise<ConversationWithLastMessage[]> {
  const { data } = await axios.get('/api/conversations');
  return data;
}
