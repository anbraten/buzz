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

  const { name, email, phone, avatarUrl } = await readBody<{
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  }>(event);

  const customers = await db
    .update(customerSchema)
    .set({
      name,
      email,
      phone,
      avatarUrl,
      updatedAt: new Date(),
    })
    .where(eq(customerSchema.id, customerId))
    .returning();

  return customers?.[0];
});
