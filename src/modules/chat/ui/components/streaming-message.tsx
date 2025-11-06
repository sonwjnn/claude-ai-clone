import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArtifactViewer } from '@/modules/artifacts/ui/components/artifact-viewer';
import { Bot } from 'lucide-react';
import { Artifact } from '@/lib/db/schema';

interface StreamingMessageProps {
  content: string;
  artifacts: Artifact[];
}

export function StreamingMessage({ content, artifacts }: StreamingMessageProps) {
  return (
    <div className={cn('flex gap-4 p-6 transition-colors bg-muted/50')}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-secondary">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4 min-w-0">
        <div className="text-sm font-medium">Claude</div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap break-words">
            {content}
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
          </p>
        </div>

        {artifacts.length > 0 && (
          <div className="space-y-4 mt-4">
            {artifacts.map((artifact, index) => (
              <ArtifactViewer key={`streaming-${index}`} artifact={artifact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
