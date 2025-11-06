'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Artifact } from '@/lib/db/schema';
import { ArtifactViewer } from '@/modules/artifacts/ui/components/artifact-viewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  History,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ArtifactPanelProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArtifactPanel({ artifact, isOpen, onClose }: ArtifactPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (artifact) {
      navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!artifact) return;

    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title}.${artifact.language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && artifact && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={cn(
            'fixed right-0 top-0 z-50 flex flex-col border-l bg-background shadow-2xl',
            isFullscreen ? 'h-screen w-screen' : 'h-screen w-[600px]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Code2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">{artifact.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {artifact.type}
                  </Badge>
                  {artifact.language && (
                    <Badge variant="outline" className="text-xs">
                      {artifact.language}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">v{artifact.version}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy code"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <ArtifactViewer artifact={artifact} />
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Created {new Date(artifact.createdAt).toLocaleDateString()}
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                View History
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
