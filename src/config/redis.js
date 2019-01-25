import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on("error", (err) =>{
  console.log("Error " + err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export {
  getAsync as redisGetAsync,
  setAsync as redisSetAsync
}

export default client;
