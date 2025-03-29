const Queue = require('bull');

// Initialize the job queue for email notifications
const emailQueue = new Queue('emailQueue', {
    redis: { host: '127.0.0.1', port: 6379 }
});

// Process email jobs in the background
emailQueue.process(async (job) => {
    const { email, subject, message } = job.data;
    console.log(`Sending email to: ${email}...`);

    // Simulate sending email (replace with actual email service)
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log(`Email sent to ${email}!`);
});

module.exports = { emailQueue };