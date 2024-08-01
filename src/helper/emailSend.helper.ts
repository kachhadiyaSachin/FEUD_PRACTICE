import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEMAIL = async (email:any,subject:any,text:any,message:any) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOption = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
        html: message,
    }; 
    // const info = await transporter.sendMail(mailOption);
    transporter.sendMail(mailOption, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent:'+ info.response);
        }
    });
} 