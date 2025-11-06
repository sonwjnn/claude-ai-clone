import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { conversations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const moveFolderSchema = z.object({
  folderId: z.string().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then((mod) => mod.headers()),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { folderId } = moveFolderSchema.parse(body);

    const [updated] = await db
      .update(conversations)
      .set({ folderId, updatedAt: new Date() })
      .where(
        and(
          eq(conversations.id, params.id),
          eq(conversations.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error moving conversation to folder:', error);
    return NextResponse.json(
      { error: 'Failed to move conversation' },
      { status: 500 }
    );
  }
}
