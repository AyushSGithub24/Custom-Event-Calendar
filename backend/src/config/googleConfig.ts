import {google} from "googleapis";
import dotenv from "dotenv"
dotenv.config();


export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
   process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI
);

export const scopes = [
 "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar" 
];



