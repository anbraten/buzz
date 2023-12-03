import { inArray } from 'drizzle-orm';
import { userSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const { ids: _ids } = getQuery<{ ids?: string }>(event);

  const ids = _ids?.split(',')?.map((id) => parseInt(id, 10)) ?? [];

  return (await db.select().from(userSchema).where(inArray(userSchema.id, ids)).all()).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }));
});
