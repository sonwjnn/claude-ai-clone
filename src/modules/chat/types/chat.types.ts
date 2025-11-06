import { Message, Conversation, Artifact } from '@/lib/db/schema';

export interface MessageWithArtifacts extends Message {
  artifacts: Artifact[];
}

export interface ConversationWithLastMessage extends Conversation {
  lastMessage: Message | null;
}
