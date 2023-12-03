import { ticketSchema } from '../../schemas';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  return await db.select().from(ticketSchema).all();
});
