import nodemailer from "nodemailer";
import {config, options } from "../../config";

export const send = async(mailAddress: string, otp: string): Promise<boolean>  => {
    const mail = {
        from: process.env.senderAddress,
        to: `${mailAddress}`,
        subject: `[${process.env.mailedName}] GroupWorksワンタイムパスワード`,
        text: `パスワードは以下です\n${otp}`
    };

    try {
        const transport = nodemailer.createTransport(options);
        const result = await transport.sendMail(mail);
        console.log(result);
    } catch(e: any) {
        console.log(e.message);
        return false;
    }


    return true;
}