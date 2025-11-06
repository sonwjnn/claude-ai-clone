'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Artifact } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

interface MermaidArtifactProps {
  artifact: Artifact;
}

export function MermaidArtifact({ artifact }: MermaidArtifactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    });
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-diagram', artifact.content);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 p-4">Failed to render diagram</div>`;
        }
      }
    };

    renderDiagram();
  }, [artifact.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{artifact.title}</span>
          <span className="text-xs text-muted-foreground">(Mermaid Diagram)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="p-6 bg-white dark:bg-gray-50 flex items-center justify-center overflow-x-auto">
        <div ref={containerRef} />
      </div>
    </div>
  );
}
