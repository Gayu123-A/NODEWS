const express = require('express');
const Queue = require('bull'); // Node.js library for job queues, backed by Redis.

const app = express(); 

app.use(express.json()); // For parsing the JSON request

/**
 * Connect to Redis
 *      A job queue named "emailQueue" is created and connected to Redis (127.0.0.1:6379).
 *      Redis acts as a temporary storage for jobs.
 **/ 
const jobQueue = new Queue('emailQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

/**
 * Queue a Job When a User Requests Email Sending
 *      When a user sends a POST request to /send-email, the server does NOT send the email immediately.
 *      Instead, the job is added to the queue.
 */
app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;

    if(!email || !subject || !message){
        return res.status(400).json({ error: "Missing required fields!" })
    }

    // Add email task to the Queue
    await jobQueue.add({ email, subject, message });

    res.json({ message: `Email job queued for ${email}` });
});

/**
 * Process Job (Worker): A Worker Picks Up the Job and Processes It Asynchronously 
 *      The worker fetches jobs from the queue.
 *      It simulates email sending by waiting (setTimeout for 3 seconds).
 *      Finally, it logs that the email has been sent.
 **/ 
jobQueue.process( async (job) => {
    console.log(`Sending email to ${job.data.email}...`);
    // Simulate sending email (Replace this with an actual email service)
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`Email sent to ${job.data.email}!`);
});

// Start Server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});