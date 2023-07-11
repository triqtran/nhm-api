import config from '@config';
import StudentsDAL from 'dals/StudentsDAL';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

type MailOption = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

interface IMailer {
  generatePassword(user_id: number): string;
  sendEmail(mailOption: MailOption): Promise<any>;
  getHtmlForgotPasswordContent(password: string): string;
  sendEmailForgotPassword(email: string): Promise<any>;
}

class Mailer implements IMailer {
  smtpTrans = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: true,
    auth: {
      type: config.MAILER_AUTH_TYPE,
      user: config.SENDER_MAIL,
      pass: config.SENDER_PASSWORD,
      clientId: config.MAILER_CLIENT_ID,
      clientSecret: config.MAILER_CLIENT_SECRET,
      refreshToken: config.MAILER_REFRESH_TOKEN,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options);

  generatePassword(user_id: number): string {
    return '';
  }

  sendEmail(mailOption: MailOption): Promise<any> {
    return new Promise((resolve, reject) => {
      this.smtpTrans.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log('Error sending mail:', error);
          return reject(error);
        }
        return resolve(info.response);
      });
    });
  }

  getHtmlForgotPasswordContent(password: string): string {
    return `<div style="text-align: 'center';"><h1 style="color: '#B86E5F'">Nihaoma Mandarin Learning Lab</h1><h3>Your password is: </h3><div style="padding: '20px 30px'; background-color: '#E8E9EB'"><b>${password}</b></div><p>Please login and change your new password!</p></div>`;
  }

  sendEmailForgotPassword(mail: string): Promise<any> {
    return StudentsDAL.getStudentByMail(mail).then(student => {
      if (!student || student?.email) throw 'Can not find email to send!';
      const password = this.generatePassword(student.id);

      const mailOption = {
        from: 'Nihaoma Madarin Service',
        to: `${student.email}`,
        subject: 'Reset Password',
        html: this.getHtmlForgotPasswordContent(password),
      } as MailOption;

      return this.sendEmail(mailOption);
    });
  }
}

export default new Mailer();
