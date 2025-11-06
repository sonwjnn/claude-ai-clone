'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Artifact } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeArtifactProps {
  artifact: Artifact;
}

export function CodeArtifact({ artifact }: CodeArtifactProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

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
          {artifact.language && (
            <span className="text-xs text-muted-foreground">({artifact.language})</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={artifact.language || 'javascript'}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
          }}
          showLineNumbers
        >
          {artifact.content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
