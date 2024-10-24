import express from "express";
import fs from "fs";
import { createClient } from "redis";
import path from "path";
import { promisify } from "util";

export const taskRoute = express();

export const client = createClient();
client.on('error', (err) => {
    console.error("Redis client error", err);
});

const filePath = '../../logs/task_logs.txt';
const logPath = path.join(__dirname, filePath);
const appendFileAsync = promisify(fs.appendFile);

taskRoute.post("/", async (req, res) => {
    const userId = req.headers.user_id;

    if (!userId) {
        return res.status(400).json({ message: "user_id header is required" });
    }

    const userTask = `${userId} - task completed at - ${new Date().toISOString()}\n`;

    try {
        await client.lPush("Tasks", JSON.stringify({ userTask }));

        await appendFileAsync(logPath, userTask);

        res.status(200).json({ message: "Submission received and stored." });
    } catch (error) {
        console.error("Error processing task:", error);
        res.status(500).json({ message: "Failed to store submission." });
    }
});
