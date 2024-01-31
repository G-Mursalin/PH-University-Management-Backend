import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DB_URL,
    bcrypt_salt: process.env.BCRYPT_SALT,
    default_password: process.env.DEFAULT_PASSWORD,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expired_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expired_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    transporter_email_auth_user: process.env.TRANSPORTER_EMAIL_AUTH_USER,
    transporter_email_auth_pass: process.env.TRANSPORTER_EMAIL_AUTH_PASS,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
};
