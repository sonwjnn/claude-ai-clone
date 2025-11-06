import axios from '@/lib/api/axios';
import { MessageWithArtifacts } from '../types/chat.types';

export async function getMessages(conversationId: string): Promise<MessageWithArtifacts[]> {
  const { data } = await axios.get(`/api/messages?conversationId=${conversationId}`);
  return data;
}
