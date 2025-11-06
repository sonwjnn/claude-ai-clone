import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(10000, 'Message is too long'),
  conversationId: z.string().optional(),
});

export const conversationSchema = z.object({
  title: z.string().min(1).max(255),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type ConversationInput = z.infer<typeof conversationSchema>;
