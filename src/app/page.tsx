import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then((mod) => mod.headers()),
  });

  if (session?.user) {
    redirect('/chat');
  } else {
    redirect('/login');
  }
}
