## Node.js API with Rate Limiting and Task Queueing

### Setup
1. Unzip the archive folder.
2. Run `npm install` to install the dependencies.
3. Start Redis server.
4. This redis worker will pop the task messages from the Queue and stores the data log in the logs folder.

### Setup Redis Locally through Docker
1. Docker Pull Redis //Install Redis Image locally
2. docker run --name my-redis -d -p 6379:6379 redis
3. docker exec -it container_id /bin/bash
4. redis-cli

### Testing
- Use Postman or any API client to send POST requests to the `/api/v1/task` route.
- Use different `user_id` values to test the rate limiting and queueing mechanism.
