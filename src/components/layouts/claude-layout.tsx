import { ClaudeHeader } from './claude-header';
import { ClaudeSidebar } from './claude-sidebar';

export function ClaudeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ClaudeHeader />
      <div className="flex flex-1 overflow-hidden">
        <ClaudeSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
