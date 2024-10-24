import express from "express";
import { taskRateLimiter, oneTaskPerSecondLimiter } from "./routes/rateLimiter";
import { client, taskRoute } from "./routes/taskRoute";

const app = express();
app.use(express.json());
const port = 3000;

app.use('/api/v1/task', [taskRateLimiter, oneTaskPerSecondLimiter, taskRoute]);

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        process.on('SIGINT', () => {
            console.log('Shutting down gracefully...');
            server.close(async () => {
                await client.quit();
                console.log('Redis client disconnected');
                process.exit(0);
            });
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
        process.exit(1);
    }
}

startServer();