import { MessageWithArtifacts } from '../../types/chat.types';
import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArtifactViewer } from '@/modules/artifacts/ui/components/artifact-viewer';
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
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={cn(isUser ? 'bg-primary' : 'bg-secondary')}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4 min-w-0">
        <div className="text-sm font-medium">{isUser ? 'You' : 'Claude'}</div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {message.artifacts && message.artifacts.length > 0 && (
          <div className="space-y-4 mt-4">
            {message.artifacts.map((artifact) => (
              <ArtifactViewer key={artifact.id} artifact={artifact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
