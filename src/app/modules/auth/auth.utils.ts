import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
    jwtPayload: { userId: string; role: string },
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload;
};

export const resetPasswordEmailHTMLTemplate = (link: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333333;
        }
        p {
          color: #555555;
        }
        footer {
          margin-top: 20px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Please reset your account password</h1>
        <p>Hello,</p>
        <p>This is the email for reset your PH University account password. Please change your password within 10 minutes.</p>
        <p>Password Reset Link: <a href=${link} target="_blank">Reset Password</a></p>
        <footer>
          <p>Thank You!</p>
        </footer>
      </div>
    </body>
    </html>
  `;
};
