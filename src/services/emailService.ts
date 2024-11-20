// src/services/emailService.ts
import 'dotenv/config';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

const createMailerInstance = () => {
  return new MailerSend({
    apiKey: process.env.SENDGRID_API_KEY ?? '',
  });
};

const defaultSender = new Sender('contato@zeloclub.com.br', 'Zeloclub');

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const mailerSend = createMailerInstance();

  const recipients = [new Recipient(email)];
  const personalization = [
    {
      email,
      data: {
        account_name: 'Zeloclub',
        support_email: 'contato@zeloclub.com.br',
        token,
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(defaultSender)
    .setTo(recipients)
    .setReplyTo(defaultSender)
    .setSubject('Recuperação de senha')
    .setTemplateId('vywj2lp61zj47oqz')
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendNotificationEmail = async (
  email: string,
  status: string,
  serviceName: string
) => {
  const mailerSend = createMailerInstance();

  const recipients = [new Recipient(email)];

  const crossStatus: { [key: string]: string } = {
    Accepted: 'Rejeitado',
    Rejected: 'Aceito',
  };

  const personalization = [
    {
      email,
      data: {
        account_name: 'Zeloclub',
        support_email: 'contato@zeloclub.com.br',
        status: crossStatus[status],
        serviceName,
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(defaultSender)
    .setTo(recipients)
    .setReplyTo(defaultSender)
    .setSubject(
      `O Status de sua aplicação foi atualizado para: ${crossStatus[status]}`
    )
    .setTemplateId('0r83ql3ky8m4zw1j')
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw new Error('Failed to send notification email');
  }



  
};
export const sendPasswordChangedNotification = async (email: string) => {
  const mailerSend = createMailerInstance();

  const recipients = [new Recipient(email)];
  const personalization = [
    {
      email,
      data: {
        account_name: 'Zeloclub',
        support_email: 'contato@zeloclub.com.br',
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(defaultSender)
    .setTo(recipients)
    .setReplyTo(defaultSender)
    .setSubject('Sua senha foi alterada com sucesso')
    .setTemplateId('your-template-id-for-password-changed')  
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending password change notification email:', error);
    throw new Error('Failed to send password change notification email');
  }
};