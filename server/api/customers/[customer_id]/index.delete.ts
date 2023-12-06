import { customerSchema } from '~/server/schemas';
import { eq } from 'drizzle-orm';

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

  await db.delete(customerSchema).where(eq(customerSchema.id, customerId)).execute();

  // TODO: delete assigned tickets

  return 'ok';
});
