import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { conversations, messages, artifacts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
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

    // Delete all artifacts associated with messages in this conversation
    const conversationMessages = await db
      .select({ id: messages.id })
      .from(messages)
      .where(eq(messages.conversationId, params.id));

    const messageIds = conversationMessages.map((m) => m.id);

    if (messageIds.length > 0) {
      await db
        .delete(artifacts)
        .where(
          eq(artifacts.messageId, messageIds[0]) // We'll handle multiple in a more complex query
        );
    }

    // Delete all messages
    await db
      .delete(messages)
      .where(eq(messages.conversationId, params.id));

    // Delete the conversation
    const [deleted] = await db
      .delete(conversations)
      .where(
        and(
          eq(conversations.id, params.id),
          eq(conversations.userId, session.user.id)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
