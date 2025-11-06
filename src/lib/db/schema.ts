import { pgTable, text, timestamp, varchar, integer, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversations table
export const conversations = pgTable(
  'conversations',
  {
    id: varchar('id', { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    title: varchar('title', { length: 255 }).default('New Chat').notNull(),
    userId: varchar('user_id', { length: 128 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdUpdatedAtIdx: index('conversations_user_id_updated_at_idx').on(
      table.userId,
      table.updatedAt
    ),
  })
);

// Messages table
export const messages = pgTable(
  'messages',
  {
    id: varchar('id', { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    content: text('content').notNull(),
    role: varchar('role', { length: 50 }).notNull(), // 'user' | 'assistant'
    conversationId: varchar('conversation_id', { length: 128 })
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    userId: varchar('user_id', { length: 128 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    conversationIdCreatedAtIdx: index('messages_conversation_id_created_at_idx').on(
      table.conversationId,
      table.createdAt
    ),
  })
);

// Artifacts table
export const artifacts = pgTable(
  'artifacts',
  {
    id: varchar('id', { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'code' | 'react' | 'html' | 'mermaid' | 'svg'
    language: varchar('language', { length: 50 }), // For code artifacts
    content: text('content').notNull(),
    messageId: varchar('message_id', { length: 128 })
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
    userId: varchar('user_id', { length: 128 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    version: integer('version').default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    messageIdIdx: index('artifacts_message_id_idx').on(table.messageId),
    userIdIdx: index('artifacts_user_id_idx').on(table.userId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  messages: many(messages),
  artifacts: many(artifacts),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  artifacts: many(artifacts),
}));

export const artifactsRelations = relations(artifacts, ({ one }) => ({
  message: one(messages, {
    fields: [artifacts.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [artifacts.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Artifact = typeof artifacts.$inferSelect;
export type NewArtifact = typeof artifacts.$inferInsert;
