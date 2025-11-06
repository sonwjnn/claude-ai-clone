'use client';

import { useEffect, useRef, useState } from 'react';
import { Artifact } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Copy, Check, Maximize2 } from 'lucide-react';

interface ReactArtifactProps {
  artifact: Artifact;
}

export function ReactArtifact({ artifact }: ReactArtifactProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Create sandbox HTML with React
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${artifact.content}
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
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
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{artifact.title}</span>
          <span className="text-xs text-muted-foreground">(React Component)</span>
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
      <div className="bg-white dark:bg-gray-100">
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
