'use client';

import { useEffect, useRef, useState } from 'react';
import { Artifact } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Copy, Check, Maximize2 } from 'lucide-react';

interface HtmlArtifactProps {
  artifact: Artifact;
}

export function HtmlArtifact({ artifact }: HtmlArtifactProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(artifact.content);
    doc.close();
  }, [artifact.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{artifact.title}</span>
          <span className="text-xs text-muted-foreground">(HTML)</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="bg-white">
        <iframe
          ref={iframeRef}
          className="w-full h-[400px] border-0"
          sandbox="allow-scripts"
          title={artifact.title}
        />
      </div>
    </div>
  );
}
