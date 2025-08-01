import { Resend } from "resend";

//this creates a new instance of Resend with the API key from environment variables
//resend is used to send emails
// this is just like a client that we can use to send emails
export const resend = new Resend(process.env.RESEND_API_KEY || "");