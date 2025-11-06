'use client';

import { Artifact } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useArtifactStore } from '@/modules/artifacts/stores/artifact-store';
import { Code2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ArtifactCardProps {
  artifact: Artifact;
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const { openArtifact } = useArtifactStore();

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'code':
        return '💻';
      case 'react':
        return '⚛️';
      case 'html':
        return '🌐';
      case 'mermaid':
        return '📊';
      default:
        return '📄';
    }
  };

  return (
    <div className="group relative rounded-lg border bg-gradient-to-br from-muted/50 to-muted/20 p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getArtifactIcon(artifact.type)}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{artifact.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {artifact.type}
                </Badge>
                {artifact.language && (
                  <Badge variant="outline" className="text-xs">
                    {artifact.language}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-3 rounded bg-muted/50 p-2">
            <code className="text-xs text-muted-foreground line-clamp-2">
              {artifact.content.slice(0, 100)}...
            </code>
          </div>
        </div>

        {/* Open Button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => openArtifact(artifact)}
        >
          <Maximize2 className="h-3 w-3" />
          <span>Open</span>
        </Button>
      </div>

      {/* Quick Open on Click */}
      <button
        onClick={() => openArtifact(artifact)}
        className="absolute inset-0 cursor-pointer"
        aria-label="Open artifact"
      />
    </div>
  );
}
