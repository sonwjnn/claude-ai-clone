import { create } from 'zustand';
import { Artifact } from '@/lib/db/schema';

interface ArtifactState {
  selectedArtifact: Artifact | null;
  isPanelOpen: boolean;
  openArtifact: (artifact: Artifact) => void;
  closePanel: () => void;
}

export const useArtifactStore = create<ArtifactState>((set) => ({
  selectedArtifact: null,
  isPanelOpen: false,
  openArtifact: (artifact) =>
    set({
      selectedArtifact: artifact,
      isPanelOpen: true,
    }),
  closePanel: () =>
    set({
      selectedArtifact: null,
      isPanelOpen: false,
    }),
}));
