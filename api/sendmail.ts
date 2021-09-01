import { Handler } from '@netlify/functions';
import * as nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

class MailerService {
  smtpConfig: smtpTransport.SmtpOptions;
  transporter: nodemailer.Transporter;
  smOptions: nodemailer.SendMailOptions;

  constructor() {}

  async sendMail(
    fromName: string,
    fromAddress: string,
    subject: string,
    message: string
  ) {
    if (process.env.MAIL_LOGIN) {
      this.smtpConfig = {
        host: process.env.MAIL_HOST as string,
        port: parseInt(process.env.MAIL_PORT as string),
        secure:
          process.env.MAIL_SECURE != null
            ? process.env.MAIL_SECURE === 'true'
            : false,
        auth: {
          user: process.env.MAIL_LOGIN as string,
          pass: process.env.MAIL_PASSWORD as string
        }
      };
    } else {
      // this.smtpConfig = {
      //   host: 'mail.shaw.ca',
      //   port: 25,
      //   secure: false,
      //   debug: true,
      //   logger: true
      // };
      this.smtpConfig = {
        host: 'intratela-com.mail.protection.outlook.com',
        port: 25,
        secure: true,
        debug: true,
        logger: true
      };
    }

    this.transporter = nodemailer.createTransport(this.smtpConfig);
    this.smOptions = {
      to:
        process.env.MAIL_TO != null
          ? (process.env.MAIL_TO as string)
          : 'hfournier@intratela.com',
      from: `${fromName} <${fromAddress}>`,
      subject: subject,
      text: `${message}/n/n${fromName}/n${fromAddress}`,
      html: `<div>${message}</div><br /><div>${fromName}</div><div>${fromAddress}</div>`
    };

    return new Promise<void>(
      (resolve: (msg: any) => void, reject: (err: Error) => void) => {
        this.transporter.sendMail(this.smOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(`Message Sent ${info.response}`);
            resolve(`Message Sent ${info.response}`);
          }
        });
      }
    );
  }
}

const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const data = JSON.parse(event.body);

    const mailService = new MailerService();
    const result = await mailService.sendMail(
      data.name,
      data.email,
      data.subject,
      data.message
    );
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(error)
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Your message was sent successfully! Thank you.'
    })
  };
};

export { handler };
