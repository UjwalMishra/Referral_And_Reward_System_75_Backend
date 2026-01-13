import nodemailer from "nodemailer"
import {env} from "./env.config"

export const mailTransporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    },
});