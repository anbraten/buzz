import { ticketSchema } from '../../schemas';
import type { InferInsertModel } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const { customerId, title, priority, assigneeId } = await readBody<{
    customerId?: number;
    title?: string;
    priority?: number;
    assigneeId?: number;
  }>(event);

  if (!customerId) {
    throw createError({
      message: 'customerId is required',
      status: 400,
    });
  }

  if (!title) {
    throw createError({
      message: 'title is required',
      status: 400,
    });
  }

  const ticket: InferInsertModel<typeof ticketSchema> = {
    assigneeId: assigneeId ?? user.id,
    priority: priority ?? 0, // 0 = low, ..., 5 = high
    status: 'open',
    title,
    customerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const tickets = await db.insert(ticketSchema).values(ticket).returning();
  return tickets?.[0];
});
