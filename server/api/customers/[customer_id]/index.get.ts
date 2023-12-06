import { eq } from 'drizzle-orm';
import { customerSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const _customerId = getRouterParam(event, 'customer_id');
  if (!_customerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'customer_id is required',
    });
  }
  const customerId = parseInt(_customerId, 10);

  return await db.select().from(customerSchema).where(eq(customerSchema.id, customerId)).get();
});
