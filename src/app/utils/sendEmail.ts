import nodemailer, { TransportOptions } from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: config.smtp_port,
        secure: config.NODE_ENV === 'production',
        auth: {
            user: config.transporter_email_auth_user,
            pass: config.transporter_email_auth_pass,
        },
    } as TransportOptions);

    await transporter.sendMail({
        from: config.transporter_email_auth_user,
        to,
        subject:
            'Important: Reset Your Account Password within 10 mins! (PH University)',
        html,
    });
};
