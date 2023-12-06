import { and, eq, not, isNull } from 'drizzle-orm';
import { ticketSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const { filter } = getQuery<{ filter?: 'new' | 'my' }>(event);

  if (filter === 'new') {
    return await db
      .select()
      .from(ticketSchema)
      .where(and(eq(ticketSchema.status, 'open'), isNull(ticketSchema.assigneeId)))
      .all();
  }

  if (filter === 'my') {
    return await db
      .select()
      .from(ticketSchema)
      .where(and(eq(ticketSchema.status, 'open'), eq(ticketSchema.assigneeId, user.id)))
      .all();
  }

  return await db.select().from(ticketSchema).where(eq(ticketSchema.status, 'open')).all();
});
