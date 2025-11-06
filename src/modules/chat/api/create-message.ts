import axios from '@/lib/api/axios';
import { MessageInput } from '../schemas/message.schema';
import { Message } from '@/lib/db/schema';

export async function createMessage(data: MessageInput): Promise<Message> {
  const { data: message } = await axios.post('/api/messages', data);
  return message;
}
