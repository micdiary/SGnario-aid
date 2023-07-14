import * as dotenv from "dotenv";
dotenv.config();

// Environment variables
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const EMAIL_NAME = process.env.EMAIL_NAME;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Server
export const PORT = 3001;
export const MONGODB_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@sgnario-aid.4zibt9s.mongodb.net/sgnario-aid?retryWrites=true&w=majority`;

// Error message
export const INTERNAL_SERVER_ERROR = "Internal Server Error";

// Reset password email
export const EMAIL_SUBJECT = "SGnario-Aid Password Change Request";
export const EMAIL_BODY = `
Hi {name}! <br><br>

It seems like you have forgotten your password.<br>
We received a request to reset the password for your account.<br><br>

To reset your password, click on the button below:<br>
<p>
  <a href="http://localhost:3000/reset-password?token={resetToken}" style="display:inline-block; background-color:#007bff; color:#fff; padding:10px 20px; text-decoration:none; border-radius: 4px;">
    Reset Password
  </a>
</p>

Alternatively, you can click on this <a href="http://localhost:3000/reset-password?token={resetToken}">link.</a><br><br>

If you did not request for a password reset, please ignore this email.
`;
