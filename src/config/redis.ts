import redis from "redis";
import { promisify } from "util";

const client = redis.createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);
const setAsync = promisify(client.set).bind(client);
const keysAsync = promisify(client.keys).bind(client);

export {
  getAsync as redisGetAsync,
  setAsync as redisSetAsync,
  keysAsync as redisKeysAsync,
  delAsync as redisDelAsync
};

export default client;
