import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
            user: 'golammursalin309@gmail.com',
            pass: 'yttg efvn hxjn pqom',
        },
    });

    await transporter.sendMail({
        from: 'golammursalin309@gmail.com',
        to,
        subject: 'Reset Your Password within 10 mins! (PH University)',
        text: '',
        html,
    });
};
