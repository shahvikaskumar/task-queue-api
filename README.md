# Node.js API with Rate Limiting and Task Queuing

This project is a Node.js API that handles task processing with rate limiting and task queuing per user ID. The API ensures that each user can only process one task per second and a maximum of 20 tasks per minute. Any additional tasks are queued and processed according to the defined rate limits.

## Features

- **Rate Limiting**: Ensures that each user can only process one task per second and a maximum of 20 tasks per minute.
- **Task Queuing**: Tasks that exceed the rate limit are queued and processed in order.
- **Clustered API**: The API is designed to run on multiple CPU cores for improved scalability and fault tolerance.
- **Redis Integration**: Redis is used to manage rate limiting and task queuing.
- **Task Logging**: Task completion details are logged to a file for auditing purposes.

## Requirements

- Node.js
- Redis (running on `127.0.0.1:6379`)
- Docker (optional, for Redis installation)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahvikaskumar/task-queue.git
   cd node-api-rate-limiter
   ```
