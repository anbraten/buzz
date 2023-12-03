import { eq } from 'drizzle-orm';
import { userSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const _userId = getRouterParam(event, 'userId');
  if (!_userId) {
    throw createError({ status: 400, message: 'userId is required' });
  }
  const userId = parseInt(_userId, 10);

  const user = await db.select().from(userSchema).where(eq(userSchema.id, userId)).get();
  if (!user) {
    throw createError({ status: 404, message: 'user not found' });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
});
