import { Artifact } from '@/lib/db/schema';
import { CodeArtifact } from './code-artifact';
import { ReactArtifact } from './react-artifact';
import { HtmlArtifact } from './html-artifact';
import { MermaidArtifact } from './mermaid-artifact';

interface ArtifactViewerProps {
  artifact: Artifact;
}

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  switch (artifact.type) {
    case 'code':
      return <CodeArtifact artifact={artifact} />;
    case 'react':
      return <ReactArtifact artifact={artifact} />;
    case 'html':
      return <HtmlArtifact artifact={artifact} />;
    case 'mermaid':
      return <MermaidArtifact artifact={artifact} />;
    default:
      return (
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            Unsupported artifact type: {artifact.type}
          </div>
        </div>
      );
  }
}
