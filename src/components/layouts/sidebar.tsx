'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useConversations, useCreateConversation } from '@/modules/chat/hooks/use-conversations';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { MessageSquarePlus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { logout } from '@/modules/auth/api/logout';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: conversations, isLoading } = useConversations();
  const createConversation = useCreateConversation();

  const handleNewChat = async () => {
    try {
      const newConv = await createConversation.mutateAsync();
      router.push(`/chat/${newConv.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-64 border-r bg-muted/10">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full" variant="outline">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner className="h-6 w-6" />
          </div>
        ) : (
          <div className="space-y-1 py-2">
            {conversations?.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors',
                  pathname === `/chat/${conv.id}` && 'bg-accent'
                )}
              >
                <span className="truncate">{conv.title}</span>
              </Link>
            ))}

            {conversations?.length === 0 && (
              <div className="text-center text-sm text-muted-foreground p-4">
                No conversations yet
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <Separator />

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
