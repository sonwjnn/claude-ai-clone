'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useConversations, useCreateConversation } from '@/modules/chat/hooks/use-conversations';
import {
  useRenameConversation,
  usePinConversation,
  useArchiveConversation,
  useDeleteConversation,
} from '@/modules/chat/hooks/use-conversation-actions';
import {
  useFolders,
  useCreateFolder,
  useDeleteFolder,
  useMoveToFolder,
} from '@/modules/folders/hooks/use-folders';
import { RenameConversationDialog } from '@/components/dialogs/rename-conversation-dialog';
import { CreateFolderDialog } from '@/components/dialogs/create-folder-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import {
  MessageSquarePlus,
  Search,
  Pin,
  Archive,
  Folder,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

export function ClaudeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: conversations, isLoading } = useConversations();
  const { data: folders } = useFolders();
  const createConversation = useCreateConversation();
  const createFolderMutation = useCreateFolder();
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleNewChat = async () => {
    try {
      const newConv = await createConversation.mutateAsync();
      router.push(`/chat/${newConv.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleCreateFolder = (name: string, color?: string) => {
    createFolderMutation.mutate({ name, color }, {
      onSuccess: () => setCreateFolderOpen(false),
    });
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Filter conversations by search
  const filteredConversations = conversations?.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations
  const pinnedConversations = filteredConversations?.filter((c) => c.isPinned && !c.isArchived && !c.folderId);
  const recentConversations = filteredConversations?.filter((c) => !c.isPinned && !c.isArchived && !c.folderId);
  const archivedConversations = filteredConversations?.filter((c) => c.isArchived);

  // Get conversations by folder
  const getConversationsInFolder = (folderId: string) => {
    return filteredConversations?.filter((c) => c.folderId === folderId && !c.isArchived) || [];
  };

  // Group by date
  const groupByDate = (convs: typeof conversations) => {
    if (!convs) return {};

    const groups: Record<string, typeof convs> = {
      Today: [],
      Yesterday: [],
      'Last 7 days': [],
      'Last 30 days': [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    convs.forEach((conv) => {
      const convDate = new Date(conv.updatedAt);
      if (convDate >= today) {
        groups['Today'].push(conv);
      } else if (convDate >= yesterday) {
        groups['Yesterday'].push(conv);
      } else if (convDate >= last7Days) {
        groups['Last 7 days'].push(conv);
      } else if (convDate >= last30Days) {
        groups['Last 30 days'].push(conv);
      } else {
        groups['Older'].push(conv);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  };

  const recentGroups = groupByDate(recentConversations);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      {/* New Chat & Create Folder Buttons */}
      <div className="p-2 space-y-2">
        <Button onClick={handleNewChat} className="w-full gap-2" size="sm">
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Button>
        <Button
          onClick={() => setCreateFolderOpen(true)}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          <Folder className="h-4 w-4" />
          New folder
        </Button>
      </div>

      {/* Search */}
      <div className="px-2 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Separator />

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              {/* Pinned Conversations */}
              {pinnedConversations && pinnedConversations.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-1 px-2 text-xs font-semibold text-muted-foreground">
                    <Pin className="h-3 w-3" />
                    <span>PINNED</span>
                  </div>
                  {pinnedConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={pathname === `/chat/${conv.id}`}
                      folders={folders}
                    />
                  ))}
                </div>
              )}

              {/* Folders */}
              {folders && folders.length > 0 && (
                <div className="mb-4">
                  {folders.map((folder) => {
                    const folderConvs = getConversationsInFolder(folder.id);
                    if (folderConvs.length === 0 && !searchQuery) return null;

                    const isExpanded = expandedFolders.has(folder.id);

                    return (
                      <div key={folder.id} className="mb-2">
                        <button
                          onClick={() => toggleFolder(folder.id)}
                          className="mb-1 flex w-full items-center gap-1 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <Folder className="h-3 w-3" />
                          <span className="flex-1 text-left truncate">{folder.name}</span>
                          <span className="text-xs">({folderConvs.length})</span>
                        </button>
                        {isExpanded && folderConvs.map((conv) => (
                          <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isActive={pathname === `/chat/${conv.id}`}
                            folders={folders}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent Conversations by Date */}
              {Object.entries(recentGroups).map(([group, convs]) => (
                <div key={group} className="mb-4">
                  <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                    {group.toUpperCase()}
                  </div>
                  {convs.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={pathname === `/chat/${conv.id}`}
                      folders={folders}
                    />
                  ))}
                </div>
              ))}

              {/* Archived Section */}
              {archivedConversations && archivedConversations.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowArchived(!showArchived)}
                    className="mb-2 flex w-full items-center gap-1 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    {showArchived ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <Archive className="h-3 w-3" />
                    <span>ARCHIVED ({archivedConversations.length})</span>
                  </button>
                  {showArchived &&
                    archivedConversations.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isActive={pathname === `/chat/${conv.id}`}
                        folders={folders}
                      />
                    ))}
                </div>
              )}

              {/* Empty State */}
              {filteredConversations?.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreate={handleCreateFolder}
        isLoading={createFolderMutation.isPending}
      />
    </div>
  );
}

// Conversation Item Component
function ConversationItem({
  conversation,
  isActive,
  folders,
}: {
  conversation: any;
  isActive: boolean;
  folders?: any[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const renameMutation = useRenameConversation();
  const pinMutation = usePinConversation();
  const archiveMutation = useArchiveConversation();
  const deleteMutation = useDeleteConversation();
  const moveToFolderMutation = useMoveToFolder();

  const handleRename = (id: string, title: string) => {
    renameMutation.mutate({ id, title }, {
      onSuccess: () => setRenameDialogOpen(false),
    });
  };

  const handlePin = (e: Event) => {
    e.preventDefault();
    pinMutation.mutate(conversation.id);
  };

  const handleArchive = (e: Event) => {
    e.preventDefault();
    archiveMutation.mutate(conversation.id);
  };

  const handleDelete = (e: Event) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteMutation.mutate(conversation.id);
    }
  };

  const handleMoveToFolder = (folderId: string | null) => {
    moveToFolderMutation.mutate({
      conversationId: conversation.id,
      folderId,
    });
  };

  return (
    <>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/chat/${conversation.id}`}
          className={cn(
            'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent/50 hover:text-accent-foreground'
          )}
        >
          <span className="flex-1 truncate">{conversation.title}</span>
          {conversation.isPinned && <Pin className="h-3 w-3 flex-shrink-0 text-muted-foreground" />}
        </Link>

        {/* Actions Menu */}
        {(isHovered || isActive) && (
          <div className="absolute right-1 top-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => setRenameDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handlePin}>
                  <Pin className="mr-2 h-4 w-4" />
                  {conversation.isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  {conversation.isArchived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                {folders && folders.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Folder className="mr-2 h-4 w-4" />
                      Move to folder
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {conversation.folderId && (
                        <>
                          <DropdownMenuItem onSelect={() => handleMoveToFolder(null)}>
                            Remove from folder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {folders.map((folder) => (
                        <DropdownMenuItem
                          key={folder.id}
                          onSelect={() => handleMoveToFolder(folder.id)}
                          disabled={conversation.folderId === folder.id}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          {folder.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <RenameConversationDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        conversationId={conversation.id}
        currentTitle={conversation.title}
        onRename={handleRename}
        isLoading={renameMutation.isPending}
      />
    </>
  );
}
