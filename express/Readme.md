## Node.js API with Rate Limiting and Task Queueing

### Overview
This project implements a Node.js API that handles user-submitted tasks with rate limiting and queuing. The tasks are managed in a Redis queue and processed by a separate worker that pops tasks from the queue for execution. The system ensures that tasks are processed at a controlled rate per user and stores task completion logs.

### Features
1. Rate Limiting: Enforces a rate limit of 1 task per second and 20 tasks per minute for each user.
2. Task Queuing: Tasks exceeding the rate limit are queued in Redis and processed in order.
3. Worker for Task Processing: A separate worker service pops tasks from the Redis queue and processes them.
4. Logging: Task completion details, including the user ID and timestamp, are logged in a file.
5. Resilience: The API is designed to handle failures gracefully, including Redis connection issues and server shutdowns.

### Project Structure
RateLimiter/
│
├── express/
│   ├── logs/
│   └── src/
│       ├── routes/
│       │   ├── rateLimiter.ts   # Rate limiting middleware
│       │   └── taskRoute.ts     # Task processing route
│       └── index.ts             # Entry point for the express server
│
├── worker/
│   ├── logs/
│   └── src/
│       └── index.ts             # Worker script to pop and process tasks from Redis queue



### Setup
1. Unzip the archive folder.
2. Run `npm install` to install the dependencies.
3. Run `npx tsc` to build the dist folder.
4. Run `node dist/index.js` to start the server.
5. Start Redis server.
6. The API will be available at `http://localhost:3000/api/v1/task`.

### Setup Redis Locally through Docker
1. Docker Pull Redis //Install Redis Image locally
2. docker run --name my-redis -d -p 6379:6379 redis
3. docker exec -it container_id /bin/bash
4. redis-cli

### API Endpoints
POST /api/v1/task
1. Description: Submits a task for processing. The task is subject to rate limiting, and if the limit is exceeded, it will be queued.
2. Response:
200 OK: Task has been accepted and logged.
429 Too Many Requests: Rate limit exceeded, please try again later.
500 Internal Server Error: Failed to process or store the task.

### Error Handling
The API and worker include comprehensive error handling:
1. Redis Errors: If Redis fails to connect or process a task, the error is logged, and a 500 response is returned to the client.
2. Rate Limiting: If the rate limit is exceeded, a 429 response is returned with a descriptive message.
3. Graceful Shutdown: The server and worker listen for SIGINT to ensure that Redis is properly disconnected before the server shuts down.

### Testing
- Use Postman or any API client to send POST requests to the `/api/v1/task` route.
- Use different `user_id` values to test the rate limiting and queueing mechanism.
- For Testing Queue Both the Redis server of express and Worker needs to run.
- Build the dist folder in both the directories and then run the servers.
        -npx tsc
        -node dist/index.js
