import { MessageWithArtifacts } from '../../types/chat.types';
import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface MessageItemProps {
  message: MessageWithArtifacts;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 p-6 transition-colors',
        isUser ? 'bg-background' : 'bg-muted/50'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className={cn(isUser ? 'bg-primary' : 'bg-secondary')}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="text-sm font-medium">{isUser ? 'You' : 'Claude'}</div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.artifacts && message.artifacts.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="rounded-lg border p-4 bg-card text-card-foreground"
              >
                <div className="text-sm font-medium mb-2">{artifact.title}</div>
                <div className="text-xs text-muted-foreground">Type: {artifact.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
