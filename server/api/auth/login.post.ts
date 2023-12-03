import { userSchema } from '../../schemas';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email?: string; password?: string }>(event);
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'email and password are required',
    });
  }

  const user = await db.select().from(userSchema).where(eq(userSchema.email, email)).get();
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid email or password',
    });
  }

  // TODO: hash password
  if (user.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid email or password',
    });
  }

  const session = await useAuthSession(event);
  await session.update({
    userId: user.id,
  });

  return { ok: true };
});
