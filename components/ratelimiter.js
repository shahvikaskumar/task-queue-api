const Redis = require('ioredis');

// Initialize Redis client with retry strategy
const redis = new Redis({
    host: '127.0.0.1',  // or use the Redis container IP
    port: 6379,
    retryStrategy: (times) => {
        // Retry after 2 seconds
        return Math.min(times * 50, 2000);
    }
});


// Handle Redis connection errors
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Rate limits for each user
const Rate_limit_Second =1;
const Rate_Limit_Minute = 20;

// Rate limiter function to enforce limits per user
async function ratelimiter(userid) {
    const currenttime = Math.floor(Date.now() / 1000);
    const userkey = `rate_limit:${userid}`;

    // Retrieve rate limit data from Redis
    const ratelimitdata = await redis.hgetall(userkey);

    let { lastRequestTime, taskCount} = ratelimitdata;
    lastRequestTime = parseInt(lastRequestTime, 10) || 0;
    taskCount = parseInt(taskCount, 10 ) || 0;

    // Reset task count if more than a minute has passed
    if(currenttime - lastRequestTime >=60){
        taskCount = 0;
    }

    // Enforce one task per second rule
    if (currenttime - lastRequestTime < Rate_limit_Second && taskCount > 0){
        return false;
    }

    // Enforce 20 tasks per minute rule
    if(taskCount >= Rate_Limit_Minute){
        return false;
    }

    // Update rate limit data in Redis
    await redis.hmset(userkey, {
        lastRequestTime:currenttime,
        taskCount:taskCount + 1
    });

    // Set key expiration to 61 seconds to manage rate limiting
    await redis.expire(userkey, 61);

    return true;
}

module.exports = { ratelimiter};