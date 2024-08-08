import { Twilio } from "twilio";
import dotenv from 'dotenv';
dotenv.config();


export const otpSEND = async (phonenumber:any,message:any) => {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_NUMBER;
    const client = new Twilio(accountSid, authToken);
    
    await client.messages.create({
        from: twilioNumber,
        to: phonenumber,
        body: message,
    });
};