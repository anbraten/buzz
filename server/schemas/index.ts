import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { InferSelectModel } from 'drizzle-orm';

export const userSchema = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  password: text('password'),
  avatarUrl: text('avatarUrl'),
});
export type User = InferSelectModel<typeof userSchema>;

export const ticketSchema = sqliteTable('tickets', {
  id: integer('id').primaryKey(),
  status: text('status').notNull(),
  title: text('title').notNull(),
  priority: integer('priority').notNull(), // 0 = low, ..., 5 = high
  assigneeId: integer('assigneeId'),
  customerId: integer('customerId').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
export type Ticket = InferSelectModel<typeof ticketSchema>;

export const ticketCommentSchema = sqliteTable('ticketComment', {
  id: integer('id').primaryKey(),
  ticketId: integer('ticketId').notNull(),
  type: text('type').notNull(), // customer-email, agent-reply, call, private-note
  agentId: integer('agentId'),
  content: text('content').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});
export type TicketComment = InferSelectModel<typeof ticketCommentSchema>;

export const ticketAttachmentSchema = sqliteTable('ticketAttachment', {
  id: integer('id').primaryKey(),
  ticketCommentId: integer('ticketCommentId').notNull(),
  url: text('url').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});
export type TicketAttachment = InferSelectModel<typeof ticketAttachmentSchema>;

export const customerSchema = sqliteTable('customers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatarUrl: text('avatarUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
export type Customer = InferSelectModel<typeof customerSchema>;
