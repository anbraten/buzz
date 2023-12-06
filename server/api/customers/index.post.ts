import { customerSchema } from '~/server/schemas';
import type { InferInsertModel } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const { name, email, phone, avatarUrl } = await readBody<{
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  }>(event);

  const customer: InferInsertModel<typeof customerSchema> = {
    name,
    email,
    phone,
    avatarUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const customers = await db.insert(customerSchema).values(customer).returning();
  return customers?.[0];
});
