import { createClient } from "redis";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const client = createClient();

const filePath = '../logs/task_logs.txt';
const logPath = path.join(__dirname, filePath);
const appendFileAsync = promisify(fs.appendFile);

async function processSubmission(submission: string) {
    const userId = JSON.parse(submission);

    console.log(`Processing submission for problemId ${userId}...`);

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${userId}.`);
}

async function startWorker() {

    try {
        await client.connect();
        console.log("Worker connected to Redis.");

        while (true) {
            try {
                const submission:any = await client.BRPOP("Tasks", 0);
                const arra = submission.element.split('"');
                const userLog = `${arra[3]}\n`;
                await appendFileAsync(logPath, userLog);
                await processSubmission(submission.element);
            } catch (error) {
                console.error("Error processing submission:", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();