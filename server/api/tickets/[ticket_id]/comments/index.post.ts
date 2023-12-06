import { eq, type InferInsertModel } from 'drizzle-orm';
import { customerSchema, ticketCommentSchema, ticketSchema } from '~/server/schemas';
import { useEmail } from '~/server/utils/email';

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const _ticketId = getRouterParam(event, 'ticket_id');
  if (!_ticketId) {
    throw createError({
      message: 'ticket_id is required',
      status: 400,
    });
  }
  const ticketId = parseInt(_ticketId, 10);

  const { content, type } = await readBody<{
    content?: string;
    type?: string;
  }>(event);

  if (!type) {
    throw createError({
      message: 'type is required',
      status: 400,
    });
  }

  if (!content) {
    throw createError({
      message: 'content is required',
      status: 400,
    });
  }

  const comment: InferInsertModel<typeof ticketCommentSchema> = {
    ticketId,
    type,
    content,
    agentId: user.id,
    createdAt: new Date(),
  };

  const comments = await db.insert(ticketCommentSchema).values(comment).returning();

  if (comment.type === 'agent-reply' || comment.type === 'customer-reply') {
    await db
      .update(ticketSchema)
      .set({
        updatedAt: new Date(),
        unreadAgentReplies: comment.type === 'agent-reply' ? 1 : undefined,
        unreadCustomerReplies: comment.type === 'customer-reply' ? 1 : undefined,
      })
      .where(eq(ticketSchema.id, ticketId))
      .execute();
  }

  if (comment.type === 'agent-reply') {
    const { sendEmail } = useEmail();

    const ticket = await db.select().from(ticketSchema).where(eq(ticketSchema.id, ticketId)).get();

    const customer = await db.select().from(customerSchema).where(eq(customerSchema.id, ticket!.customerId)).get();

    if (customer?.email) {
      await sendEmail(customer.email, `Re: ${ticket?.title} #${ticketId}`, content);
    }
  }

  return comments?.[0];
});
