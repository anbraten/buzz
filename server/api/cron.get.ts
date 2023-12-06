import Imap from 'imap';
import { customerSchema, ticketCommentSchema, ticketSchema } from '../schemas';
import { Email, useEmail } from '../utils/email';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw createError({
      message: 'Unauthorized',
      status: 401,
    });
  }

  const config = useRuntimeConfig();

  const imap = new Imap({
    user: config.email.user,
    password: config.email.password,
    host: config.email.imap.host,
    port: config.email.imap.port,
    tls: config.email.imap.tls,
  });

  const { fetchUnreadEmails, sendEmail } = useEmail();

  let emails: Email[] = [];
  try {
    emails = await fetchUnreadEmails(imap);
  } catch (err) {
    console.error('error fetching inbox', err);
    return 'err';
  }

  for await (const email of emails) {
    const ticketId = email.subject.match(/#(\d+)/)?.[1];
    if (ticketId) {
      // TODO: check if customer is allowed to reply to this ticket
      await db.insert(ticketCommentSchema).values({
        ticketId: parseInt(ticketId, 10),
        content: email.text || '',
        createdAt: new Date(),
        type: 'customer-reply',
      });

      await sendEmail(
        email.from || '',
        'Re: ' + email.subject,
        'Thank you for your reply!\n\nWe will get back to you soon.',
      );
    } else {
      const customer = await db.select().from(customerSchema).where(eq(customerSchema.email, email.from!)).get();

      if (!customer) {
        console.error('customer not found');
        continue;
      }

      const tickets = await db
        .insert(ticketSchema)
        .values({
          title: email.subject,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'open',
          priority: 0,
          customerId: customer?.id,
          unreadCustomerReplies: 1,
        })
        .returning();

      if (tickets.length !== 1) {
        console.error('error creating ticket');
        continue;
      }

      const ticket = tickets?.[0];

      await db.insert(ticketCommentSchema).values({
        ticketId: ticket.id,
        content: email.text || '',
        createdAt: new Date(),
        type: 'customer-reply',
      });
    }
  }

  return 'ok ' + emails.length;
});
