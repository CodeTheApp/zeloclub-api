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
export const sendPasswordChanged = async (email: string) => {
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
    .setTemplateId('3zxk54vw016ljy6v')  
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending password change notification email:', error);
    throw new Error('Failed to send password change notification email');
  }
};

export const sendEmailVerification = async (email: string) => {
  const mailerSend = createMailerInstance();

  const recipients = [new Recipient(email)];
  const personalization = [
    {
      email,
      data: {
        title: 'Verifique seu e-mail',
        content: '<p>Olá,</p><p>Por favor, clique no botão abaixo para verificar seu endereço de e-mail e acessar os recursos do Zeloclub.</p>',
        cta_text: 'Verificar E-mail',
        cta_link: 'http://your-verification-link.com', // Link de verificação dinâmico
        support_email: 'contato@zeloclub.com.br',
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(defaultSender)
    .setTo(recipients)
    .setReplyTo(defaultSender)
    .setSubject('Verificação de E-mail Obrigatória')
    .setTemplateId('3zxk54vw016ljy6v')  // ID do template para verificação de e-mail
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending email verification notification:', error);
    throw new Error('Failed to send email verification notification');
  }
};

export const sendTermsAcceptanceNotification = async (email: string) => {
  const mailerSend = createMailerInstance();

  const recipients = [new Recipient(email)];
  const personalization = [
    {
      email,
      data: {
        title: 'Aceite os Termos de Uso',
        content: '<p>Olá,</p><p>Para continuar utilizando os recursos do Zeloclub, é necessário aceitar os nossos Termos de Uso. Clique no botão abaixo para aceitar.</p>',
        cta_text: 'Aceitar Termos',
        cta_link: 'http://your-terms-acceptance-link.com', // Link dinâmico para aceitação dos termos
        support_email: 'contato@zeloclub.com.br',
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(defaultSender)
    .setTo(recipients)
    .setReplyTo(defaultSender)
    .setSubject('Aceitação dos Termos Obrigatória')
    .setTemplateId('3zxk54vw016ljy6v')  // ID do template para aceitação dos termos
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending terms acceptance notification:', error);
    throw new Error('Failed to send terms acceptance notification');
  }
};

