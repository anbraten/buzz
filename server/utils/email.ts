import nodemailer from 'nodemailer';
import Imap from 'imap';
import { Source, Attachment, HeaderValue, simpleParser } from 'mailparser';

export type Email = {
  subject: string;
  text?: string;
  date?: Date;
  headers: Record<string, HeaderValue>;
  attachments: Attachment[];
  html: string | false;
  from?: string;
  to: string[];
  cc: string[];
  bcc: string[];
};

export function useEmail() {
  const config = useRuntimeConfig();

  async function sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.tls,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    await transporter.sendMail({
      from: `"${config.email.name}" <${config.email.user}>`,
      to,
      subject,
      text,
    });
  }

  function parseEmail(stream: Source) {
    return new Promise<Email>((resolve, reject) => {
      simpleParser(stream, {}, (err, parsed) => {
        if (err) {
          reject(err);
          return;
        }

        const email: Email = {
          subject: parsed.subject || '',
          text: parsed.text,
          date: parsed.date,
          headers: {},
          html: parsed.html,
          from: parsed.from?.value?.[0]?.address,
          bcc: [],
          cc: [],
          to: [],
          attachments: [],
        };

        if (Array.isArray(parsed.to)) {
          email.to = parsed.to.map((v) => v.text);
        } else if (parsed.to) {
          email.to = [parsed.to.text];
        }

        if (Array.isArray(parsed.cc)) {
          email.cc = parsed.cc.map((v) => v.text);
        } else if (parsed.cc) {
          email.cc = [parsed.cc.text];
        }

        if (Array.isArray(parsed.bcc)) {
          email.bcc = parsed.bcc.map((v) => v.text);
        } else if (parsed.bcc) {
          email.bcc = [parsed.bcc.text];
        }

        parsed.headers.forEach((v, k) => {
          email.headers[k] = v;
        });

        if (Array.isArray(parsed.attachments)) {
          email.attachments = parsed.attachments;
        }

        resolve(email);
      });
    });
  }

  async function fetchUnreadEmails(imap: Imap): Promise<Email[]> {
    const emails: Email[] = [];

    return await new Promise<Email[]>((resolve, reject) => {
      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            imap.end();
            reject(err);
            return;
          }

          imap.search(['UNSEEN'], (err, results) => {
            if (err) {
              imap.end();
              reject(err);
              return;
            }

            let resolveWaitForAllEmails: () => void;
            const waitForAllEmails = new Promise<void>((resolve) => {
              resolveWaitForAllEmails = resolve;
            });

            if (results.length === 0) {
              imap.end();
              resolve([]);
              return;
            }

            const fetch = imap.fetch(results, {
              bodies: '',
              struct: true,
              markSeen: true,
            });

            fetch.on('message', (msg, seqno) => {
              msg.on('body', async (stream, info) => {
                const email = await parseEmail(stream);
                emails.push(email);

                if (emails.length === results.length) {
                  resolveWaitForAllEmails();
                }
              });
            });

            fetch.once('error', (err) => {
              imap.end();
              reject(err);
            });

            fetch.once('end', async () => {
              await waitForAllEmails;

              await new Promise<void>((r) =>
                imap.addFlags(results, '\\Seen', (err) => {
                  if (err) {
                    imap.end();
                    reject(err);
                    return;
                  }
                  r();
                }),
              );

              imap.end();
              resolve(emails);
            });
          });
        });
      });

      imap.on('error', (err: Error) => {
        reject(err);
      });

      imap.connect();
    });
  }

  return {
    sendEmail,
    fetchUnreadEmails,
  };
}
