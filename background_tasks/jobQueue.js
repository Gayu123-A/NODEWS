const Queue = require('bull'); // Node.js library for job queues, backed by Redis.
const nodemailer = require('nodemailer'); // To configure a Real Email Service

// Load Environment Variables
require('dotenv').config();

// Initialize the email queue (using Redis) 
const emailQueue = new Queue('emailQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use Outlook, Yahoo or SMTP settings
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password   
    }
});

// Process Email Jobs in the Background
emailQueue.process(async (job) => {
    const { email, subject, message } = job.data;

    console.log(`📧 Sending email to: ${email}...`);

    try {
        // Send email using Nodemailer
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: message
        });

        console.log(`✅ Email sent to ${email}!`);
    } catch (error) {
        console.error(`❌ Error sending email to ${email}:`, error);
    }
});

module.exports = { emailQueue };