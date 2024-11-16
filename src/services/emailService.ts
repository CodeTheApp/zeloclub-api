import "dotenv/config";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.SENDGRID_API_KEY ?? "",
  });

  const sentFrom = new Sender("contato@zeloclub.com.br", "Zeloclub");

  const recipients = [new Recipient(email)];

  const personalization = [
    {
      email: email,
      data: {
        account_name: "Zeloclub",
        support_email: "contato@zeloclub.com.br",
        token: token,
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Recuperação de senha")
    .setTemplateId("vywj2lp61zj47oqz")
    .setPersonalization(personalization);

  await mailerSend.email.send(emailParams);
};

// TODO: Mudar para email de notificação de aplicação
export const sendNotificationEmail = async (
  email: string,
  subject: string,
  content: string
) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.SENDGRID_API_KEY ?? "",
  });

  const sentFrom = new Sender("contato@zeloclub.com.br", "Zeloclub");

  const recipients = [new Recipient(email)];

  const personalization = [
    {
      email: email,
      data: {
        account_name: "Zeloclub",
        support_email: "contato@zeloclub.com.br",
        content: content,
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setTemplateId("vywj2lp61zj47oqz")
    .setPersonalization(personalization);

  await mailerSend.email.send(emailParams);
};
