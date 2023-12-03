import { ticketSchema } from '~/server/schemas';
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

  const { customerId, title, priority, assigneeId, status } = await readBody<{
    customerId?: number;
    title?: string;
    priority?: number;
    assigneeId?: number;
    status?: string;
  }>(event);

  const tickets = await db
    .update(ticketSchema)
    .set({
      status,
      title,
      priority,
      assigneeId,
    })
    .where(eq(ticketSchema.id, ticketId))
    .returning();

  return tickets?.[0];
});
