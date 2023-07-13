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
  generateConfirmCode(length?: number): string;
  generateAndUpdateConfirmCode(
    user_id: number,
    lengthPassword?: number
  ): Promise<string>;
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

  generateConfirmCode(length = 10): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charsLength = chars.length;
    let password = '';

    for (let i = 0; i <= length; i++) {
      const randomNumber = Math.floor(Math.random() * charsLength);
      password += chars.charAt(randomNumber);
    }

    return password;
  }

  generateAndUpdateConfirmCode(
    user_id: number,
    lengthPassword = 10
  ): Promise<string> {
    const confirm_code = this.generateConfirmCode(lengthPassword);
    return StudentsDAL.updateStudentById(
      {
        confirm_code,
      },
      user_id
    ).then(() => confirm_code);
  }

  sendEmail(mailOption: MailOption): Promise<any> {
    return new Promise((resolve, reject) => {
      this.smtpTrans.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log('Error sending mail:', error);
          return reject(error);
        }
        console.log('Send email successfully!');
        return resolve(info.response);
      });
    });
  }

  getHtmlForgotPasswordContent(password: string): string {
    return `<div style="text-align: center; width: 100%; color: black;"><h1 style="color:#B86E5F;">Nihaoma Mandarin Learning Lab</h1><h3>Your verified code is: </h3><div style="padding: 20px 30px;"><b style="font-size: 30px;">${password}</b></div><p>Do not share this code for anyone!</p></div>`;
  }

  sendEmailForgotPassword(mail: string): Promise<any> {
    return StudentsDAL.getStudentByMail(mail).then(student => {
      if (!student) throw 'Can not find account for this email!';

      return this.generateAndUpdateConfirmCode(student.id).then(code => {
        const mailOption = {
          from: 'Nihaoma Mandarin Service',
          to: `${student.email}`,
          subject: '[Reset Password] - Nihaoma Mandarin Service',
          html: this.getHtmlForgotPasswordContent(code),
        } as MailOption;

        return this.sendEmail(mailOption);
      });
    });
  }
}

export default new Mailer();
