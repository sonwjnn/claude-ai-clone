'use client';

import { ClaudeHeader } from './claude-header';
import { ClaudeSidebar } from './claude-sidebar';
import { ArtifactPanel } from '@/modules/artifacts/ui/components/artifact-panel';
import { CommandPalette } from '@/components/common/command-palette';
import { useArtifactStore } from '@/modules/artifacts/stores/artifact-store';

export function ClaudeLayout({ children }: { children: React.ReactNode }) {
  const { selectedArtifact, isPanelOpen, closePanel } = useArtifactStore();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ClaudeHeader />
      <div className="flex flex-1 overflow-hidden">
        <ClaudeSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>

        {/* Artifact Panel */}
        <ArtifactPanel
          artifact={selectedArtifact}
          isOpen={isPanelOpen}
          onClose={closePanel}
        />
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
