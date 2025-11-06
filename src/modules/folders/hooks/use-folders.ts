import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Folder {
  id: string;
  name: string;
  color?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateFolderParams {
  name: string;
  color?: string;
}

interface UpdateFolderParams {
  id: string;
  name?: string;
  color?: string;
}

interface MoveToFolderParams {
  conversationId: string;
  folderId: string | null;
}

export function useFolders() {
  return useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await fetch('/api/folders');
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
      return response.json();
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, color }: CreateFolderParams) => {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateFolderParams) => {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update folder');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMoveToFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, folderId }: MoveToFolderParams) => {
      const response = await fetch(`/api/conversations/${conversationId}/folder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to move conversation');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
