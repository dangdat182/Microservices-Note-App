const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.connect()
    .then(() => console.log('Connected to Redis...'))
    .catch(err => console.error('Redis connection error:', err));

module.exports = client;
