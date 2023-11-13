"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
class Mailer {
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield nodemailer.createTransport({
                host: 'in-v3.mailjet.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'fcad925b86c6bf2cd57e06ea329dad43',
                    pass: 'ba813bbc3cc5e9af96665cdf8766aeee',
                },
            });
            const mailOptions = {
                from: 'admin@quantumcryptoinvestment.com',
                to: 'ekechukwuemeka25@gmail.com',
                subject: 'Hello from Nodemailer and Mailjet',
                text: 'This is a test email sent using Nodemailer with Mailjet SMTP.',
            };
            yield transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                }
                else {
                    console.log('Email sent:', info.response);
                }
            });
        });
    }
}
exports.default = Mailer;
//# sourceMappingURL=mailer.js.map