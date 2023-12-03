import { eq } from 'drizzle-orm';
import { ticketSchema } from '../../../schemas';

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

  return await db.select().from(ticketSchema).where(eq(ticketSchema.id, ticketId)).get();
});
