
const nodemailer = require('nodemailer');

export default class Mailer {
    
    async send() {
        
        // Create a Nodemailer transporter using Mailjet's SMTP settings
        const transporter = await nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false, // Set to true if you're using SSL
            auth: {
                user: 'fcad925b86c6bf2cd57e06ea329dad43',
                pass: 'ba813bbc3cc5e9af96665cdf8766aeee',
            },
        });

        const mailOptions = {
            from: 'admin@quantumcryptoinvestment.com', // Sender's email address
            to: 'ekechukwuemeka25@gmail.com', // Recipient's email address
            subject: 'Hello from Nodemailer and Mailjet',
            text: 'This is a test email sent using Nodemailer with Mailjet SMTP.',
        };
        
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        
    }
}