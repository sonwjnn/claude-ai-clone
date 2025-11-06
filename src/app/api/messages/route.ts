import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, conversations, artifacts } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then((mod) => mod.headers()),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Verify conversation belongs to user
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, session.user.id)
        )
      );

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get messages with artifacts
    const conversationMessages = await db
      .select({
        message: messages,
        artifact: artifacts,
      })
      .from(messages)
      .leftJoin(artifacts, eq(messages.id, artifacts.messageId))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    // Group artifacts by message
    const groupedMessages = conversationMessages.reduce((acc, row) => {
      const existingMessage = acc.find((m) => m.id === row.message.id);

      if (existingMessage) {
        if (row.artifact) {
          existingMessage.artifacts.push(row.artifact);
        }
      } else {
        acc.push({
          ...row.message,
          artifacts: row.artifact ? [row.artifact] : [],
        });
      }

      return acc;
    }, [] as any[]);

    return NextResponse.json(groupedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then((mod) => mod.headers()),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, conversationId } = body;

    if (!content || !conversationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify conversation belongs to user
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, session.user.id)
        )
      );

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        content,
        conversationId,
        userId: session.user.id,
        role: 'user',
      })
      .returning();

    // Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
