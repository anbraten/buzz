import type { H3Event, SessionConfig } from 'h3';
import { User, userSchema } from '../schemas';
import { and, eq } from 'drizzle-orm';

const sessionConfig: SessionConfig = useRuntimeConfig().auth || {};

export type AuthSession = {
  userId: number;
};

export async function useAuthSession(event: H3Event) {
  const session = await useSession<AuthSession>(event, sessionConfig);
  return session;
}

export async function getUser(event: H3Event): Promise<User | undefined> {
  const session = await useAuthSession(event);
  if (!session.data?.userId) {
    return undefined;
  }

  return await db.select().from(userSchema).where(eq(userSchema.id, session.data.userId)).get();
}

export async function requireUser(event: H3Event): Promise<User> {
  const user = await getUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return user;
}

export async function getSessionHeader(event: H3Event) {
  const config = useRuntimeConfig();

  const sessionName = config.auth.name || 'h3';

  let sealedSession: string | undefined;

  // Try header first
  if (config.sessionHeader !== false) {
    const headerName =
      typeof config.sessionHeader === 'string'
        ? config.sessionHeader.toLowerCase()
        : `x-${sessionName.toLowerCase()}-session`;
    const headerValue = event.node.req.headers[headerName];
    if (typeof headerValue === 'string') {
      sealedSession = headerValue;
    }
  }

  // Fallback to cookies
  if (!sealedSession) {
    sealedSession = getCookie(event, sessionName);
  }

  if (!sealedSession) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return { [`x-${sessionName.toLowerCase()}-session`]: sealedSession };
}
