import { authenticator, totp } from "otplib";
import * as dotenv from "dotenv";
dotenv.config();


export const generageOntimePass = (): string => {
    const secret = process.env.secret;
    console.log(secret);
    if (secret === undefined) {
        throw new Error("secret is undefined");
    }
    const token = totp.generate(secret);
    try {
        const isValid = totp.check(token, secret);
    } catch(e) {
        console.error(e);
    }
    

    return token;
}