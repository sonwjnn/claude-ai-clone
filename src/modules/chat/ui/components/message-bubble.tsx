import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MessageWithArtifacts } from '../../types/chat.types';
import { ArtifactViewer } from '@/modules/artifacts/ui/components/artifact-viewer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatTime } from '@/lib/utils/format';
import {
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
} from 'lucide-react';

interface MessageBubbleProps {
  message: MessageWithArtifacts;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onRate?: (rating: 'good' | 'bad') => void;
}

export function MessageBubble({ message, onRegenerate, onEdit, onRate }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRate = (r: 'good' | 'bad') => {
    setRating(r);
    onRate?.(r);
  };

  return (
    <div
      className={cn(
        'group relative px-4 py-8 transition-colors hover:bg-muted/30',
        isUser ? 'bg-background' : 'bg-muted/10'
      )}
    >
      <div className="mx-auto flex max-w-3xl gap-4">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback
            className={cn(
              'text-sm font-medium',
              isUser
                ? 'bg-gradient-to-br from-purple-400 to-pink-600 text-white'
                : 'bg-gradient-to-br from-orange-400 to-pink-600 text-white'
            )}
          >
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">{isUser ? 'You' : 'Claude'}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
            {message.isEdited && (
              <Badge variant="outline" className="text-xs">
                Edited
              </Badge>
            )}
          </div>

          {/* Message Content with Markdown */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';

                  return !inline && language ? (
                    <div className="not-prose relative">
                      <div className="absolute right-2 top-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={language}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Artifacts */}
          {message.artifacts && message.artifacts.length > 0 && (
            <div className="space-y-4">
              {message.artifacts.map((artifact) => (
                <ArtifactViewer key={artifact.id} artifact={artifact} />
              ))}
            </div>
          )}

          {/* Action Buttons (for assistant messages) */}
          {!isUser && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1 px-2"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-8 gap-1 px-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-xs">Regenerate</span>
              </Button>

              <div className="mx-1 h-4 w-px bg-border" />

              <Button
                variant={rating === 'good' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleRate('good')}
                className="h-8 px-2"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>

              <Button
                variant={rating === 'bad' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleRate('bad')}
                className="h-8 px-2"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Action Buttons (for user messages) */}
          {isUser && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 gap-1 px-2">
                <Pencil className="h-3 w-3" />
                <span className="text-xs">Edit</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1 px-2">
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
