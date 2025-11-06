import { pgTable, text, timestamp, varchar, integer, index, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

// Users table (Better Auth compatible)
export const users = pgTable('user', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  name: varchar('name', { length: 255 }),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// Sessions table (Better Auth)
export const sessions = pgTable('session', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: timestamp('expiresAt').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: varchar('userId', { length: 128 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

// Accounts table (Better Auth)
export const accounts = pgTable('account', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: varchar('accountId', { length: 255 }).notNull(),
  providerId: varchar('providerId', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 128 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// Verifications table (Better Auth)
export const verifications = pgTable('verification', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
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
    model: varchar('model', { length: 50 }).default('claude-3-5-sonnet'),
    isArchived: boolean('is_archived').default(false),
    isPinned: boolean('is_pinned').default(false),
    folderId: varchar('folder_id', { length: 128 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdUpdatedAtIdx: index('conversations_user_id_updated_at_idx').on(
      table.userId,
      table.updatedAt
    ),
    userIdIsArchivedIdx: index('conversations_user_id_is_archived_idx').on(
      table.userId,
      table.isArchived
    ),
  })
);

// Folders table for conversation organization
export const folders = pgTable('folders', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 128 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
    parentId: varchar('parent_id', { length: 128 }).references(() => messages.id),
    isEdited: boolean('is_edited').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
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

// Attachments table for file uploads
export const attachments = pgTable('attachments', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  fileUrl: text('file_url').notNull(),
  messageId: varchar('message_id', { length: 128 })
    .references(() => messages.id, { onDelete: 'cascade' })
    .notNull(),
  userId: varchar('user_id', { length: 128 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  conversations: many(conversations),
  messages: many(messages),
  artifacts: many(artifacts),
  folders: many(folders),
  attachments: many(attachments),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [conversations.folderId],
    references: [folders.id],
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
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
  }),
  artifacts: many(artifacts),
  attachments: many(attachments),
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

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  message: one(messages, {
    fields: [attachments.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [attachments.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Artifact = typeof artifacts.$inferSelect;
export type NewArtifact = typeof artifacts.$inferInsert;

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
