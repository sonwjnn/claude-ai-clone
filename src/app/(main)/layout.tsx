import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { MainLayout } from '@/components/layouts/main-layout';

export default async function MainAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <MainLayout>{children}</MainLayout>;
}
