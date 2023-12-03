import { ticketCommentSchema } from '~/server/schemas';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const _ticketId = getRouterParam(event, 'ticket_id');
  if (!_ticketId) {
    throw createError({
      message: 'ticket_id is required',
      status: 400,
    });
  }
  const ticketId = parseInt(_ticketId, 10);

  return await db.select().from(ticketCommentSchema).where(eq(ticketCommentSchema.ticketId, ticketId)).all();
});
