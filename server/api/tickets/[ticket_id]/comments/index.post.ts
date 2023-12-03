import type { InferInsertModel } from 'drizzle-orm';
import { ticketCommentSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const _ticketId = getRouterParam(event, 'ticket_id');
  if (!_ticketId) {
    throw createError({
      message: 'ticket_id is required',
      status: 400,
    });
  }
  const ticketId = parseInt(_ticketId, 10);

  const { content, type } = await readBody<{
    content?: string;
    type?: string;
  }>(event);

  if (!type) {
    throw createError({
      message: 'type is required',
      status: 400,
    });
  }

  if (!content) {
    throw createError({
      message: 'content is required',
      status: 400,
    });
  }

  const ticket: InferInsertModel<typeof ticketCommentSchema> = {
    ticketId,
    type,
    content,
    agentId: user.id,
    createdAt: new Date(),
  };

  const comments = await db.insert(ticketCommentSchema).values(ticket).returning();
  return comments?.[0];
});
