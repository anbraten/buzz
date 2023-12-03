import { ticketCommentSchema, ticketSchema } from '~/server/schemas';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const _ticketId = event.context.params?.ticket_id;
  if (!_ticketId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ticket_id is required',
    });
  }
  const ticketId = parseInt(_ticketId, 10);

  await db.delete(ticketSchema).where(eq(ticketSchema.id, ticketId)).run();
  await db.delete(ticketCommentSchema).where(eq(ticketCommentSchema.ticketId, ticketId)).run();

  return 'ok';
});
