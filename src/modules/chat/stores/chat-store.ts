import { create } from 'zustand';

interface ChatState {
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentConversationId: null,
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}));
