import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { ClaudeLayout } from '@/components/layouts/claude-layout';

export default async function MainAppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then((mod) => mod.headers()),
  });

  if (!session) {
    redirect('/login');
  }

  return <ClaudeLayout>{children}</ClaudeLayout>;
}
