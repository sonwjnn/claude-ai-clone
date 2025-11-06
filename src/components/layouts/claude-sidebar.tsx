'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useConversations, useCreateConversation } from '@/modules/chat/hooks/use-conversations';
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
  const createConversation = useCreateConversation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const handleNewChat = async () => {
    try {
      const newConv = await createConversation.mutateAsync();
      router.push(`/chat/${newConv.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  // Filter conversations by search
  const filteredConversations = conversations?.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations
  const pinnedConversations = filteredConversations?.filter((c) => c.isPinned && !c.isArchived);
  const recentConversations = filteredConversations?.filter((c) => !c.isPinned && !c.isArchived);
  const archivedConversations = filteredConversations?.filter((c) => c.isArchived);

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
      {/* New Chat Button */}
      <div className="p-2">
        <Button onClick={handleNewChat} className="w-full gap-2" size="sm">
          <MessageSquarePlus className="h-4 w-4" />
          New chat
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
                    />
                  ))}
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
    </div>
  );
}

// Conversation Item Component
function ConversationItem({
  conversation,
  isActive,
}: {
  conversation: any;
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
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
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="mr-2 h-4 w-4" />
                {conversation.isPinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                {conversation.isArchived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
