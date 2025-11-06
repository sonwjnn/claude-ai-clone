'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  MessageSquarePlus,
  Folder,
  Settings,
  Archive,
  Search,
  LogOut,
  Moon,
  Sun,
  Download,
} from 'lucide-react';
import { useConversations, useCreateConversation } from '@/modules/chat/hooks/use-conversations';
import { useTheme } from 'next-themes';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { data: conversations } = useConversations();
  const createConversation = useCreateConversation();
  const { theme, setTheme } = useTheme();

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false);
    callback();
  }, []);

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
    conv.title.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5); // Show only top 5 results

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleSelect(handleNewChat)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>New chat</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              handleSelect(() => setTheme(theme === 'dark' ? 'light' : 'dark'))
            }
          >
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle theme</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Recent Conversations */}
        {filteredConversations && filteredConversations.length > 0 && (
          <>
            <CommandGroup heading="Recent Conversations">
              {filteredConversations.map((conv) => (
                <CommandItem
                  key={conv.id}
                  onSelect={() => handleSelect(() => router.push(`/chat/${conv.id}`))}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span className="truncate">{conv.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleSelect(() => router.push('/'))}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
