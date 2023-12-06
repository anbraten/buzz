import { eq } from 'drizzle-orm';
import { customerSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  return await db.select().from(customerSchema).all();
});
